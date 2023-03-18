// @ts-nocheck
import { useEffect, useState, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useWeb3React } from "@web3-react/core";
import { BigNumber } from "ethers";
import { Box } from "@chakra-ui/react";
import { SectionLoader, Text } from "uikit";
import { tokenStandardConfig } from "config/tokenStandard";
import { invalidateAsks } from "utils/graphql/invalidateAsks";
import { useEthBalance } from "hooks/useEthBalance";
import { useWethBalance } from "hooks/useTokenBalance";
import { useIsApprovedForAll } from "hooks/calls/nft";
import useSendAlgoliaEvent, { AlgoliaEventNames } from "hooks/useSendAlgoliaEvent";
import { MakerOrderWithSignatureAndHash } from "types/orders";
import { TokenStandard } from "types/config";
import { ImageData } from "types/graphql";
import { UnverifiedWarningView, shouldSkipUnverifiedWarning } from "../shared";
import InvalidOrderView from "../AcceptOrderModal/InvalidOrderView";
import MainView from "./MainView";
import TransactionView from "./TransactionView";
import ConfirmationView from "./ConfirmationView";

enum View {
  UNVERIFIED_WARNING,
  MAIN,
  TRANSACTION,
  CONFIRMATION,
}

export interface BuyNowProps {
  tokenId: string;
  tokenName: string;
  tokenImage: ImageData;
  collectionName: string;
  collectionAddress: string;
  collectionType: TokenStandard;
  isVerified?: boolean;
  ask: MakerOrderWithSignatureAndHash;
  onClose: () => void;
}

