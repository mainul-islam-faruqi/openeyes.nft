import { Box, Flex, Stack } from "@chakra-ui/react";
import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { ModalFooterGrid, ModalBody, Button, Text, WethIcon } from "uikit";
import Warning from "uikit/Icons/components/Warning";

interface Props {
  collectionFloorPriceInEth: string;
  floorDiffPercentString?: string;
  onBack: () => void;
  onAccept: () => void;
  priceInEth: string;
}

const FloorPriceWarningView: React.FC<Props> = ({
  collectionFloorPriceInEth,
  floorDiffPercentString,
  onBack,
  onAccept,
  priceInEth,
}) => {
  const { t } = useTranslation();
  const floorDiffPercentStringDisplay = floorDiffPercentString?.replace("-", "");

  return (
    <>
      <ModalBody>
        <Stack spacing={6}>
          <Box>
            <Warning boxSize={14} color="text-warning" />
          </Box>
          <Box>
            <Trans i18nKey="transListSaleFloorPriceWarning">
              <Text textStyle="detail">
                This offer is{" "}
                <Text as="span" color="text-warning" textStyle="detail">
                  {{ floorDiffPercentStringDisplay }}%
                </Text>{" "}
                lower than the price of any other NFT from this collection on OpenEyes.nft.
              </Text>
            </Trans>
            <Text textStyle="detail">{t("Accept anyway?")}</Text>
          </Box>
          <Box>
            <Flex justifyContent="space-between" flexDirection="row">
              <Text color="text-03" textStyle="detail">
                {t("Offer Price")}
              </Text>
              <Flex alignItems="center" justifyContent="flex-end" gridColumn="2" gridRow="1">
                <WethIcon boxSize={4} mr={1} />
                <Text textStyle="detail" bold>
                  {priceInEth} WETH
                </Text>
              </Flex>
            </Flex>
            <Flex justifyContent="space-between" flexDirection="row">
              <Text color="text-03" textStyle="detail">
                {t("Collection Floor Price")}
              </Text>
              <Flex alignItems="center" justifyContent="flex-end" gridColumn="2" gridRow="1">
                <WethIcon boxSize={4} mr={1} />
                <Text textStyle="detail" bold>
                  {collectionFloorPriceInEth} WETH
                </Text>
              </Flex>
            </Flex>
          </Box>
        </Stack>
      </ModalBody>
      <ModalFooterGrid>
        <Button tabIndex={1} variant="tall" colorScheme="gray" onClick={onBack}>
          {t("Back")}
        </Button>
        <Button tabIndex={2} variant="tall" onClick={onAccept}>
          {t("Accept Offer")}
        </Button>
      </ModalFooterGrid>
    </>
  );
};

export default FloorPriceWarningView;
