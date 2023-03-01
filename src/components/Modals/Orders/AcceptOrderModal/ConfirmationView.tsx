import React from "react";
import Link from "next/link";
import { Flex, Divider, Box } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { Button, Text, ModalBody, ModalFooterGrid, ExternalLink, CheckmarkOutlineIcon } from "uikit";
import { ImageData } from "types/graphql";
import { formatAddress } from "utils/format";
import { getExplorerLink } from "utils/chains";
import { AddWethToWalletButton } from "components/Buttons/AddTokenToWalletButton";
import NftMeta from "../shared/NftMeta";

interface Props {
  tokenId: string;
  tokenName: string;
  tokenImage: ImageData;
  collectionName: string;
  collectionAddress: string;
  isVerified?: boolean;
  transaction: string;
  onClose: () => void;
}

const ConfirmationView: React.FC<Props> = ({
  tokenId,
  tokenName,
  tokenImage,
  collectionName,
  collectionAddress,
  isVerified,
  transaction,
  onClose,
}) => {
  const { t } = useTranslation();
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
        <Flex flexDirection="column">
          <CheckmarkOutlineIcon boxSize={14} mb={7} color="interactive-01" />
          <Text bold textStyle="display-body" mb={4}>
            {t("Sold!")}
          </Text>
          <Text textStyle="detail">{t("Your item is on its way to the buyer!")}</Text>
          <Text textStyle="detail" mb={4}>
            {t("Your wallet will receive the WETH from the sale soon.")}
          </Text>
          <AddWethToWalletButton />
        </Flex>
        <Divider my={6} />
        <Flex justifyContent="space-between" alignItems="center">
          <Text color="text-02" textStyle="detail">
            {t("Transaction")}
          </Text>
          <ExternalLink href={getExplorerLink(transaction, "transaction")}>
            {formatAddress(transaction, 7, 4)}
          </ExternalLink>
        </Flex>
      </ModalBody>

      <ModalFooterGrid>
        <Button tabIndex={1} variant="tall" colorScheme="gray" isFullWidth onClick={onClose}>
          {t("Close")}
        </Button>
        <Link href={`/collections/${collectionAddress}/${tokenId}`} passHref>
          <Button tabIndex={2} variant="tall" colorScheme="gray" onClick={onClose}>
            {t("View Item")}
          </Button>
        </Link>
      </ModalFooterGrid>
    </>
  );
};

export default ConfirmationView;