export const BuyNow = ({
  tokenId,
  tokenName,
  tokenImage,
  collectionName,
  collectionAddress,
  collectionType,
  isVerified,
  ask,
  onClose,
}: BuyNowProps) => {
  const { t } = useTranslation();

  const skipWarning = shouldSkipUnverifiedWarning(collectionAddress);
  const showWarning = !isVerified && !skipWarning;

  const [viewIndex, setViewIndex] = useState(showWarning ? View.UNVERIFIED_WARNING : View.MAIN);
  const [isUsingEth, setIsUsingEth] = useState<boolean>();
  const [isUsingWeth, setIsUsingWeth] = useState<boolean>();
  const [transactionHash, setTransactionHash] = useState<string>("");

  const { account } = useWeb3React();
  const sendAlgoliaEvent = useSendAlgoliaEvent({
    tokenId,
    collectionAddress,
    eventName: AlgoliaEventNames.ASK_EXECUTED,
    insightsMethodName: "convertedObjectIDs",
  });

  const config = tokenStandardConfig[collectionType];
  const signerApprovalQuery = useIsApprovedForAll(
    config.abi,
    collectionAddress,
    ask.signer,
    config.transferManagerAddress
  );
  const invalidateAsksCallback = useCallback(
    () => invalidateAsks(collectionAddress, ask.signer),
    [collectionAddress, ask.signer]
  );

  const ethBalanceQuery = useEthBalance(account!);
  const wethBalanceQuery = useWethBalance(account!);

  const ethBalance = ethBalanceQuery.isSuccess ? ethBalanceQuery.data : BigNumber.from(0);
  const wethBalance = wethBalanceQuery.isSuccess ? wethBalanceQuery.data : BigNumber.from(0);

  const isLoadingABalance = ethBalanceQuery.isLoading || wethBalanceQuery.isLoading;
  const hasLoadedDefaultPaymentOptions = isUsingWeth !== undefined && isUsingEth !== undefined;

  // As soon as a user's ETH and WETH balance has been loaded for the first time set the default payment options
  useEffect(() => {
    if (!isLoadingABalance && !hasLoadedDefaultPaymentOptions) {
      setIsUsingWeth(wethBalance.gt(0));
      setIsUsingEth(ethBalance.gt(0));
    }
  }, [hasLoadedDefaultPaymentOptions, isLoadingABalance, ethBalance, wethBalance, setIsUsingEth, setIsUsingWeth]);

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
    setViewIndex(showWarning ? View.UNVERIFIED_WARNING : View.MAIN);
  }, [onClose, showWarning]);

  const wethBalanceAsString = wethBalance.toString();
  const ethBalanceAsString = ethBalance.toString();

  const memoisedNftPriceInWei = useMemo(() => BigNumber.from(ask?.price || 0), [ask?.price]);
  const memoisedWethBalance = useMemo(() => BigNumber.from(wethBalanceAsString), [wethBalanceAsString]);
  const memoisedEthBalance = useMemo(() => BigNumber.from(ethBalanceAsString), [ethBalanceAsString]);

  const wethBalanceUsed = useMemo(() => {
    if (!isUsingWeth) {
      return BigNumber.from(0);
    }

    return memoisedWethBalance.gte(memoisedNftPriceInWei) ? memoisedNftPriceInWei : memoisedWethBalance;
  }, [isUsingWeth, memoisedNftPriceInWei, memoisedWethBalance]);

  const ethBalanceUsed = useMemo(() => {
    if (!isUsingEth) {
      return BigNumber.from(0);
    }

    if (isUsingWeth) {
      return memoisedNftPriceInWei.sub(wethBalanceUsed);
    }

    return memoisedEthBalance.gte(memoisedNftPriceInWei) ? memoisedNftPriceInWei : memoisedEthBalance;
  }, [memoisedEthBalance, isUsingEth, isUsingWeth, memoisedNftPriceInWei, wethBalanceUsed]);

  // Loading
  if (!hasLoadedDefaultPaymentOptions || signerApprovalQuery.isLoading) {
    return <SectionLoader height="524px" />;
  }

  // Signer has revoked collection approval
  if (signerApprovalQuery.isSuccess && !signerApprovalQuery.data) {
    return (
      <InvalidOrderView onClose={onClose} invalidateOrdersCallback={invalidateAsksCallback}>
        <Box>
          <Text textStyle="display-body" bold mb={4}>
            {t("Invalid Listing")}
          </Text>
          <Text color="text-02" textStyle="detail" mb={2}>
            {t(
              "Sorry, it looks like the person who listed this item for sale has revoked approval for this collection."
            )}
          </Text>
          <Text color="text-02" textStyle="detail">
            {t("You won't be able to buy it unless the seller approves the collection for sale on OpenEyes.nft again.")}
          </Text>
        </Box>
      </InvalidOrderView>
    );
  }

  if (viewIndex === View.UNVERIFIED_WARNING) {
    return (
      <UnverifiedWarningView
        collectionName={collectionName}
        collectionAddress={collectionAddress}
        onClose={onClose}
        onConfirm={() => setViewIndex(View.MAIN)}
      />
    );
  }
  if (viewIndex === View.TRANSACTION) {
    return (
      <TransactionView
        ask={ask}
        tokenId={tokenId}
        wethBalanceUsed={wethBalanceUsed}
        isUsingWeth={isUsingWeth}
        ethBalanceUsed={ethBalanceUsed}
        onConfirm={onConfirmTransaction}
        tokenName={tokenName}
        tokenImage={tokenImage}
        collectionName={collectionName}
        isVerified={isVerified}
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
    <MainView
      isUsingEth={isUsingEth}
      setIsUsingEth={setIsUsingEth}
      isUsingWeth={isUsingWeth}
      setIsUsingWeth={setIsUsingWeth}
      ethBalance={memoisedEthBalance}
      wethBalance={memoisedWethBalance}
      wethBalanceUsed={wethBalanceUsed}
      ethBalanceUsed={ethBalanceUsed}
      tokenName={tokenName}
      tokenImage={tokenImage}
      collectionName={collectionName}
      isVerified={isVerified}
      ask={ask}
      onConfirm={() => setViewIndex(View.TRANSACTION)}
      onClose={handleClose}
    />
  );
};
