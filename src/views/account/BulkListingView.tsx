import { Flex, Box, Grid, useDisclosure, VStack } from "@chakra-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { BigNumber } from "ethers";
import { MINIMUM_LISTING_PRICE } from "config";
import { numberInputErrorCheck } from "utils/numberInputErrorCheck";
import { ArrowUpLeftIcon, Text, Link, Modal, ModalBody, Button } from "uikit";
import { useDurationLabels } from "hooks/useDurationLabels";
import { useScrollToTopOnMount } from "hooks/useScrollToTopOnMount";
import { useToast } from "hooks/useToast";
import usePreviousValue from "hooks/usePreviousValue";
import { useMultiselect } from "components/Multiselect/hooks/useMultiselect";
import { useApproveAllInSequence } from "./components/BulkListing/hooks/approveAllInSequence";
import { ListingData, useListAllInSequence } from "./components/BulkListing/hooks/listAllInSequence";
import { Container } from "components/Layout/Container";
import { TransactionView } from "./components/BulkListing/TransactionView";
import { BulkListingInputTable } from "./components/BulkListing/BulkListingInputTable";
import { getTokenKey, useMultiInput } from "./components/BulkListing/hooks/multiInput";
import { ScheduleView } from "./components/BulkListing/ScheduleView";
import { ListingPane } from "./components/BulkListing/shared";
import { CompleteView } from "./components/BulkListing/CompleteView";
import { SIDEBAR_MAX_HEIGHT } from "components/Layout/FilterLayout";

export enum ListingStage {
  SCHEDULE,
  TRANSACTION,
  COMPLETE,
}
const minimumListingPrice = BigNumber.from(MINIMUM_LISTING_PRICE);

