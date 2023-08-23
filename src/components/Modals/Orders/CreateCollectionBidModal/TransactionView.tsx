import React, { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useWeb3React } from "@web3-react/core";
import { utils, BigNumber, constants } from "ethers";
import { ModalBody, getStepStatus } from "uikit";
import { APP_CHAIN_ID } from "config/chains";
import { addresses } from "config/addresses";
import { getAllowance, approve } from "utils/calls/erc20";
import { postMakerOrder } from "utils/graphql/postMakerOrder";
import { CollectionMeta, TransactionStep, View } from "../shared";
import TransactionSummary from "../shared/TransactionSummary";

interface TransactionViewProps {
  collectionAddress: string;
  collectionName: string;
  isVerified?: boolean;
  price: string;
  endTime: number;
  onConfirm: () => void;
}

const TransactionView: React.FC<TransactionViewProps> = ({
  collectionAddress,
  collectionName,
  isVerified,
  price,
  endTime,
  onConfirm,
}) => {
  const { library, account } = useWeb3React();
  const { t } = useTranslation();
  const [listingStep, setListingStep] = useState(View.APPROVAL);
  const [transaction, setTransaction] = useState<string>();
  const priceInWei = utils.parseEther(price);

  const handleApprove = useCallback(async () => {
    if (account) {
      const allowance = await getAllowance(library, addresses.WETH, account, addresses.EXCHANGE);

      if (allowance.gt(priceInWei)) {
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
  }, [account, library, priceInWei]);

  const handlePost = useCallback(async () => {
    if (account) {
      await postMakerOrder(
        library,
        APP_CHAIN_ID,
        false,
        collectionAddress,
        addresses.STRATEGY_COLLECTION_SALE,
        BigNumber.from(1),
        priceInWei,
        constants.Zero,
        constants.Zero,
        addresses.WETH,
        { endTime }
      );
      onConfirm();
    }
  }, [account, collectionAddress, endTime, library, onConfirm, priceInWei]);

  return (
    <>
      <ModalBody bg="ui-bg">
        <CollectionMeta collectionAddress={collectionAddress} collectionName={collectionName} isVerified={isVerified} />
        <TransactionSummary endTime={endTime} wethBalanceUsed={priceInWei} priceText={t("Offering with")} />
      </ModalBody>
      <ModalBody>
        <TransactionStep
          onSendRequest={handleApprove}
          title={t("Enable WETH spending")}
          message={t("Confirm the transaction in your wallet. This lets you spend WETH to buy NFTs.")}
          status={getStepStatus(View.APPROVAL, listingStep)}
          collapse={listingStep !== View.APPROVAL}
          transaction={transaction}
          mb={6}
        />
        <TransactionStep
          onSendRequest={handlePost}
          title={t("Confirm Collection Offer")}
          message={t("Confirm the transaction in your wallet.")}
          status={getStepStatus(View.TRADE, listingStep)}
          collapse={listingStep !== View.TRADE}
        />
      </ModalBody>
    </>
  );
};

export default TransactionView;
