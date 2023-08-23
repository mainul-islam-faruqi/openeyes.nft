import { Flex, Box } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import flatten from "lodash/flatten";
import uniqueId from "lodash/uniqueId";
import LazyLoad from "react-lazyload";
import { useTranslation } from "react-i18next";
import { ORDERS_PER_PAGE } from "config";
import { Button } from "uikit";
import { NFTWithBids } from "utils/graphql/getTokensWithBids";
import { isAddressOneOfOwners } from "utils/guards";
import { useInfiniteTokenBids } from "hooks/graphql/tokens";
import OrderRow from "./OrderRow";
import { OrderRowLoadingSkeleton } from "./OrderRowLoadingSkeleton";

interface NftOfferCardProps {
  nft: NFTWithBids;
}

const NftOfferCollapsableChildren: React.FC<NftOfferCardProps> = ({ nft }) => {
  const { t } = useTranslation();
  const { account } = useWeb3React();
  const { collection, tokenId, owners, name, image } = nft;

  const {
    data: bids,
    isLoading,
    isFetching,
    isSuccess,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteTokenBids({
    address: collection.address,
    tokenId,
  });

  const countBids = nft.bids && nft.bids.length;
  const flattenedBids = bids && flatten(bids.pages);

  return (
    <Box>
      {isSuccess &&
        flattenedBids &&
        flattenedBids.length > 0 &&
        flattenedBids.map((bid) => (
          <LazyLoad
            key={bid.signer + bid.startTime + bid.endTime}
            placeholder={<OrderRowLoadingSkeleton />}
            style={{ width: "100%" }}
          >
            <OrderRow
              tokenId={tokenId}
              tokenName={name}
              tokenImage={image}
              collectionName={collection.name}
              collectionAddress={collection.address}
              collectionType={collection.type}
              isVerified={collection.isVerified}
              order={bid}
              collectionfloorPrice={collection.floorOrder?.price}
              isNftOwnedByUser={isAddressOneOfOwners(account, owners)}
            />
          </LazyLoad>
        ))}
      {isFetching && (
        <>
          {[...Array(countBids < ORDERS_PER_PAGE ? countBids : ORDERS_PER_PAGE)].map(() => (
            <LazyLoad key={uniqueId()} placeholder={<OrderRowLoadingSkeleton />} style={{ width: "100%" }}>
              <OrderRowLoadingSkeleton />
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
    </Box>
  );
};

export default NftOfferCollapsableChildren;
