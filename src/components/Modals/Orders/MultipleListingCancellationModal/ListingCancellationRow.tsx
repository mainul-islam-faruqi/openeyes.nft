// @ts-nocheck
import React from "react";
import { BigNumberish } from "ethers";
import { Flex, Grid, GridProps } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { formatDistanceToNowStrict } from "date-fns";
import { Popover, TooltipText, Text, WethHalfIcon } from "uikit";
import { formatToSignificant, formatTimestampAsDateString } from "utils/format";
import { getFloorPricePercentDifference, useFloorPriceText } from "utils/floorPricePercentHelpers";
import { timestampInMs } from "utils/date";
import { CancelOrdersButton } from "components/Buttons/CancelOrdersButton";
import { MakerOrderWithSignatureAndHash } from "types/orders";

interface Props extends GridProps {
  makerOrder: MakerOrderWithSignatureAndHash;
  collectionFloorOrderPrice?: BigNumberish;
  onCancelSuccess?: () => void;
}

export const ListingCancellationRow: React.FC<Props> = ({
  makerOrder,
  collectionFloorOrderPrice,
  onCancelSuccess,
  ...props
}) => {
  const { t } = useTranslation();

  const startTimeMs = timestampInMs(makerOrder.startTime);
  const endTimeMs = timestampInMs(makerOrder.endTime);

  const { floorDiffPercentString, floorDiffPercentBn } =
    (collectionFloorOrderPrice && getFloorPricePercentDifference(collectionFloorOrderPrice, makerOrder.price)) || {};
  const floorPriceDifferenceText = useFloorPriceText(floorDiffPercentString, floorDiffPercentBn);

  return (
    <Grid
      gridTemplateAreas="'a c' 'b c'"
      gridTemplateColumns="1fr auto"
      gridTemplateRows="auto auto"
      alignItems="center"
      rowGap={3}
      px={4}
      py={6}
      borderBottomWidth="1px"
      borderBottomColor="border-01"
      {...props}
    >
      <Flex gridArea="a">
        <Flex mr={2}>
          <WethHalfIcon boxSize={14} width="10px" height="20px" mr={1} />
          <Text bold textStyle="detail">
            {formatToSignificant(makerOrder.price, 4)}
          </Text>
        </Flex>
        {floorPriceDifferenceText && (
          <Text color="text-03" textStyle="detail">
            {floorPriceDifferenceText}
          </Text>
        )}
      </Flex>
      <Flex gridArea="b" alignItems="center">
        <Popover label={<TooltipText>{formatTimestampAsDateString(endTimeMs)}</TooltipText>}>
          <Text textStyle="detail" color="text-03" mr={2}>
            {formatDistanceToNowStrict(startTimeMs, { addSuffix: true })}
          </Text>
        </Popover>
        <Popover label={<TooltipText>{formatTimestampAsDateString(endTimeMs)}</TooltipText>}>
          <Text textStyle="detail" color="text-03">
            {t("Expiring {{timeUntilExpiry}}", {
              timeUntilExpiry: formatDistanceToNowStrict(endTimeMs, { addSuffix: true }),
            })}
          </Text>
        </Popover>
      </Flex>
      <CancelOrdersButton gridArea="c" nonces={[makerOrder.nonce]} onSuccess={onCancelSuccess} />
    </Grid>
  );
};
