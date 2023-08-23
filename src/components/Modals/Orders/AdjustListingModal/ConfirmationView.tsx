import React from "react";
import { utils } from "ethers";
import Link from "next/link";
import { useTranslation, Trans } from "react-i18next";
import { ModalFooterGrid, ModalBody, Button, Text, CheckmarkOutlineIcon } from "uikit";
import { ImageData } from "types/graphql";
import { AddWethToWalletButton } from "components/Buttons/AddTokenToWalletButton";

import NftMeta from "../shared/NftMeta";
import TransactionSummary from "../shared/TransactionSummary";

interface Props {
  tokenId: string;
  tokenName: string;
  tokenImage: ImageData;
  collectionAddress: string;
  collectionName: string;
  isVerified?: boolean;
  price: string;
  endTime: number;
  onClose: () => void;
}

const ConfirmationView: React.FC<Props> = ({
  tokenId,
  tokenName,
  tokenImage,
  collectionName,
  collectionAddress,
  isVerified,
  price,
  endTime,
  onClose,
}) => {
  const { t } = useTranslation();
  return (
    <>
      <ModalBody bg="ui-bg">
        <NftMeta
          tokenName={tokenName}
          tokenImage={tokenImage}
          collectionName={collectionName}
          isVerified={isVerified}
        />
        <TransactionSummary endTime={endTime} ethBalanceUsed={utils.parseEther(price)} priceText={t("Listed for")} />
      </ModalBody>
      <ModalBody pb={12}>
        <CheckmarkOutlineIcon color="interactive-01" boxSize={14} mb={4} />
        <Text textStyle="heading-04" bold mb={4}>
          {t("Listing Updated")}
        </Text>
        <Trans i18nKey="translateListForSaleModalConfirmWeth">
          <Text color="text-02" textStyle="detail">
            You’ll receive your payment in{" "}
            <Text bold as="span" color="text-error">
              WETH
            </Text>
            , not ETH if someone buys your item.
          </Text>
        </Trans>
        <AddWethToWalletButton my={6} />
      </ModalBody>
      <ModalFooterGrid>
        <Button tabIndex={1} variant="tall" colorScheme="gray" onClick={onClose}>
          {t("Close")}
        </Button>
        <Link href={`/collections/${collectionAddress}/${tokenId}`} passHref>
          <Button tabIndex={2} variant="tall" onClick={onClose}>
            {t("View Item")}
          </Button>
        </Link>
      </ModalFooterGrid>
    </>
  );
};

export default ConfirmationView;
