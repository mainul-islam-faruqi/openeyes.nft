import React from "react";
import Link from "next/link";
import { Divider, Flex, Box } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { Button, Text, ModalBody, ModalFooterGrid, ExternalLink, CheckmarkOutlineIcon } from "uikit";
import { ImageData } from "types/graphql";
import { formatAddress } from "utils/format";
import { getExplorerLink } from "utils/chains";
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

      <ModalBody pb={12}>
        <CheckmarkOutlineIcon color="interactive-01" boxSize={14} mb={7} />
        <Text bold textStyle="heading-03" mb={4}>
          {t("Congrats on your new NFT!")}
        </Text>
        <Text color="text-02">
          {t("You’ll see it in your account once it’s been fully confirmed on the blockchain.")}
        </Text>
        <Divider my={6} />
        <Flex justifyContent="space-between" alignItems="center" mt={2}>
          <Text textStyle="detail" color="text-02">
            {t("Transaction")}
          </Text>
          <Text textStyle="detail" color="text-01">
            <ExternalLink href={getExplorerLink(transaction, "transaction")}>
              {formatAddress(transaction, 7, 4)}
            </ExternalLink>
          </Text>
        </Flex>
      </ModalBody>

      <ModalFooterGrid>
        <Button tabIndex={1} variant="tall" colorScheme="gray" isFullWidth onClick={onClose}>
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
