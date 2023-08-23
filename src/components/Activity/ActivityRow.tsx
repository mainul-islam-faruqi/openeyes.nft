// import { Box, Flex, Grid, GridItem, GridProps } from "@chakra-ui/react";
// import { formatDistanceToNowStrict } from "date-fns";
// import NextLink from "next/link";
// import { useTranslation } from "react-i18next";
// import { STRATEGIES_ADDRESS } from "config";
// import { formatTimestampAsDateString } from "utils/format";
// import { Event, EventType, OrderStatus } from "types/graphql";
// import { ExternalLink, Text, Popover, TooltipText } from "uikit";
// import { isAddressEqual } from "utils/guards";
// import { timeAgo, timestampInMs } from "utils/date";
// import { getFloorPricePercentDifference, useFloorPriceText } from "utils/floorPricePercentHelpers";
// import { getExplorerLink } from "utils/chains";
// import { Avatar } from "components/Avatar";
// import { TextButton } from "components/Buttons";
// import { Image } from "components/Image";
// import { ActivityAddress, ActivityAmount, ActivityTag } from ".";





import { Box, Flex, Grid, GridItem, GridProps } from "@chakra-ui/react";
import { formatDistanceToNowStrict } from "date-fns";
import NextLink from "next/link";
import { useTranslation } from "react-i18next";
import { STRATEGIES_ADDRESS } from "config/addresses";
import { formatTimestampAsDateString } from "utils/format";
import { Event, EventType, OrderStatus } from "types/graphql";
import { ExternalLink } from "uikit/Link/Link";
import { Text, TooltipText } from "uikit/Text/Text";
import Popover from "uikit/Popover/Popover";
import { isAddressEqual } from "utils/guards";
import { timeAgo, timestampInMs } from "utils/date";
import { getFloorPricePercentDifference, useFloorPriceText } from "utils/floorPricePercentHelpers";
import { getExplorerLink } from "utils/chains";
import { TextButton } from "../Buttons/TextButton";
import { Image } from "../Image";
import { ActivityAddress, ActivityAmount, ActivityTag } from "./styles";




export interface ActivityRowProps extends GridProps {
  event: Event;
  fixedGrid?: boolean;
}

const baseGridArea = "'a b b' 'a c c' '. d d'";

