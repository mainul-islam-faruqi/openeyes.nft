import { Divider, Flex, VStack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { Button, Text } from "uikit";
import { navHeightResponsive } from "uikit/theme/global";
import { ListingStage } from "views/account/BulkListingView";
import { useMultiselect } from "components/Multiselect/hooks/useMultiselect";
import { formatTimestampAsDateString } from "utils/format";
import { ApproveTransactionStep } from "./ApproveTransactionStep";
import { NFTCard, NFTCardCollection } from "types/graphql";
import { ListTransactionStep } from "./ListTransactionStep";

interface TransactionViewProps {
  isPriceValid: boolean;
  lowPriceWarning: boolean;
  endTime: number;
  setListingStage: (listingStage: ListingStage) => void;
  approvedCollections: NFTCardCollection[];
  txPendingCollections: NFTCardCollection[];
  txNeedsConfirmationCollections: NFTCardCollection[];
  needsApprovalCollections: NFTCardCollection[];
  txDeclinedCollections: NFTCardCollection[];
  needsListingTokens: NFTCard[];
  needsSigningTokens: NFTCard[];
  declinedTokens: NFTCard[];
  listedTokens: NFTCard[];
  skippedTokens: NFTCard[];
  onResumeAfterApprovalError: () => void;
  onResumeAfterListingError: () => void;
  onSkipToken: () => void;
}

export const TransactionView: React.FC<TransactionViewProps> = ({
  approvedCollections,
  txPendingCollections,
  txNeedsConfirmationCollections,
  needsApprovalCollections,
  txDeclinedCollections,
  endTime,
  needsListingTokens,
  needsSigningTokens,
  declinedTokens,
  listedTokens,
  skippedTokens,
  onResumeAfterApprovalError,
  onResumeAfterListingError,
  onSkipToken,
}) => {
  const { t } = useTranslation();
  const { getUniqueCollections, selectedItems } = useMultiselect();
  const uniqueCollections = getUniqueCollections();

  const isListingPhase = approvedCollections.length === uniqueCollections.length;
  const isApprovalError = txDeclinedCollections.length > 0;
  const isListingError = declinedTokens.length > 0;
  const isAnyError = isApprovalError || isListingError;

  const handleButtonClick = () => {
    if (isApprovalError) {
      return onResumeAfterApprovalError();
    }
    if (isListingError) {
      return onResumeAfterListingError();
    }
  };

  // this scrollable area maxHeight accounts for the nav height and the
  // height within the sticky padding that is not scrollable
  const innerScrollAreaMaxHeight = {
    base: `calc(100vh - ${navHeightResponsive.base} - 14rem - 1px)`,
    md: `calc(100vh - ${navHeightResponsive.md} - 21rem - 1px)`,
  };

  return (
    <>
      <VStack spacing={4} pb={6} width="100%" sx={{ "> *": { width: "100%" } }}>
        <Text color="text-02" textStyle="heading-04" bold>
          {t("Standard Listing")}
        </Text>
        {endTime && (
          <Flex justifyContent="space-between" mt={2}>
            <Text color="text-02" textStyle="detail">
              {t("Validity")}
            </Text>
            <Text color="text-02" textStyle="detail" textAlign="right">
              {formatTimestampAsDateString(endTime)}
            </Text>
          </Flex>
        )}
        <Text color="text-03" textStyle="helper">
          {t("Any listings you complete now will remain active even if you leave during this process")}
        </Text>
        <Divider />

        <VStack alignItems="flex-start" spacing={4} maxHeight={innerScrollAreaMaxHeight} overflowY="auto">
          <ApproveTransactionStep
            title={t("Approve Collections")}
            collectionCount={uniqueCollections.length}
            approvedCollections={approvedCollections}
            txPendingCollections={txPendingCollections}
            txNeedsConfirmationCollections={txNeedsConfirmationCollections}
            needsApprovalCollections={needsApprovalCollections}
            txDeclinedCollections={txDeclinedCollections}
            status={isListingPhase ? "past" : "current"}
            collapse={isListingPhase}
          />
          <ListTransactionStep
            title={t("Complete Listings")}
            selectedItemsCount={selectedItems.length}
            needsListingTokens={needsListingTokens}
            needsSigningTokens={needsSigningTokens}
            declinedTokens={declinedTokens}
            listedTokens={listedTokens}
            skippedTokens={skippedTokens}
            status={isListingPhase ? "current" : "future"}
            collapse={!isListingPhase}
          />
        </VStack>
      </VStack>
      <Button
        isLoading={!isAnyError}
        loadingText={t("Now Listing...")}
        size="sm"
        disabled={!isAnyError}
        isFullWidth
        onClick={handleButtonClick}
      >
        {t("Submit Transaction Again")}
      </Button>
      {!!declinedTokens.length && (
        <Button colorScheme="secondary" size="sm" isFullWidth onClick={onSkipToken} mt={2}>
          {t("Skip This One")}
        </Button>
      )}
    </>
  );
};
