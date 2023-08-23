// @ts-nocheck
import React, { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Box } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { BigNumber, constants, utils } from "ethers";
import { MakerOrderWithSignatureAndHash } from "types/orders";
import { ModalFooterGrid, ModalBody, Button } from "uikit";
import { APP_CHAIN_ID } from "config/chains";
import {  addresses } from "config/addresses";
import { tokenStandardConfig } from "config/tokenStandard";
import { TokenStandard } from "types/config";
import { ImageData } from "types/graphql";
import { toDecimals } from "utils/format";
import { updateMakerOrder } from "utils/graphql/postMakerOrder";
import { timestampInMs } from "utils/date";
import { isApprovedForAll, setApprovalForAll } from "utils/calls/nft";
import { NftMeta, TransactionStep, View, TransactionSummary } from "../shared";

interface TransactionViewProps {
  // Original order
  order: MakerOrderWithSignatureAndHash;

  // New Price
  newPrice: string;

  // Other info needed for updating order
  collectionType: TokenStandard;
  protocolFees: BigNumber;
  creatorFees: BigNumber;

  // For displaying token
  tokenName: string;
  tokenImage: ImageData;
  collectionName: string;
  isVerified?: boolean;

  // Callbacks
  onClose: () => void;
  onBack: () => void;
  onConfirm: () => void;
}

const TransactionView: React.FC<TransactionViewProps> = ({
  order,
  newPrice,
  collectionType,
  protocolFees,
  creatorFees,
  tokenName,
  tokenImage,
  collectionName,
  isVerified,
  onClose,
  onBack,
  onConfirm,
}) => {
  const { library, account } = useWeb3React();
  const { t } = useTranslation();
  const [isPostingOrder, setIsPostingOrder] = useState(false);
  const [listingStep, setListingStep] = useState(View.APPROVAL);
  const [transaction, setTransaction] = useState<string>();
  const priceInWei = utils.parseEther(newPrice);
  const { collection: collectionAddress, endTime } = order;

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
      await updateMakerOrder(
        library,
        APP_CHAIN_ID,
        true,
        order.collection,
        order.strategy,
        constants.One, // Amount should always be 1
        toDecimals(newPrice),
        BigNumber.from(order.nonce),
        protocolFees,
        creatorFees,
        addresses.WETH,
        {
          tokenId: order.tokenId.toString(),
          endTime: timestampInMs(order.endTime),
        }
      );
      onConfirm();
    }
  }, [account, library, order, newPrice, protocolFees, creatorFees, onConfirm]);

  const handleIsNotPostingOrder = () => setIsPostingOrder(false);

  return (
    <>
      <Box p={4} bg="ui-bg">
        <NftMeta
          tokenName={tokenName}
          tokenImage={tokenImage}
          collectionName={collectionName}
          isVerified={isVerified}
        />
        <TransactionSummary endTime={timestampInMs(endTime)} ethBalanceUsed={priceInWei} priceText={t("Listing for")} />
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
          {t("Edit Price")}
        </Button>
        <Button tabIndex={2} variant="tall" colorScheme="gray" onClick={onClose} disabled={isPostingOrder}>
          {t("Cancel")}
        </Button>
      </ModalFooterGrid>
    </>
  );
};

export default TransactionView;
