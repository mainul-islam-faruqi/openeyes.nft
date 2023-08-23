import React, { useState, useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import { useTranslation } from "react-i18next";
import { ModalFooterGrid, ModalBody, Button, getStepStatus } from "uikit";
import { matchBidWithTakerAsk } from "utils/calls/exchange";
import { isApprovedForAll, setApprovalForAll } from "utils/calls/nft";
import { tokenStandardConfig, minNetPriceRatio } from "config";
import { MakerOrderWithSignatureAndHash, MakerOrderWithSignature, TakerOrder } from "types/orders";
import { TokenStandard } from "types/config";
import { TransactionStep, View } from "../shared";

interface TransactionViewProps {
  tokenId: string;
  collectionType: TokenStandard;
  collectionAddress: string;
  makerOrder: MakerOrderWithSignatureAndHash;
  onConfirm: (transaction: string) => void;
  onClose: () => void;
  onBack: () => void;
}

const TransactionView: React.FC<TransactionViewProps> = ({
  tokenId,
  collectionType,
  collectionAddress,
  makerOrder,
  onConfirm,
  onClose,
  onBack,
}) => {
  const { t } = useTranslation();
  const { library, account } = useWeb3React();
  const [listingStep, setListingStep] = useState(View.APPROVAL);
  const [transaction, setTransaction] = useState<string>();
  const [isSubmittingTx, setIsSubmittingTx] = useState(false);

  const handleApprove = useCallback(async () => {
    if (account) {
      try {
        setIsSubmittingTx(true);
        const config = tokenStandardConfig[collectionType];
        const isCollectionApproved = await isApprovedForAll(
          library,
          config.abi,
          collectionAddress,
          account,
          config.transferManagerAddress
        );

        if (isCollectionApproved) {
          setListingStep(View.TRADE);
        } else {
          const response = await setApprovalForAll(
            library,
            config.abi,
            collectionAddress,
            account,
            config.transferManagerAddress
          );
          setTransaction(response.hash);
          const receipt = await response.wait();

          if (receipt.status) {
            setTransaction(undefined);
            setListingStep(View.TRADE);
          } else {
            throw new Error(`${receipt.transactionHash} failed`);
          }
        }
      } finally {
        setIsSubmittingTx(false);
      }
    }
  }, [account, library, collectionAddress, collectionType, setIsSubmittingTx]);

  const handlePost = useCallback(async () => {
    if (account) {
      try {
        setIsSubmittingTx(true);
        const takerOrder: TakerOrder = {
          isOrderAsk: true,
          taker: account,
          price: makerOrder.price,
          tokenId: tokenId,
          minPercentageToAsk: minNetPriceRatio,
          params: [],
        };
        if (makerOrder.signature) {
          const makerOrderWithoutHash: MakerOrderWithSignature = {
            signer: makerOrder.signer,
            collection: makerOrder.collection,
            price: makerOrder.price,
            tokenId: makerOrder.tokenId,
            amount: makerOrder.amount,
            strategy: makerOrder.strategy,
            isOrderAsk: makerOrder.isOrderAsk,
            currency: makerOrder.currency,
            nonce: makerOrder.nonce,
            startTime: makerOrder.startTime,
            endTime: makerOrder.endTime,
            minPercentageToAsk: makerOrder.minPercentageToAsk,
            params: makerOrder.params,
            signature: makerOrder.signature,
          };
          const response = await matchBidWithTakerAsk(library, account, takerOrder, makerOrderWithoutHash);
          setTransaction(response.hash);
          const receipt = await response.wait();

          if (receipt.status) {
            onConfirm(receipt.transactionHash);
          } else {
            throw new Error(`${receipt.transactionHash} failed`);
          }
        } else {
          throw new Error("makerOrder does not have signature");
        }
      } finally {
        setIsSubmittingTx(false);
      }
    }
  }, [
    account,
    library,
    makerOrder.amount,
    makerOrder.collection,
    makerOrder.currency,
    makerOrder.endTime,
    makerOrder.isOrderAsk,
    makerOrder.minPercentageToAsk,
    makerOrder.nonce,
    makerOrder.params,
    makerOrder.price,
    makerOrder.signature,
    makerOrder.signer,
    makerOrder.startTime,
    makerOrder.strategy,
    makerOrder.tokenId,
    tokenId,
    onConfirm,
    setIsSubmittingTx,
  ]);

  return (
    <>
      <ModalBody>
        <TransactionStep
          onSendRequest={handleApprove}
          title={t("Approve collections")}
          message={t("Confirm the transaction in your wallet. This lets you sell any item in this collection.")}
          status={getStepStatus(View.APPROVAL, listingStep)}
          collapse={listingStep !== View.APPROVAL}
          transaction={transaction}
          mb={6}
        />
        <TransactionStep
          onSendRequest={handlePost}
          title={t("Confirm Sale")}
          message={t("Confirm the transaction in your wallet to complete the sale.")}
          status={getStepStatus(View.TRADE, listingStep)}
          collapse={listingStep !== View.TRADE}
          transaction={transaction}
        />
      </ModalBody>
      <ModalFooterGrid>
        <Button tabIndex={1} variant="tall" colorScheme="gray" onClick={onBack} isDisabled={isSubmittingTx}>
          {t("Review offer")}
        </Button>
        <Button tabIndex={2} variant="tall" colorScheme="gray" onClick={onClose} isDisabled={isSubmittingTx}>
          {t("Cancel")}
        </Button>
      </ModalFooterGrid>
    </>
  );
};

export default TransactionView;
