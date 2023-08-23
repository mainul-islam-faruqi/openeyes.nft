import React, { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Box } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { utils, constants, BigNumber } from "ethers";
import { ModalBody, getStepStatus } from "uikit";
import { APP_CHAIN_ID } from "config/chains";
import { addresses } from "config/addresses";
import { getAllowance, approve } from "utils/calls/erc20";
import { postMakerOrder } from "utils/graphql/postMakerOrder";
import { ImageData } from "types/graphql";
import { NftMeta, TransactionStep, View } from "../shared";
import TransactionSummary from "../shared/TransactionSummary";

interface TransactionViewProps {
  collectionAddress: string;
  tokenId: string;
  price: string;
  endTime: number;
  creatorFee?: BigNumber;
  protocolFee?: BigNumber;
  onClose: () => void;
  onConfirm: () => void;
  tokenName: string;
  tokenImage: ImageData;
  collectionName: string;
  isVerified?: boolean;
}

const TransactionView: React.FC<Omit<TransactionViewProps, "onClose">> = ({
  collectionAddress,
  tokenId,
  price,
  endTime,
  creatorFee,
  protocolFee,
  onConfirm,
  tokenName,
  tokenImage,
  collectionName,
  isVerified,
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
    if (account && protocolFee && creatorFee) {
      await postMakerOrder(
        library,
        APP_CHAIN_ID,
        false,
        collectionAddress,
        addresses.STRATEGY_STANDARD_SALE,
        constants.One,
        priceInWei,
        protocolFee,
        creatorFee,
        addresses.WETH,
        {
          tokenId,
          endTime,
        }
      );
      onConfirm();
    }
  }, [account, endTime, library, collectionAddress, tokenId, onConfirm, priceInWei, protocolFee, creatorFee]);

  return (
    <>
      <Box p={4} bg="ui-bg">
        <NftMeta
          tokenName={tokenName}
          tokenImage={tokenImage}
          collectionName={collectionName}
          isVerified={isVerified}
        />
        <TransactionSummary endTime={endTime} wethBalanceUsed={priceInWei} priceText={t("Offering with")} />
      </Box>
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
          title={t("Confirm Offer")}
          message={t("Confirm the transaction in your wallet.")}
          status={getStepStatus(View.TRADE, listingStep)}
          collapse={listingStep !== View.TRADE}
        />
      </ModalBody>
    </>
  );
};

export default TransactionView;