export const BulkListingView: React.FC = () => {
  const { t } = useTranslation();
  useScrollToTopOnMount();
  const toast = useToast();
  const exitDisclosure = useDisclosure();
  const [listingStage, setListingStage] = useState(ListingStage.SCHEDULE);
  const { clearCart, selectedItems } = useMultiselect();

  const { setValueForKey, setValueForAll, inputValues } = useMultiInput(
    selectedItems.map((nft) => getTokenKey(nft.collection.address, nft.tokenId))
  );

  const isPriceInvalid = Object.keys(inputValues).some((key) => {
    const isInvalid = numberInputErrorCheck(inputValues[key], {
      min: minimumListingPrice,
      required: true,
    });
    return !!isInvalid;
  });

  const { getDefaultDurationOption } = useDurationLabels();
  const [endTimeMs, setEndTimeMs] = useState(new Date(getDefaultDurationOption().value).getTime());

  // tracking approval status
  const { getUniqueCollections } = useMultiselect();
  const uniqueCollections = getUniqueCollections();
  const { sortedCollections, handleApproveCollections } = useApproveAllInSequence(uniqueCollections);
  const {
    approved: approvedCollections,
    txPending: txPendingCollections,
    txNeedsConfirmation: txNeedsConfirmationCollections,
    needsApproval: needsApprovalCollections,
    txDeclined: txDeclinedCollections,
  } = sortedCollections;

  // tracking listing status
  const listingData = selectedItems.map<ListingData>((nft) => {
    const tokenKey = getTokenKey(nft.collection.address, nft.tokenId);
    return {
      priceInEth: inputValues[tokenKey],
      endTime: endTimeMs,
    };
  });
  const { sortedTokens, handleListAllInSequence, tokenStatusMap, skipToken } = useListAllInSequence(
    selectedItems,
    listingData
  );
  const {
    needsListing: needsListingTokens,
    needsSigning: needsSigningTokens,
    declined: declinedTokens,
    listed: listedTokens,
    skipped: skippedTokens,
  } = sortedTokens;

  const headerRef = useRef<null | HTMLDivElement>(null);

  const onStartListing = async () => {
    setListingStage(ListingStage.TRANSACTION);
    if (headerRef.current) {
      headerRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    /**
     * If these fail anywhere, the flow will exit through the catch block and the corresponding `declined` array
     * will contain the failing token.
     * To resume approvals, call onStartListing again. handleApproveCollections() will skip approved collections
     */
    try {
      await handleApproveCollections();
    } catch (error) {
      toast({
        title: t("Transaction Declined!"),
        description: t("You didn't sign the transaction in your wallet."),
        status: "error",
      });
    }
  };

  const handleSubmitListing = useCallback(async (): Promise<void> => {
    /**
     * Listing will always proceed in the order set by `selectedItems`.
     * If a tx is declined, listing will stop at that token. Resume from the appropriate index
     */
    const tokensRemaining = needsListingTokens.length + declinedTokens.length;
    const resumeIndex = selectedItems.length - tokensRemaining;
    try {
      await handleListAllInSequence(resumeIndex);
      setListingStage(ListingStage.COMPLETE);
    } catch (error) {
      toast({
        title: t("Transaction Declined!"),
        description: t("You didn't sign the transaction in your wallet."),
        status: "error",
      });
    }
  }, [declinedTokens.length, handleListAllInSequence, needsListingTokens.length, selectedItems.length, t, toast]);

  // set up effect to listen for "all collections approved"
  const approvedCollectionsLength = approvedCollections.length;
  const previousApprovedCollectionsLength = usePreviousValue(approvedCollectionsLength) || 0;
  const isReadyToStartListing =
    listingStage === ListingStage.TRANSACTION &&
    approvedCollectionsLength === uniqueCollections.length &&
    approvedCollectionsLength > previousApprovedCollectionsLength;
  useEffect(() => {
    if (isReadyToStartListing) {
      handleSubmitListing();
    }
  }, [isReadyToStartListing, handleSubmitListing]);

  /**
   * Moving a token from "declined" to "skipped"
   * The useEffect picks up on this change and continues listing
   */
  const onSkipToken = () => {
    const { collection, tokenId } = declinedTokens[0];
    skipToken(getTokenKey(collection.address, tokenId));
  };
  const skippedTokensLength = skippedTokens.length;
  const previousSkippedTokensLength = usePreviousValue(skippedTokensLength) || 0;
  const isTokenSkipped = skippedTokensLength > previousSkippedTokensLength;
  useEffect(() => {
    if (isTokenSkipped) {
      handleSubmitListing();
    }
  }, [handleSubmitListing, isTokenSkipped]);

  const onClickBackToItems = () => {
    if (listingStage === ListingStage.COMPLETE) {
      clearCart();
    }
    window.history.back();
  };

  const headerText = {
    [ListingStage.SCHEDULE]: t("Bulk Listing"),
    [ListingStage.TRANSACTION]: t("Listing in Progress..."),
    [ListingStage.COMPLETE]: t("Bulk Listing"),
  };

  return (
    <Container py={8}>
      <Grid
        width="100%"
        gridTemplateAreas={{
          base: listingStage === ListingStage.SCHEDULE ? `"header" "table" "summary"` : `"header" "summary" "table"`,
          xl: `"header summary" "table summary"`,
        }}
        rowGap={8}
        columnGap={{ base: 0, xl: 8 }}
        gridTemplateColumns={{ xl: "auto 320px" }}
      >
        <Box ref={headerRef} gridArea="header">
          <Link onClick={exitDisclosure.onOpen}>
            <Flex alignItems="center" mb={4}>
              <ArrowUpLeftIcon boxSize={5} mr={1} color="link-01" />
              <Text textStyle="detail" bold color="link-01">
                {t("Back")}
              </Text>
            </Flex>
          </Link>
          <Text textStyle="display-03" bold>
            {headerText[listingStage]}
          </Text>
        </Box>
        <BulkListingInputTable
          gridArea="table"
          inputValues={inputValues}
          setValueForKey={setValueForKey}
          setValueForAll={setValueForAll}
          listingStage={listingStage}
          tokenStatusMap={tokenStatusMap}
        />
        <ListingPane
          gridArea="summary"
          width={{ base: "100%", xl: "320px" }}
          maxWidth="360px"
          margin={{ base: "auto", xl: "inherit" }}
          maxHeight={listingStage === ListingStage.SCHEDULE ? SIDEBAR_MAX_HEIGHT : "auto"}
          overflowY={listingStage === ListingStage.SCHEDULE ? "inherit" : "auto"}
        >
          {listingStage === ListingStage.SCHEDULE && (
            <ScheduleView
              isPriceValid={!isPriceInvalid}
              setEndTimeMs={setEndTimeMs}
              onStartListing={onStartListing}
              lowPriceWarning={false}
            />
          )}
          {listingStage === ListingStage.TRANSACTION && (
            <TransactionView
              isPriceValid={!isPriceInvalid}
              setListingStage={setListingStage}
              lowPriceWarning={false}
              endTime={endTimeMs}
              approvedCollections={approvedCollections}
              txPendingCollections={txPendingCollections}
              txNeedsConfirmationCollections={txNeedsConfirmationCollections}
              needsApprovalCollections={needsApprovalCollections}
              txDeclinedCollections={txDeclinedCollections}
              needsListingTokens={needsListingTokens}
              needsSigningTokens={needsSigningTokens}
              declinedTokens={declinedTokens}
              listedTokens={listedTokens}
              skippedTokens={skippedTokens}
              onResumeAfterApprovalError={onStartListing}
              onResumeAfterListingError={handleSubmitListing}
              onSkipToken={onSkipToken}
            />
          )}
          {listingStage === ListingStage.COMPLETE && <CompleteView onClickBackToItems={onClickBackToItems} />}
        </ListingPane>
      </Grid>
      {/* Exit Modal */}
      <Modal
        isOpen={exitDisclosure.isOpen}
        variant="standard"
        size="sm"
        title={t("Stop Listing?")}
        onClose={exitDisclosure.onClose}
        closeOnOverlayClick={false}
      >
        <ModalBody>
          <VStack spacing={2}>
            <Text textStyle="detail" color="text-02" mb={4}>
              {t("Any listings you already completed will remain active even if you leave during this process.")}
            </Text>
            <Button onClick={exitDisclosure.onClose} isFullWidth>
              {t("Keep Listing")}
            </Button>
            <Button variant="outline" colorScheme="secondary" onClick={onClickBackToItems} isFullWidth>
              {t("Leave")}
            </Button>
          </VStack>
        </ModalBody>
      </Modal>
    </Container>
  );
};
