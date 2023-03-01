import { baseQueryKeys } from "config/reactQueries";
import { ORDERS_PER_PAGE, TOKENS_PER_PAGE, TOKENS_WITH_BIDS_PER_PAGE } from "config/constants";
import last from "lodash/last";
import { useCallback } from "react";
import { useInfiniteQuery, UseInfiniteQueryOptions, useQuery, useQueryClient, UseQueryOptions } from "react-query";
import {
  NFT,
  NFTCard,
  OrderFilter,
  OrderSort,
  Pagination,
  TokenFilter,
  TokenOwner,
  TokenOwnerFilter,
  TokensSort,
} from "types/graphql";
import { MakerOrderWithSignatureAndHash } from "types/orders";
import {
  getToken,
  GetTokenParams,
  getTokenOwners,
  GetTokenOwnersParams,
} from "utils/graphql/getToken";
import { getTokens, getUserTokens } from "utils/graphql/getTokens"
import { getTokenBids } from "utils/graphql/getTokenBids"
import getTokenOrders from "utils/graphql/getTokenOrders";
import { getTokensWithBids, NFTWithBids, TokensWithBidsParams } from "utils/graphql/getTokensWithBids";

export const tokenKeys = {
  ...baseQueryKeys("tokens"),
  tokens: (filter?: TokenFilter, sort?: TokensSort, ownerFilter?: TokenOwnerFilter) => [
    ...tokenKeys.infiniteQueries(),
    filter,
    sort,
    ownerFilter,
  ],
  tokensWithBids: (filter?: TokenFilter, ownerFilter?: TokenOwnerFilter) => [
    ...tokenKeys.infiniteQueries(),
    "tokens-with-bids",
    filter,
    ownerFilter,
  ],
  token: (collectionAddress: string, tokenId: string) => [...tokenKeys.single(), collectionAddress, tokenId],
  tokenOwners: (collectionAddress: string, tokenId: string, ownerFilter?: TokenOwnerFilter) => [
    ...tokenKeys.single(),
    "owners",
    collectionAddress,
    tokenId,
    ownerFilter,
  ],
  tokenBids: (collectionAddress: string, tokenId: string, filter?: OrderFilter, sort?: OrderSort) => [
    ...tokenKeys.infiniteQueries(),
    collectionAddress,
    tokenId,
    filter,
    sort,
  ],
  tokenOrders: (
    collectionAddress: string,
    tokenId: string,
    filter?: OrderFilter,
    pagination?: Pagination,
    sort?: OrderSort
  ) => [...tokenKeys.list(), collectionAddress, tokenId, filter, pagination, sort],
  userTokens: (address: string, filter?: TokenFilter, sort?: TokensSort, ownerFilter?: TokenOwnerFilter) => [
    ...tokenKeys.infiniteQueries(),
    address,
    filter,
    sort,
    ownerFilter,
  ],
};

const getNextTokensPageParam = (lastPage: NFTCard[]): Pagination | undefined => {
  if (lastPage.length < TOKENS_PER_PAGE) {
    // No more data to fetch
    return undefined;
  }
  const lastNft = last(lastPage);
  return { first: TOKENS_PER_PAGE, cursor: lastNft?.id };
};

interface UseInfiniteTokensProps {
  filter?: TokenFilter;
  sort?: TokensSort;
  ownerFilter?: TokenOwnerFilter;
}

export const useInfiniteTokens = (
  { filter, sort = TokensSort.LAST_RECEIVED, ownerFilter }: UseInfiniteTokensProps,
  queryOptions?: UseInfiniteQueryOptions<NFTCard[], any, NFTCard[]>
) => {
  return useInfiniteQuery<NFTCard[]>(
    tokenKeys.tokens(filter, sort, ownerFilter),
    ({ pageParam = { first: TOKENS_PER_PAGE } }) => getTokens({ filter, pagination: pageParam, sort, ownerFilter }),
    {
      getNextPageParam: (lastPage) => getNextTokensPageParam(lastPage),
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      ...queryOptions,
    }
  );
};

interface UseTokensProps extends UseInfiniteTokensProps {
  pagination?: Pagination;
}

export const useTokens = (
  { filter, sort, pagination = { first: TOKENS_PER_PAGE }, ownerFilter }: UseTokensProps,
  queryOptions?: UseQueryOptions<NFTCard[], any, NFTCard[]>
) => {
  return useQuery<NFTCard[]>(
    tokenKeys.tokens(filter, sort, ownerFilter),
    () => getTokens({ filter, pagination, sort, ownerFilter }),
    queryOptions
  );
};

const getNextTokenOrdersPageParam = (
  lastPage: MakerOrderWithSignatureAndHash[],
  paginationFirst: number
): Pagination | undefined => {
  if (lastPage.length < paginationFirst) {
    // No more data to fetch
    return undefined;
  }
  const lastBid = last(lastPage);
  // @ts-ignore
  return { first: paginationFirst, cursor: lastBid?.hash };
};

type UseInfiniteTokenBids = {
  address: string;
  tokenId: string;
  filter?: OrderFilter;
  sort?: OrderSort;
  queryOptions?: UseInfiniteQueryOptions<MakerOrderWithSignatureAndHash[], any, MakerOrderWithSignatureAndHash[]>;
  pagination?: Pagination;
};

