import { useState } from "react";
import { Box, BoxProps, Flex } from "@chakra-ui/react";
import LazyLoad from "react-lazyload";
import flatten from "lodash/flatten";
import uniqueId from "lodash/uniqueId";
import { useTranslation } from "react-i18next";
import { NFT, OrderSort } from "types/graphql";
import { ORDERS_PER_PAGE } from "config";
import { SectionPlaceholder, Text, Button } from "uikit";
import { useInfiniteTokenBids } from "hooks/graphql/tokens";
import { useOrderSortLabels } from "hooks/useOrderSortLabels";
import OrderRow from "components/OrderRows/OrderRow";
import { OrderRowLoadingSkeleton } from "components/OrderRows/OrderRowLoadingSkeleton";
import { DropdownMenu } from "components/DropdownMenu";

interface OffersPanelProps extends BoxProps {
  nft: NFT;
  isUserNft?: boolean;
}

export const OffersPanel = ({ nft, isUserNft, ...props }: OffersPanelProps) => {
  const { t } = useTranslation();
  const { collection, tokenId, name, image } = nft;

  const { labels, orderSortMap, getOrderSortFromLabel } = useOrderSortLabels();
  const defaultSortState = { label: orderSortMap.PRICE_DESC, orderSort: OrderSort.PRICE_DESC };
  const [sortState, setSortState] = useState(defaultSortState);

  const handleSelect = (orderSortLabel: string) => {
    const orderSort = getOrderSortFromLabel(orderSortLabel);
    return setSortState(orderSort ? { label: orderSortLabel, orderSort } : defaultSortState);
  };

  const {
    data: bidsRes,
    isLoading,
    isFetching,
    isSuccess,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteTokenBids({ address: collection.address, tokenId, sort: sortState.orderSort });

  const flattenedBidResults = bidsRes && flatten(bidsRes.pages);

  return (
    <Box py={8} {...props}>
      <Box px={4}>
        {isSuccess && (!flattenedBidResults || flattenedBidResults?.length === 0) ? null : ( // if query has succeeded and there is no data - do not show dropdown
          <DropdownMenu
            listProps={{ zIndex: "sticky" }}
            labels={labels}
            selectedLabel={sortState.label}
            handleSelect={handleSelect}
          />
        )}
      </Box>
      <Flex flexDirection="column" mt={8}>
        {isSuccess &&
          (flattenedBidResults && flattenedBidResults.length > 0 ? (
            flattenedBidResults.map((bid) => (
              <OrderRow
                key={bid.signer + bid.startTime + bid.endTime}
                tokenId={tokenId}
                tokenName={name}
                tokenImage={image}
                collectionName={collection.name}
                collectionAddress={collection.address}
                collectionType={collection.type}
                isVerified={collection.isVerified}
                order={bid}
                collectionfloorPrice={collection.floorOrder?.price}
                isFullWidth
                isNftOwnedByUser={isUserNft}
              />
            ))
          ) : (
            <SectionPlaceholder>
              <Text bold>{t("No offers found")}</Text>
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
