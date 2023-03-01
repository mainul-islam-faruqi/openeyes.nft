import { useState } from "react";
import { Box, BoxProps, Flex } from "@chakra-ui/react";
import LazyLoad from "react-lazyload";
import getUnixTime from "date-fns/getUnixTime";
import flatten from "lodash/flatten";
import uniqueId from "lodash/uniqueId";
import { useTranslation } from "react-i18next";
import { NFT, OrderSort } from "types/graphql";
import { SectionPlaceholder, Text, Button } from "uikit";
import { ORDERS_PER_PAGE } from "config";
import { useInfiniteTokenOrders } from "hooks/graphql/tokens";
import { useOrderSortLabels } from "hooks/useOrderSortLabels";
import OrderRow from "components/OrderRows/OrderRow";
import { OrderRowLoadingSkeleton } from "components/OrderRows/OrderRowLoadingSkeleton";
import { DropdownMenu } from "components/DropdownMenu";

interface ListingsPanelProps extends BoxProps {
  nft: NFT;
  isUserNft?: boolean;
}

const now = getUnixTime(new Date());

export const ListingsPanel = ({ nft, isUserNft, ...props }: ListingsPanelProps) => {
  const { collection, tokenId, name, image } = nft;
  const { t } = useTranslation();

  const { labels, orderSortMap, getOrderSortFromLabel } = useOrderSortLabels();
  const defaultSortState = { label: orderSortMap.PRICE_ASC, orderSort: OrderSort.PRICE_ASC };
  const [sortState, setSortState] = useState(defaultSortState);

  const handleSelect = (orderSortLabel: string) => {
    const orderSort = getOrderSortFromLabel(orderSortLabel);
    return setSortState(orderSort ? { label: orderSortLabel, orderSort } : defaultSortState);
  };

  const {
    data: ordersRes,
    isLoading,
    isFetching,
    isSuccess,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteTokenOrders({
    collection: collection.address,
    tokenId,
    filter: {
      isOrderAsk: true,
      endTime: now,
    },
    sort: sortState.orderSort,
  });

  const flattenedOrderResults = ordersRes && flatten(ordersRes.pages);

  return (
    <Box pt={8} {...props}>
      <Box px={4}>
        {isSuccess && (!flattenedOrderResults || flattenedOrderResults?.length === 0) ? null : ( // if query has succeeded and there is no data - do not show dropdown
          <DropdownMenu labels={labels} selectedLabel={sortState.label} handleSelect={handleSelect} />
        )}
      </Box>
      <Flex flexDirection="column" mt={8}>
        {isSuccess &&
          (flattenedOrderResults && flattenedOrderResults.length > 0 ? (
            flattenedOrderResults.map((order) => (
              <OrderRow
                key={order.hash}
                tokenId={tokenId}
                tokenName={name}
                tokenImage={image}
                collectionName={collection.name}
                collectionAddress={collection.address}
                collectionType={collection.type}
                isVerified={collection.isVerified}
                order={order}
                collectionfloorPrice={collection.floorOrder?.price}
                isNftOwnedByUser={isUserNft}
                isFullWidth
              />
            ))
          ) : (
            <SectionPlaceholder>
              <Text bold>{t("None listed")}</Text>
            </SectionPlaceholder>
          ))}
        {isFetching && (
          <>
            {[...Array(ORDERS_PER_PAGE)].map(() => (
              <LazyLoad
                key={uniqueId()}
                placeholder={<OrderRowLoadingSkeleton isFullWidth />}
                style={{ width: "100%" }}
              >
                <OrderRowLoadingSkeleton isFullWidth />
              </LazyLoad>
            ))}
          </>
        )}
        {hasNextPage && (
          <Flex justifyContent="center" pt={6}>
            <Button isLoading={isFetching} disabled={isLoading} onClick={() => fetchNextPage()}>
              {t("Load More")}
            </Button>
          </Flex>
        )}
      </Flex>
    </Box>
  );
};
