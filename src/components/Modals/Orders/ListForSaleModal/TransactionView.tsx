// @ts-nocheck
import React, { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Box } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { BigNumber, utils } from "ethers";
import { ModalFooterGrid, ModalBody, Button, getStepStatus } from "uikit";
import { tokenStandardConfig } from "config/tokenStandard";
import { APP_CHAIN_ID } from "config/chains";
import { addresses } from "config/addresses";
import { TokenStandard } from "types/config";
import { CollectionFloor, ImageData } from "types/graphql";
import { postMakerOrder } from "utils/graphql/postMakerOrder";
import { isApprovedForAll, setApprovalForAll } from "utils/calls/nft";
import { NftMeta, TransactionStep, View, TransactionSummary } from "../shared";

interface TransactionViewProps {
  tokenId: string;
  collectionAddress: string;
  collectionType: TokenStandard;
  onClose: () => void;
  onBack: () => void;
  onConfirm: () => void;
  price: string;
  endTime: number;
  protocolFees: BigNumber;
  creatorFees: BigNumber;
  strategyAddress: string;
  tokenName: string;
  tokenImage: ImageData;
  collectionName: string;
  isVerified?: boolean;
  points?: number | null;
  collectionFloor?: CollectionFloor;
  privateBuyer?: string;
}

const TransactionView: React.FC<TransactionViewProps> = ({
  tokenId,
  collectionAddress,
  collectionType,
  price,
  endTime,
  protocolFees,
  creatorFees,
  strategyAddress,
  tokenName,
  tokenImage,
  collectionName,
  isVerified,
  points,
  collectionFloor,
  privateBuyer,
  onClose,
  onBack,
  onConfirm,
}) => {
  const { library, account } = useWeb3React();
  const { t } = useTranslation();
  const [isPostingOrder, setIsPostingOrder] = useState(false);
  const [listingStep, setListingStep] = useState(View.APPROVAL);
  const [transaction, setTransaction] = useState<string>();
  const priceInWei = utils.parseEther(price);

  const handleApprove = useCallback(async () => {
    if (account) {
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
    }
  }, [account, library, collectionAddress, collectionType]);

  const handlePost = useCallback(async () => {
    if (account) {
      setIsPostingOrder(true);
      await postMakerOrder(
        library,
        APP_CHAIN_ID,
        true,
        collectionAddress,
        strategyAddress,
        BigNumber.from(1),
        priceInWei,
        protocolFees,
        creatorFees,
        addresses.WETH,
        {
          tokenId,
          params: privateBuyer ? { types: ["address"], values: [privateBuyer] } : undefined,
          endTime,
        }
      );
      onConfirm();
    }
  }, [
    account,
    creatorFees,
    library,
    collectionAddress,
    tokenId,
    onConfirm,
    priceInWei,
    endTime,
    privateBuyer,
    protocolFees,
    strategyAddress,
    setIsPostingOrder,
  ]);

  const handleIsNotPostingOrder = () => setIsPostingOrder(false);

  return (
    <>
      <Box p={4} bg="ui-bg">
        <NftMeta
          tokenName={tokenName}
          tokenImage={tokenImage}
          collectionName={collectionName}
          isVerified={isVerified}
          points={points}
          collectionFloor={collectionFloor}
        />
        <TransactionSummary endTime={endTime} ethBalanceUsed={priceInWei} priceText={t("Listing for")} />
      </Box>
      <ModalBody>
        <TransactionStep
          onSendRequest={handleApprove}
          title={t("Approve Collection")}
          message={t("Confirm the transaction in your wallet. This lets you sell any item in this collection.")}
          status={getStepStatus(View.APPROVAL, listingStep)}
          collapse={listingStep !== View.APPROVAL}
          transaction={transaction}
          mb={6}
        />
        <TransactionStep
          onSendRequest={handlePost}
          onSuccess={handleIsNotPostingOrder}
          onError={handleIsNotPostingOrder}
          title={t("Complete Listing")}
          message={t("Sign the message in your wallet to complete the listing.")}
          status={getStepStatus(View.TRADE, listingStep)}
          collapse={listingStep !== View.TRADE}
        />
      </ModalBody>
      <ModalFooterGrid>
        <Button tabIndex={1} variant="tall" colorScheme="gray" onClick={onBack} disabled={isPostingOrder}>
          {t("Edit Listing")}
        </Button>
        <Button tabIndex={2} variant="tall" colorScheme="gray" onClick={onClose} disabled={isPostingOrder}>
          {t("Cancel")}
        </Button>
      </ModalFooterGrid>
    </>
  );
};

export default TransactionView;
