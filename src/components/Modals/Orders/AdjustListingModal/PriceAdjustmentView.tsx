// @ts-nocheck
import { useMemo } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { MINIMUM_LISTING_PRICE } from "config/constants";
import { BigNumber, BigNumberish } from "ethers";
import { useTranslation } from "next-i18next";
import { Button, EthHalfIcon, ModalBody, ModalFooterGrid, Text } from "uikit";
import { ModalProps } from "uikit/Modal/Modal"
import { formatToSignificant, toDecimals } from "utils/format";
import { MakerOrderWithSignatureAndHash } from "types/orders";
import { numberInputErrorCheck, NumberInputErrorType } from "utils/numberInputErrorCheck";
import { getFloorPricePercentDifference, getGlobalFloor } from "utils/floorPricePercentHelpers";
import { CollectionFloor } from "types/graphql";
import { CurrencyInput, ListingRewardPointDisplay, OsListingPriceRow } from "../shared";

interface PriceAdjustmentViewProps {
  currentPrice: MakerOrderWithSignatureAndHash["price"];
  newPrice: string;
  collectionFloor: CollectionFloor;
  points: number | null;
  onNewPriceChange: (newAmount: string) => void;
  onConfirmNewPrice: () => void;
  onClose: ModalProps["onClose"];
  osListingPriceInWei: BigNumberish | null;
}

const minimumListingPrice = BigNumber.from(MINIMUM_LISTING_PRICE);

export const PriceAdjustmentView = ({
  currentPrice,
  newPrice,
  collectionFloor,
  points,
  onNewPriceChange,
  onConfirmNewPrice,
  onClose,
  osListingPriceInWei,
}: PriceAdjustmentViewProps) => {
  const { t } = useTranslation();
  const maxAmount = useMemo(() => BigNumber.from(currentPrice), [currentPrice]);
  const { globalFloor, floorPrice } = getGlobalFloor(collectionFloor);

  // Floor price warning conditions
  const { floorDiffPercentString, hasLowThresholdReached } = getFloorPricePercentDifference(
    floorPrice,
    newPrice && toDecimals(newPrice)
  );

  const inputError = numberInputErrorCheck(newPrice, {
    max: maxAmount,
    min: minimumListingPrice,
    errorMessages: {
      [NumberInputErrorType.BELOW_MIN]: t("You must list for a minimum of {{amount}} {{token}}", {
        amount: formatToSignificant(minimumListingPrice, 6),
        token: "ETH",
      }),
      [NumberInputErrorType.ABOVE_MAX]: t("Cancel your listing first if you want to increase price"),
      [NumberInputErrorType.INVALID_INPUT]: t("Please enter a valid number"),
    },
  });

  const getInputWarning = () => {
    if (inputError && inputError.message) {
      return inputError.message;
    }

    if (hasLowThresholdReached) {
      return t("{{floorDiff}}% lower than floor price", { floorDiff: floorDiffPercentString?.replace("-", "") });
    }
  };

  return (
    <>
      <ModalBody>
        <Flex alignItems="center" justifyContent="space-between">
          <Text textStyle="detail" color="text-02">
            {t("Current Price")}
          </Text>
          <Box>
            <Flex alignItems="center">
              <EthHalfIcon />
              <Text bold textStyle="detail" verticalAlign="bottom">
                {formatToSignificant(currentPrice, 4)}
              </Text>
            </Flex>
          </Box>
        </Flex>
        {floorPrice && (
          <Flex alignItems="center" justifyContent="space-between">
            <Text textStyle="detail" color="text-02">
              {t("Floor Price")}
            </Text>
            <Box>
              <Flex alignItems="center">
                <EthHalfIcon />
                <Text bold textStyle="detail" verticalAlign="bottom">
                  {formatToSignificant(floorPrice, 4)}
                </Text>
              </Flex>
            </Box>
          </Flex>
        )}
        <OsListingPriceRow priceInWei={osListingPriceInWei} my={4} />
        <Flex alignItems="center" justifyContent="space-between" mb={2} mt={4}>
          <Text textStyle="detail" color="text-02">
            {t("New Price")}
          </Text>
          <ListingRewardPointDisplay points={points} globalFloor={globalFloor} priceInEth={newPrice} />
        </Flex>
        <CurrencyInput
          price={newPrice}
          setPrice={onNewPriceChange}
          currency={"ETH"}
          warning={getInputWarning()}
          wrapperProps={{ mb: 4 }}
        />
      </ModalBody>
      <ModalFooterGrid>
        <Button variant="tall" colorScheme="gray" isFullWidth onClick={onClose}>
          {t("Cancel")}
        </Button>
        <Button variant="tall" isFullWidth disabled={!!inputError} onClick={onConfirmNewPrice}>
          {t("Lower Price")}
        </Button>
      </ModalFooterGrid>
    </>
  );
};
