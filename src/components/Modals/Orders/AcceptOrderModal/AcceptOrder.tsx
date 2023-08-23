// @ts-nocheck
import { useState, useCallback, useEffect } from "react";
import { Divider, Grid, Skeleton, Flex, Box } from "@chakra-ui/react";
import { BigNumber } from "@ethersproject/bignumber";
import { Trans } from "next-i18next";
import { BigNumberish, constants, utils } from "ethers";
import { useWeb3React } from "@web3-react/core";
import { Button, Text, ModalBody, ModalFooterGrid, SectionLoader, WethIcon, ExternalLink } from "uikit";
import { ModalProps } from "uikit/Modal/Modal";
import { useTranslation } from "react-i18next";
import { addresses, STRATEGIES_ADDRESS } from "config/addresses";
import { TokenStandard } from "types/config";
import { MakerOrderWithSignatureAndHash } from "types/orders";
import { ImageData } from "types/graphql";
import {
  formatToSignificant,
  formatPriceAfterFees,
  formatUsd,
  fromDecimals,
  toDecimals,
  formatAddress,
} from "utils/format";
import { isFeeAboveWarningThreshold } from "utils/isFeeAboveWarningThreshold";
import { getExplorerLink } from "utils/chains";
import { getFloorPricePercentDifference } from "utils/floorPricePercentHelpers";
import { invalidateBids } from "utils/graphql/invalidateBids";
import { isAddressEqual } from "utils/guards";
import { useWethBalance } from "hooks/useTokenBalance";
import { useProtocolFee } from "hooks/useFees";
import { useCalculateCreatorFeePercentage } from "hooks/calls/fees";
import useSendAlgoliaEvent, { AlgoliaEventNames } from "hooks/useSendAlgoliaEvent";
import { useGetAllowance } from "hooks/calls/useErc20";
import { useCheckOwner } from "hooks/calls/useCheckOwner";
import { useCoinPrices } from "hooks/useCoinPrices";
import { CreatorFeePopover } from "components/Fees/CreatorFeePopover";
import { ProtocolFeePopover } from "components/Fees/ProtocolFeePopover";
import NftMeta from "../shared/NftMeta";
import TransactionView from "./TransactionView";
import FloorPriceWarningView from "./FloorPriceWarningView";
import ConfirmationView from "./ConfirmationView";
import InvalidOrderView from "./InvalidOrderView";

export enum View {
  MAIN,
  TRANSACTION,
  FLOOR_PRICE_WARNING,
  CONFIRMATION,
}

export interface BaseAcceptOrderProps {
  tokenId: string;
  tokenName: string;
  tokenImage: ImageData;
  collectionName: string;
  collectionAddress: string;
  collectionType: TokenStandard;
  collectionFloorPrice?: BigNumberish;
  isVerified?: boolean;
  order: MakerOrderWithSignatureAndHash;
  onClose: ModalProps["onClose"];
}

interface AcceptOrderProps extends BaseAcceptOrderProps {
  setModalTitle: (newView: View) => void;
}