export const ActivityRow = ({ event, fixedGrid, ...props }: ActivityRowProps) => {
  const { t } = useTranslation();
  const { token, from, to, createdAt, type, order, hash, collection } = event;
  const timestamp = new Date(createdAt);
  const { floorDiffPercentString, floorDiffPercentBn } =
    (collection.floorOrder && order && getFloorPricePercentDifference(collection.floorOrder.price, order.price)) || {};
  const floorPriceDifferenceText = useFloorPriceText(floorDiffPercentString, floorDiffPercentBn);

  const expiryInMs = order?.endTime && timestampInMs(order.endTime);
  const timeUntilExpiry = expiryInMs && formatDistanceToNowStrict(expiryInMs, { addSuffix: true });
  const expiryAsDate = expiryInMs && formatTimestampAsDateString(expiryInMs);
  const isExpired = order?.status === OrderStatus.EXPIRED;
  const isStale = order?.status === OrderStatus.ERC20_APPROVAL || order?.status === OrderStatus.ERC20_BALANCE;

  const href = token
    ? `/collections/${event.collection.address}/${token.tokenId}`
    : `/collections/${event.collection.address}`;

  const endTimeText = () => {
    // Stale bid
    if (type === EventType.OFFER && isStale) {
      return (
        <Popover
          label={<TooltipText>{t("Invalidated: hidden from some pages. May become valid again later.")}</TooltipText>}
        >
          <Text variant="tooltip" textStyle="detail" color="text-03">
            {t("Suspended")}
          </Text>
        </Popover>
      );
    }

    // Expired bid or ask
    if ((type === EventType.OFFER || type === EventType.LIST) && isExpired) {
      return (
        <Popover label={<TooltipText>{expiryAsDate}</TooltipText>}>
          <Text variant="tooltip" bold textStyle="detail" color="text-03">
            {t("Expired")}
          </Text>
        </Popover>
      );
    }

    // Active bid or ask
    if ((type === EventType.OFFER || type === EventType.LIST) && !isExpired && timeUntilExpiry) {
      return (
        <Popover label={<TooltipText>{expiryAsDate}</TooltipText>}>
          <Text variant="tooltip" textStyle="detail" color="text-03">
            {t("Expiring {{timeUntilExpiry}}", { timeUntilExpiry })}
          </Text>
        </Popover>
      );
    }
  };

  return (
    <Grid
      alignItems="start"
      bg="ui-01"
      gridTemplateAreas={{
        base: baseGridArea,
        md: fixedGrid ? baseGridArea : "'a b c' 'a d c'",
      }}
      gridTemplateColumns={{ base: "40px 1fr auto", md: "48px 1fr auto" }}
      columnGap={4}
      gridRowGap={2}
      borderBottom="1px solid"
      borderBottomColor="border-01"
      p={4}
      {...props}
    >
      <GridItem gridArea="a">
        <NextLink href={href} passHref>
          <a>
            {token ? (
              <Box position="relative" width={{ base: "40px", md: "48px" }} height={{ base: "40px", md: "48px" }}>
                <Image
                  src={token.image.src}
                  contentType={token.image.contentType}
                  alt={`${token.name} image`}
                  layout="fill"
                  objectFit="contain"
                  sizes="48px"
                />
              </Box>
            ) : (
              <Avatar src={collection.logo?.src || ""} address={collection.name} size={48} />
            )}
          </a>
        </NextLink>
      </GridItem>
      <GridItem gridArea="b">
        <Flex alignItems="center" flexWrap="wrap">
          {(token || collection) && (
            <Box mr={2} maxWidth="100%">
              <NextLink href={href}>
                <a>
                  <TextButton colorScheme="gray" variant="ghost" maxWidth="100%">
                    <Text textStyle="detail" bold isTruncated>
                      {token ? token.name : collection.name}
                    </Text>
                  </TextButton>
                </a>
              </NextLink>
            </Box>
          )}
          <ActivityTag eventOrder={order} type={type} />
        </Flex>
      </GridItem>
      <GridItem gridArea="c">
        <Flex flexDirection={{ base: "row", md: "column" }} alignItems={{ base: "middle", md: "end" }}>
          {order && <ActivityAmount order={order} />}
          {floorPriceDifferenceText && (
            <Text textStyle="detail" color="text-03" isTruncated ml={{ base: 2, md: 0 }}>
              {floorPriceDifferenceText}
            </Text>
          )}
        </Flex>
      </GridItem>
      <GridItem gridArea="d">
        <Flex alignItems="center" flexWrap="wrap">
          <ActivityAddress label={type === EventType.MINT ? t("By") : t("From")} address={from.address} />
          {/* Transfer / Sale */}
          {to && type !== EventType.MINT && <ActivityAddress label={t("to")} address={to.address} />}
          {/* Private Listing */}
          {type === EventType.LIST && order?.params && isAddressEqual(order?.strategy, STRATEGIES_ADDRESS.private) && (
            <ActivityAddress label={t("for")} address={order?.params[0]} />
          )}
          {/* Collection offer */}
          {type === EventType.OFFER && isAddressEqual(order?.strategy, STRATEGIES_ADDRESS.collection) && (
            <Flex mr={4}>
              <Text textStyle="detail" color="text-03" mr={2}>
                {t("to")}
              </Text>
              <Text textStyle="detail" color="text-02" bold>
                {t("{{totalSupply}} items", { totalSupply: collection.totalSupply.toLocaleString() })}
              </Text>
            </Flex>
          )}
          {hash ? (
            <ExternalLink
              mr={4}
              isTruncated
              textStyle="detail"
              color="text-01"
              href={getExplorerLink(hash, "transaction")}
            >
              {timeAgo(timestamp)}
            </ExternalLink>
          ) : (
            <Text mr={4} textStyle="detail" isTruncated color="text-03">
              {timeAgo(timestamp)}
            </Text>
          )}
          {endTimeText()}
        </Flex>
      </GridItem>
    </Grid>
  );
};
