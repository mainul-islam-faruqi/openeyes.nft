// import { Flex, FlexProps, Box } from "@chakra-ui/react";
// import { formatDistanceToNowStrict } from "date-fns";
// import { formatTimestampAsDateString } from "utils/format";
// import { useTranslation } from "react-i18next";
// import { Event, EventType, OrderStatus } from "types/graphql";
// import { ExternalLink, Text, Popover, TooltipText } from "uikit";
// import { timeAgo, timestampInMs } from "utils/date";
// import { getFloorPricePercentDifference, useFloorPriceText } from "utils/floorPricePercentHelpers";
// import { ActivityAddress, ActivityAmount, ActivityTag } from ".";
// import { getExplorerLink } from "utils/chains";




import { Flex, FlexProps, Box } from "@chakra-ui/react";
import { formatDistanceToNowStrict } from "date-fns";
import { formatTimestampAsDateString } from "utils/format";
import { useTranslation } from "react-i18next";
import { Event, EventType, OrderStatus } from "types/graphql";
import { ExternalLink } from "uikit/Link/Link";
import { Text, TooltipText } from "uikit/Text/Text";
import Popover from "uikit/Popover/Popover";
import { timeAgo, timestampInMs } from "utils/date";
import { getFloorPricePercentDifference, useFloorPriceText } from "utils/floorPricePercentHelpers";
import { ActivityAddress, ActivityAmount, ActivityTag } from "./styles";
import { getExplorerLink } from "utils/chains";



export interface SingleNftActivityRowProps extends FlexProps {
  event: Event;
}

export const SingleNftActivityRow = ({ event, ...props }: SingleNftActivityRowProps) => {
  const { t } = useTranslation();
  const { collection, from, to, createdAt, type, order, hash } = event;
  const timestamp = new Date(createdAt);
  const { floorDiffPercentString, floorDiffPercentBn } =
    (collection.floorOrder && order && getFloorPricePercentDifference(collection.floorOrder.price, order.price)) || {};
  const floorPriceDifferenceText = useFloorPriceText(floorDiffPercentString, floorDiffPercentBn);

  const expiryInMs = order?.endTime && timestampInMs(order.endTime);
  const timeUntilExpiry = expiryInMs && formatDistanceToNowStrict(expiryInMs, { addSuffix: true });
  const expiryAsDate = expiryInMs && formatTimestampAsDateString(expiryInMs);
  const isExpired = order?.status === OrderStatus.EXPIRED;

  return (
    <Flex bg="ui-01" p={4} borderBottom="1px solid" borderBottomColor="border-02" {...props}>
      <Box flex={1}>
        <ActivityTag type={type} mb={4} />
        <Flex alignItems="center" flexWrap="wrap">
          <ActivityAddress label={type === EventType.MINT ? t("By") : t("From")} address={from.address} />
          {to && type !== EventType.MINT && <ActivityAddress label={t("To")} address={to.address} />}
          {hash ? (
            <ExternalLink
              mr={4}
              isTruncated
              textStyle="detail"
              color="interactive-03"
              href={getExplorerLink(hash, "transaction")}
            >
              {timeAgo(timestamp)}
            </ExternalLink>
          ) : (
            <Text mr={4} textStyle="detail" isTruncated color="text-03">
              {timeAgo(timestamp)}
            </Text>
          )}
          {(type === EventType.OFFER || type === EventType.LIST) && isExpired && (
            <Popover label={<TooltipText>{expiryAsDate}</TooltipText>}>
              <Text variant="tooltip" bold textStyle="detail" color="text-03">
                {t("Expired")}
              </Text>
            </Popover>
          )}
          {(type === EventType.OFFER || type === EventType.LIST) && !isExpired && timeUntilExpiry && (
            <Popover label={<TooltipText>{expiryAsDate}</TooltipText>}>
              <Text variant="tooltip" textStyle="detail" color="text-03">
                {t("Expiring {{timeUntilExpiry}}", { timeUntilExpiry })}
              </Text>
            </Popover>
          )}
        </Flex>
      </Box>
      <Flex flexDirection="column" alignItems="end" pl={2}>
        {order && <ActivityAmount order={order} />}
        {floorPriceDifferenceText && (
          <Text textStyle="detail" color="text-03" isTruncated>
            {floorPriceDifferenceText}
          </Text>
        )}
      </Flex>
    </Flex>
  );
};
