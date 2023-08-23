import React from "react";
import Link from "next/link";
import { useWeb3React } from "@web3-react/core";
import { Flex, Divider, UnorderedList, ListItem, Box } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { Button, Text, ModalBody, ModalFooterGrid, WethIcon } from "uikit";
import { formatTimestampAsDateString } from "utils/format";
import { ImageData } from "types/graphql";
import { NftMeta } from "../shared";

interface Props {
  tokenName: string;
  tokenImage: ImageData;
  collectionName: string;
  isVerified?: boolean;
  onClose: () => void;
  price: string;
  endTime: number;
}

const ConfirmationView: React.FC<Props> = ({
  tokenName,
  tokenImage,
  collectionName,
  isVerified,
  price,
  endTime,
  onClose,
}) => {
  const { account } = useWeb3React();
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
        <Flex justifyContent="space-between" alignItems="center">
          <Text bold textStyle="heading-03">
            {t("Offer Made!")}
          </Text>
          <Flex alignItems="center">
            <WethIcon />
            <Text color="text-02" bold>
              {price} WETH
            </Text>
          </Flex>
        </Flex>
        <Divider my={4} />
        <UnorderedList>
          <Text as={ListItem} color="text-02">
            {t(
              "If a seller accepts your offer, it’ll be automatically withdrawn from all other items and your purchase will be finalized."
            )}
          </Text>
          <Text as={ListItem} color="text-02">
            {t("Keep enough WETH in your wallet to pay, or the seller won’t be able to accept your offer.")}
          </Text>
        </UnorderedList>
        <Divider my={4} />
        <Flex justifyContent="space-between">
          <Text color="text-02">{t("Validity")}</Text>
          <div>
            <Text color="text-02">
              {t("Start")} {formatTimestampAsDateString(Date.now())}
            </Text>
            <Text color="text-02">
              {t("End")} {formatTimestampAsDateString(endTime)}
            </Text>
          </div>
        </Flex>
      </ModalBody>

      <ModalFooterGrid>
        <Button tabIndex={1} variant="tall" colorScheme="gray" isFullWidth onClick={onClose}>
          {t("Close")}
        </Button>
        <Link href={`/accounts/${account}#offers`} passHref>
          <Button tabIndex={2} variant="tall">
            {t("View Your Offers")}
          </Button>
        </Link>
      </ModalFooterGrid>
    </>
  );
};

export default ConfirmationView;
