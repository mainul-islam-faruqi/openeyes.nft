import { useWeb3React } from "@web3-react/core";
import { useInfiniteTokensWithBids } from "hooks/graphql/tokens";
import { useEagerConnect } from "hooks/useEagerConnect";
import flatten from "lodash/flatten";
import uniqBy from "lodash/uniqBy";
import { getTokenOwnerFilter } from "utils/tokens";

export const useUserTokensWithBids = (address: string) => {
  const { account } = useWeb3React();
  const hasTriedConnection = useEagerConnect();

  const { data: tokensWithStandardBids, ...tokensWithStandardBidsQuery } = useInfiniteTokensWithBids(
    {
      filter: {
        owner: address,
        withStandardBidOnly: true,
      },
      ownerFilter: getTokenOwnerFilter({ connectedAccount: account }),
    },
    { enabled: hasTriedConnection }
  );
  const { data: tokensWithCollectionBids, ...tokensWithCollectionBidsQuery } = useInfiniteTokensWithBids(
    {
      filter: { owner: address, withCollectionBidOnly: true },
      ownerFilter: getTokenOwnerFilter({ connectedAccount: account }),
    },
    {
      enabled: hasTriedConnection,
    }
  );

  const isLoading = tokensWithStandardBidsQuery.isLoading || tokensWithCollectionBidsQuery.isLoading;
  const isFetching = tokensWithStandardBidsQuery.isFetching || tokensWithCollectionBidsQuery.isFetching;
  const isSuccess = tokensWithStandardBidsQuery.isSuccess && tokensWithCollectionBidsQuery.isSuccess;
  const hasNextPage = tokensWithStandardBidsQuery.hasNextPage || tokensWithCollectionBidsQuery.hasNextPage;

  const fetchNextPage = () => {
    if (tokensWithStandardBidsQuery.hasNextPage && tokensWithCollectionBidsQuery.hasNextPage) {
      tokensWithStandardBidsQuery.fetchNextPage();
      tokensWithCollectionBidsQuery.fetchNextPage();
      return;
    }

    if (tokensWithStandardBidsQuery.hasNextPage && !tokensWithCollectionBidsQuery.hasNextPage) {
      tokensWithStandardBidsQuery.fetchNextPage();
      return;
    }

    if (!tokensWithStandardBidsQuery.hasNextPage && tokensWithCollectionBidsQuery.hasNextPage) {
      tokensWithCollectionBidsQuery.fetchNextPage();
      return;
    }
  };

  const data = () => {
    if (isSuccess) {
      const flattenedStandardBids = tokensWithStandardBids && flatten(tokensWithStandardBids.pages);
      const flattenedCollectionBids = tokensWithCollectionBids && flatten(tokensWithCollectionBids.pages);
      const allTokens = [...(flattenedStandardBids || []), ...(flattenedCollectionBids || [])];
      const uniqueTokens = uniqBy(allTokens, (token) => token.id + token.collection.address);

      return uniqueTokens;
    }
  };

  return { data: data(), isLoading, isFetching, isSuccess, hasNextPage, fetchNextPage };
};
