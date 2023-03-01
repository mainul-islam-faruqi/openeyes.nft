import { Box, Flex, FlexProps, IconButton } from "@chakra-ui/react";
import { formatDistanceToNowStrict } from "date-fns";
import { BigNumberish } from "ethers";
import { useTranslation } from "next-i18next";
import { MakerOrderWithSignatureAndHash } from "types/orders";
import { ArrowRightIcon, Text, EthHalfIcon } from "uikit";
import { timestampInMs } from "utils/date";
import { getFloorPricePercentDifference, useFloorPriceText } from "utils/floorPricePercentHelpers";
import { formatToSignificant } from "utils/format";

interface SelectOrderRowProps extends FlexProps {
  makerOrder: MakerOrderWithSignatureAndHash;
  onSelectOrder: (makerOrder: MakerOrderWithSignatureAndHash) => void;
  collectionFloorOrderPrice?: BigNumberish;
}

export const SelectOrderRow = ({
  makerOrder,
  onSelectOrder,
  collectionFloorOrderPrice,
  ...props
}: SelectOrderRowProps) => {
  const { t } = useTranslation();
  const startTimeMs = timestampInMs(makerOrder.startTime);
  const endTimeMs = timestampInMs(makerOrder.endTime);
  const { floorDiffPercentString, floorDiffPercentBn } =
    (collectionFloorOrderPrice && getFloorPricePercentDifference(collectionFloorOrderPrice, makerOrder.price)) || {};
  const floorPriceDifferenceText = useFloorPriceText(floorDiffPercentString, floorDiffPercentBn);

  const handleClick = () => onSelectOrder(makerOrder);

  return (
    <Flex
      alignItems="center"
      cursor="pointer"
      userSelect="none"
      onClick={handleClick}
      px={4}
      py={6}
      borderBottom="1px solid"
      borderBottomColor="gray.700"
      {...props}
    >
      <Box flex={1}>
        <Flex mb={3}>
          <EthHalfIcon boxSize={14} width="10px" height="20px" mr={1} />
          <Text bold textStyle="detail">
            {formatToSignificant(makerOrder.price, 4)}
          </Text>
          {floorPriceDifferenceText && (
            <Text color="gray.400" textStyle="detail">
              {floorPriceDifferenceText}
            </Text>
          )}
        </Flex>
        <Flex alignItems="center">
          <Text textStyle="detail" color="gray.400" mr={2}>
            {formatDistanceToNowStrict(startTimeMs, { addSuffix: true })}
          </Text>
          <Text textStyle="detail" color="gray.400">
            {t("Expiring {{timeUntilExpiry}}", {
              timeUntilExpiry: formatDistanceToNowStrict(endTimeMs, { addSuffix: true }),
            })}
          </Text>
        </Flex>
      </Box>
      <IconButton aria-label="select order" variant="ghost" colorScheme="gray">
        <ArrowRightIcon />
      </IconButton>
    </Flex>
  );
};