export const useInfiniteTokenBids = ({
  address,
  tokenId,
  filter,
  sort,
  queryOptions,
  pagination = { first: ORDERS_PER_PAGE },
}: UseInfiniteTokenBids) => {
  return useInfiniteQuery<MakerOrderWithSignatureAndHash[]>(
    tokenKeys.tokenBids(address, tokenId, filter, sort),
    ({ pageParam = pagination }) => getTokenBids(address, tokenId, pageParam, filter, sort),
    {
      getNextPageParam: (lastPage) => getNextTokenOrdersPageParam(lastPage, pagination.first || ORDERS_PER_PAGE),
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      ...queryOptions,
    }
  );
};

type UseInfiniteTokenOrdersProps = {
  collection: string;
  tokenId: string;
  filter?: OrderFilter;
  pagination?: Pagination;
  queryOptions?: UseInfiniteQueryOptions<MakerOrderWithSignatureAndHash[], any, MakerOrderWithSignatureAndHash[]>;
  sort?: OrderSort;
};

/**
 * Paginated query to return orders for a given token
 *
 * @param collection address string
 * @param tokenId string
 * @param filter OrderFilter
 * @param queryOptions UseInfiniteQueryOptions
 * @param pagination Pagination
 * @returns UseInfiniteQueryResult
 */
export const useInfiniteTokenOrders = ({
  collection,
  tokenId,
  filter,
  queryOptions,
  sort,
  pagination = { first: ORDERS_PER_PAGE },
}: UseInfiniteTokenOrdersProps) => {
  return useInfiniteQuery<MakerOrderWithSignatureAndHash[]>(
    tokenKeys.tokenOrders(collection, tokenId, filter, pagination, sort),
    ({ pageParam = pagination }) => getTokenOrders({ collection, tokenId, filter, pagination: pageParam, sort }),
    {
      getNextPageParam: (lastPage) => getNextTokenOrdersPageParam(lastPage, pagination.first || ORDERS_PER_PAGE),
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      ...queryOptions,
    }
  );
};

export const useToken = ({ collection, tokenId }: GetTokenParams, queryOptions?: UseQueryOptions<NFT, any, NFT>) => {
  return useQuery<NFT>(tokenKeys.token(collection, tokenId), () => getToken({ collection, tokenId }), queryOptions);
};

export const useInvalidateToken = (collectionAddress: string, tokenId: string) => {
  const queryClient = useQueryClient();

  return useCallback(() => {
    queryClient.invalidateQueries(tokenKeys.token(collectionAddress, tokenId));
  }, [collectionAddress, tokenId, queryClient]);
};

export const useInvalidateTokenOrders = (
  collectionAddress: string,
  tokenId: string,
  filter?: OrderFilter,
  pagination?: Pagination
) => {
  const queryClient = useQueryClient();

  return useCallback(() => {
    queryClient.invalidateQueries(tokenKeys.tokenOrders(collectionAddress, tokenId, filter, pagination));
  }, [collectionAddress, tokenId, filter, pagination, queryClient]);
};

const getNextTokensWithBidsPageParam = (lastPage: NFTWithBids[], first: number) => {
  if (lastPage.length < first) {
    // No more data to fetch
    return undefined;
  }
  const lastNft = last(lastPage)!;
  const cursor = lastNft.id;
  return { first, cursor };
};

export const useInfiniteTokensWithBids = (
  { filter, pagination = { first: TOKENS_WITH_BIDS_PER_PAGE }, ownerFilter }: TokensWithBidsParams,
  queryOptions?: UseInfiniteQueryOptions<NFTWithBids[], any, NFTWithBids[]>
) => {
  return useInfiniteQuery<NFTWithBids[]>(
    tokenKeys.tokensWithBids(filter, ownerFilter),
    ({ pageParam = { first: pagination.first } }) => getTokensWithBids({ filter, pagination: pageParam, ownerFilter }),
    {
      getNextPageParam: (lastPage) =>
        getNextTokensWithBidsPageParam(lastPage, pagination.first || TOKENS_WITH_BIDS_PER_PAGE),
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      ...queryOptions,
    }
  );
};

export const useTokenOwners = (
  { collection, tokenId, ownerFilter }: GetTokenOwnersParams,
  queryOptions?: UseQueryOptions<TokenOwner[], any, TokenOwner[]>
) => {
  return useQuery<TokenOwner[]>(
    tokenKeys.tokenOwners(collection, tokenId, ownerFilter),
    () => getTokenOwners({ collection, tokenId, ownerFilter }),
    queryOptions
  );
};

interface UseInfiniteUserTokensProps extends UseInfiniteTokensProps {
  address: string;
}

export const useInfiniteUserTokens = (
  { address, filter, sort = TokensSort.LAST_RECEIVED, ownerFilter }: UseInfiniteUserTokensProps,
  queryOptions?: UseInfiniteQueryOptions<NFTCard[], any, NFTCard[]>
) => {
  return useInfiniteQuery<NFTCard[]>(
    tokenKeys.userTokens(address, filter, sort, ownerFilter),
    ({ pageParam = { first: TOKENS_PER_PAGE } }) =>
      getUserTokens({ address, filter, pagination: pageParam, sort, ownerFilter }),
    {
      getNextPageParam: (lastPage) => getNextTokensPageParam(lastPage),
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      ...queryOptions,
    }
  );
};