export const AcceptOrder = ({
  tokenId,
  tokenName,
  tokenImage,
  collectionName,
  collectionAddress,
  collectionType,
  collectionFloorPrice = constants.Zero,
  isVerified,
  order,
  onClose,
  setModalTitle,
}: AcceptOrderProps) => {
  const { account } = useWeb3React();
  const { t } = useTranslation();
  const [transactionHash, setTransactionHash] = useState<string>("");
  const [viewIndex, setViewIndex] = useState(View.MAIN);

  const signerWethBalanceQuery = useWethBalance(order.signer, {
    cacheTime: 5000,
  });
  const signerWethApprovalQuery = useGetAllowance(addresses.WETH, order.signer, addresses.EXCHANGE);
  const ownerCheckQuery = useCheckOwner({
    addressToCheck: account!,
    tokenId,
    collectionAddress,
    collectionType,
  });
  const coinPriceQuery = useCoinPrices({ refetchInterval: 10000 });
  const protocolFeeQuery = useProtocolFee(order.strategy);
  const creatorFeeQuery = useCalculateCreatorFeePercentage(collectionAddress, tokenId);
  const sendAlgoliaEvent = useSendAlgoliaEvent({
    tokenId,
    collectionAddress,
    eventName: isAddressEqual(order.strategy, STRATEGIES_ADDRESS.collection)
      ? AlgoliaEventNames.COLLECTION_BID_EXECUTED
      : AlgoliaEventNames.STANDARD_BID_EXECUTED,
    insightsMethodName: "convertedObjectIDs",
  });

  const invalidateBidsCallback = useCallback(() => invalidateBids(order.signer), [order.signer]);
  const isFeeWarning = isFeeAboveWarningThreshold(creatorFeeQuery.data);

  const isLoadingData =
    ownerCheckQuery.isLoading ||
    signerWethApprovalQuery.isLoading ||
    signerWethBalanceQuery.isLoading ||
    coinPriceQuery.isLoading ||
    protocolFeeQuery.isLoading ||
    creatorFeeQuery.isLoading;

  const priceInWei = BigNumber.from(order.price);
  const creatorFee = creatorFeeQuery.isSuccess ? creatorFeeQuery.data : 0;
  const feeAsDecimal = creatorFee ? toDecimals(creatorFee.toFixed(2), 2) : constants.Zero;

  const ethPriceUsd = coinPriceQuery.isSuccess ? coinPriceQuery.data.eth : 0;
  const weiPriceAfterFees =
    protocolFeeQuery.isSuccess && priceInWei && formatPriceAfterFees(protocolFeeQuery.data, feeAsDecimal, priceInWei);
  const ethPriceAfterFees = weiPriceAfterFees ? fromDecimals(weiPriceAfterFees) : "0";

  // Floor price warning conditions
  const { floorDiffPercentString, floorDiffPercentBn, hasLowThresholdReached, hasHighThresholdReached } =
    getFloorPricePercentDifference(collectionFloorPrice, order && order.price);

  const onConfirmTransaction = useCallback(
    (transaction: string) => {
      setTransactionHash(transaction);
      setViewIndex(View.CONFIRMATION);
      sendAlgoliaEvent();
    },
    [sendAlgoliaEvent]
  );

  const handleClose = useCallback(() => {
    onClose();
    setViewIndex(View.MAIN);
  }, [onClose]);

  const handleClickAcceptOffer = useCallback(() => {
    if (viewIndex === View.FLOOR_PRICE_WARNING) {
      setViewIndex(View.TRANSACTION);
      return;
    }
    if (hasHighThresholdReached) {
      setViewIndex(View.FLOOR_PRICE_WARNING);
      return;
    }
    setViewIndex(View.TRANSACTION);
  }, [viewIndex, hasHighThresholdReached, setViewIndex]);

  // Update modal title each time the view changes
  useEffect(() => {
    setModalTitle(viewIndex);
  }, [viewIndex, setModalTitle]);

  if (isLoadingData) {
    return (
      <ModalBody>
        <SectionLoader justifyContent="flex-start" alignItems="flex-start">
          <Text bold textStyle="display-body" mb={4}>
            {t("Checking validity")}
          </Text>
          <Text textStyle="detail" color="text-02">
            {t("Wait a sec...")}
          </Text>
        </SectionLoader>
      </ModalBody>
    );
  }

  // Order price is greater than the signer's WETH balance
  if (viewIndex === View.MAIN && signerWethBalanceQuery.isSuccess && priceInWei.gt(signerWethBalanceQuery.data)) {
    return (
      <InvalidOrderView onClose={handleClose} invalidateOrdersCallback={invalidateBidsCallback}>
        <Text textStyle="display-body" bold mb={4}>
          {t("Invalid Offer/Bid")}
        </Text>
        <Text color="text-02" textStyle="detail">
          {t("Sorry, it looks like the person who made this offer/bid doesn’t have enough WETH balance to pay for it.")}
        </Text>
        <Text color="text-02" textStyle="detail">
          {t("We'll remove this offer in a moment so you don't see it again.")}
        </Text>
      </InvalidOrderView>
    );
  }

  // Order price is greater than the signer's WETH approval allowance
  if (signerWethApprovalQuery.isSuccess && priceInWei.gt(signerWethApprovalQuery.data)) {
    return (
      <InvalidOrderView onClose={handleClose} invalidateOrdersCallback={invalidateBidsCallback}>
        <Text textStyle="display-body" bold mb={4}>
          {t("Invalid Offer/Bid")}
        </Text>
        <Text color="text-02" textStyle="detail" mb={4}>
          {t("Sorry, it looks like the person who offered to buy this NFT has revoked WETH approval on OpenEyes.nft.")}
        </Text>
        <Text color="text-02" textStyle="detail">
          {t("We'll remove this offer in a moment so you don't see it again.")}
        </Text>
      </InvalidOrderView>
    );
  }

  if (ownerCheckQuery.isSuccess && !ownerCheckQuery.data.isOwner) {
    return (
      <InvalidOrderView onClose={handleClose}>
        <Text textStyle="display-body" bold mb={4}>
          {t("Unable to accept bid")}
        </Text>
        <Text color="text-02" textStyle="detail" mb={4}>
          {t("Sorry, it looks like you aren't the owner of this NFT. Make sure it's in your wallet and try again.")}
        </Text>
        {ownerCheckQuery.data.ownerAddress && (
          <ExternalLink
            mr={4}
            isTruncated
            textStyle="detail"
            href={getExplorerLink(ownerCheckQuery.data.ownerAddress, "address")}
          >
            {t("Current owner: {{address}}", { address: formatAddress(ownerCheckQuery.data.ownerAddress) })}
          </ExternalLink>
        )}
      </InvalidOrderView>
    );
  }

  if (viewIndex === View.FLOOR_PRICE_WARNING) {
    return (
      <FloorPriceWarningView
        floorDiffPercentString={floorDiffPercentString}
        priceInEth={utils.formatEther(order.price)}
        collectionFloorPriceInEth={utils.formatEther(collectionFloorPrice)}
        onBack={() => {
          setViewIndex(View.MAIN);
        }}
        onAccept={handleClickAcceptOffer}
      />
    );
  }
  if (viewIndex === View.TRANSACTION) {
    return (
      <TransactionView
        tokenId={tokenId}
        collectionType={collectionType}
        collectionAddress={collectionAddress}
        makerOrder={order}
        onConfirm={onConfirmTransaction}
        onClose={handleClose}
        onBack={() => setViewIndex(View.MAIN)}
      />
    );
  }
  if (viewIndex === View.CONFIRMATION) {
    return (
      <ConfirmationView
        tokenId={tokenId}
        tokenName={tokenName}
        tokenImage={tokenImage}
        collectionName={collectionName}
        collectionAddress={collectionAddress}
        isVerified={isVerified}
        transaction={transactionHash}
        onClose={handleClose}
      />
    );
  }

  return (
    <>
      <Box p={4} bg="ui-bg">
        <NftMeta
          tokenName={tokenName}
          tokenImage={tokenImage}
          collectionName={collectionName}
          isVerified={isVerified}
        />
      </Box>
      <ModalBody>
        <Grid templateColumns="repeat(2, 1fr)" templateRows="repeat(2, 1fr)" gridGap={2}>
          <Box gridRow="1 / span 2">
            <Text textStyle="detail" color="text-02">
              {t("Offer")}
            </Text>
            {floorDiffPercentString && floorDiffPercentBn && (
              <Trans i18nKey="transListSaleFloorPriceAboveBelowWarning">
                <Text textStyle="helper" color={hasLowThresholdReached ? "text-error" : "text-02"}>
                  {floorDiffPercentBn.gt(0)
                    ? `${floorDiffPercentString}% higher than floor price`
                    : floorDiffPercentBn.lt(0)
                    ? `${floorDiffPercentString.replace("-", "")}% lower than floor price`
                    : ""}
                </Text>
              </Trans>
            )}
          </Box>
          <Flex alignItems="center" justifyContent="flex-end" gridColumn="2" gridRow="1">
            <WethIcon boxSize={4} mr={1} />
            <Text bold>{formatToSignificant(order.price, 6)} WETH</Text>
          </Flex>
          <Flex gridColumn="2" gridRow="2" justifyContent="flex-end">
            {coinPriceQuery.isLoading ? (
              <Skeleton height="18px" width="72px" />
            ) : (
              <Text textAlign="right" textStyle="helper" color="text-02">
                {formatUsd(parseFloat(fromDecimals(priceInWei)) * ethPriceUsd)}
              </Text>
            )}
          </Flex>
        </Grid>
        <Divider my={4} />
        <Grid templateColumns="auto 1fr" templateRows="repeat(2, 1fr)" gridGap={2}>
          <Text gridRow="1 / span 2" color="text-02">
            {t("Fees")}
          </Text>
          <Text textAlign="right" color={isFeeWarning ? "text-warning" : "text-02"}>
            {t("Creator Royalties")}:
            <CreatorFeePopover display="inline-flex" fee={creatorFee} isWarning={isFeeWarning} />
          </Text>
          <Text textAlign="right" color="text-02">
            OpenEyes.nft: <ProtocolFeePopover color="text-02" display="inline-flex" fee={protocolFeeQuery.data} />
          </Text>
        </Grid>
        <Divider my={4} />
        <Grid templateColumns="repeat(2, 1fr)" templateRows="repeat(2, 1fr)" gridGap={2}>
          <Text bold textStyle="display-body" gridRow="1 / span 2">
            {t("You Receive")}
          </Text>
          <Flex alignItems="center" justifyContent="flex-end" gridColumn="2" gridRow="1">
            <WethIcon boxSize={5} mr={1} />
            {weiPriceAfterFees ? (
              <Text textStyle="display-body" bold whiteSpace="nowrap">
                {formatToSignificant(weiPriceAfterFees, 6)} WETH
              </Text>
            ) : (
              <Skeleton height="24px" width="110px" />
            )}
          </Flex>
          <Flex gridColumn="2" gridRow="2" justifyContent="flex-end">
            {coinPriceQuery.isLoading ? (
              <Skeleton height="18px" width="72px" />
            ) : (
              <Text textAlign="right" textStyle="helper" color="text-02">
                {formatUsd(parseFloat(ethPriceAfterFees) * ethPriceUsd)}
              </Text>
            )}
          </Flex>
        </Grid>
      </ModalBody>
      <ModalFooterGrid>
        <Button variant="tall" colorScheme="gray" isFullWidth onClick={handleClose}>
          {t("Cancel")}
        </Button>
        <Button tabIndex={0} variant="tall" isFullWidth onClick={handleClickAcceptOffer}>
          {t("Accept Offer")}
        </Button>
      </ModalFooterGrid>
    </>
  );
};
