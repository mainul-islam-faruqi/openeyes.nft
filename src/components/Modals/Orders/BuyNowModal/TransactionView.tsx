// @ts-nocheck
import React, { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useWeb3React } from "@web3-react/core";
import { BigNumber } from "ethers";
import { ModalBody, getStepStatus } from "uikit";
import { addresses } from "config/addresses";
import { minNetPriceRatio } from "config/constants"
import { ImageData } from "types/graphql";
import { getAllowance, approve } from "utils/calls/erc20";
import { matchAskWithTakerBidUsingETHAndWETH, matchAskWithTakerBid } from "utils/calls/exchange";
import { TakerOrder, MakerOrderWithSignatureAndHash, MakerOrderWithSignature } from "types/orders";
import { NftMeta, TransactionStep, View } from "../shared";
import TransactionSummary from "../shared/TransactionSummary";

interface TransactionViewProps {
  ask: MakerOrderWithSignatureAndHash;
  tokenId: string;
  wethBalanceUsed: BigNumber;
  isUsingWeth: boolean;
  ethBalanceUsed: BigNumber;
  onConfirm: (transaction: string) => void;
  tokenName: string;
  tokenImage: ImageData;
  collectionName: string;
  isVerified?: boolean;
}

const TransactionView: React.FC<TransactionViewProps> = ({
  ask,
  tokenId,
  wethBalanceUsed,
  isUsingWeth,
  ethBalanceUsed,
  onConfirm,
  tokenName,
  tokenImage,
  collectionName,
  isVerified,
}) => {
  const { library, account } = useWeb3React();
  const { t } = useTranslation();
  const [listingStep, setListingStep] = useState(isUsingWeth ? View.APPROVAL : View.TRADE);
  const [transaction, setTransaction] = useState<string>();

  const handleApprove = useCallback(async () => {
    if (account) {
      const askWithHash = ask as MakerOrderWithSignatureAndHash;

      const allowance = await getAllowance(library, addresses.WETH, account, addresses.EXCHANGE);

      if (allowance.gt(askWithHash.price)) {
        setListingStep(View.TRADE);
      } else {
        const response = await approve(library, addresses.WETH, account, addresses.EXCHANGE);
        setTransaction(response.hash);
        const receipt = await response.wait();
        if (receipt.status) {
          setTransaction(undefined);
          setListingStep(View.TRADE);
        } else {
          throw new Error(`${receipt.transactionHash} failed`);
        }
      }
    }
  }, [account, library, ask]);

  const handlePost = useCallback(async () => {
    if (account) {
      const askWithHash = ask as MakerOrderWithSignatureAndHash;
      if (askWithHash.signature) {
        const askWithoutHash: MakerOrderWithSignature = {
          signer: askWithHash.signer,
          collection: askWithHash.collection,
          price: askWithHash.price,
          tokenId: askWithHash.tokenId,
          amount: askWithHash.amount,
          strategy: askWithHash.strategy,
          isOrderAsk: askWithHash.isOrderAsk,
          currency: askWithHash.currency,
          nonce: askWithHash.nonce,
          startTime: askWithHash.startTime,
          endTime: askWithHash.endTime,
          minPercentageToAsk: askWithHash.minPercentageToAsk,
          params: askWithHash.params,
          signature: askWithHash.signature,
        };

        const order: TakerOrder = {
          isOrderAsk: false,
          taker: account,
          price: askWithoutHash.price,
          tokenId: tokenId,
          minPercentageToAsk: minNetPriceRatio,
          params: [],
        };

        const response = ethBalanceUsed.isZero()
          ? await matchAskWithTakerBid(library, account, order, askWithoutHash)
          : await matchAskWithTakerBidUsingETHAndWETH(library, account, order, askWithoutHash, ethBalanceUsed);
        setTransaction(response.hash);
        const receipt = await response.wait();
        if (receipt.status) {
          onConfirm(receipt.transactionHash);
        } else {
          throw new Error(`${receipt.transactionHash} failed`);
        }
      } else {
        throw new Error("askWithHash does not have signature");
      }
    }
  }, [account, ethBalanceUsed, library, ask, tokenId, onConfirm]);

  return (
    <>
      <ModalBody bg="ui-bg">
        <NftMeta
          tokenName={tokenName}
          tokenImage={tokenImage}
          collectionName={collectionName}
          isVerified={isVerified}
        />

        <TransactionSummary
          priceText={t("You pay")}
          wethBalanceUsed={wethBalanceUsed}
          ethBalanceUsed={ethBalanceUsed}
        />
      </ModalBody>
      <ModalBody>
        {isUsingWeth && (
          <TransactionStep
            onSendRequest={handleApprove}
            title={t("Enable WETH spending")}
            message={t("Confirm the transaction in your wallet. This lets you spend WETH to buy NFTs.")}
            status={getStepStatus(View.APPROVAL, listingStep)}
            collapse={listingStep !== View.APPROVAL}
            transaction={transaction}
            mb={6}
          />
        )}
        <TransactionStep
          onSendRequest={handlePost}
          title={t("Confirm Purchase")}
          message={t("Confirm the transaction in your wallet.")}
          status={getStepStatus(View.TRADE, listingStep)}
          collapse={listingStep !== View.TRADE}
          transaction={transaction}
        />
      </ModalBody>
    </>
  );
};

export default TransactionView;
