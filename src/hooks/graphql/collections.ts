import last from "lodash/last";
import { useInfiniteQuery, UseInfiniteQueryOptions, useQuery, UseQueryOptions } from "react-query";
import { baseQueryKeys } from "config/reactQueries";
import { Collection, CollectionBase, CollectionFilterItem, CollectionsSort, Pagination } from "types/graphql";
import {
  getCollectionsBase,
  CollectionsParams,
  getCollections,
  getCollectionsFilters,
  CollectionFilterInput,
  CollectionLeaderboard,
  getCollectionLeaderboard,
} from "utils/graphql/collection";
import { collectionKeys } from "./collection";

export const COLLECTIONS_PAGINATION_FIRST = 20;

export const collectionsKeys = {
  ...baseQueryKeys("collections"),
  infiniteCollections: (
    filter?: CollectionsParams["filter"],
    sort?: CollectionsParams["sort"],
    collectionType?: "base" | undefined
  ) => [...collectionsKeys.infiniteQueries(), collectionType, filter, sort],
  collectionsBase: (params?: CollectionsParams) => [...collectionsKeys.list(), "base", params],
  collectionsFilters: ({
    pagination,
    filter,
    sort,
  }: {
    filter?: CollectionFilterInput;
    pagination?: Pagination;
    sort?: CollectionsSort;
  }) => [...collectionsKeys.infiniteQueries(), "filters", pagination, filter, sort],
  collectionLeadboard: () => [...collectionKeys.list(), "leaderboard"],
};

const getNextPageParam = (lastPage: CollectionBase[] | Collection[]): Pagination | undefined => {
  if (lastPage.length < COLLECTIONS_PAGINATION_FIRST) {
    // No more data to fetch
    return undefined;
  }
  const lastCollection = last(lastPage);
  const cursor = lastCollection?.address;
  return { first: COLLECTIONS_PAGINATION_FIRST, cursor };
};

export const useInfiniteCollections = (
  filter?: CollectionsParams["filter"],
  sort?: CollectionsParams["sort"],
  queryOptions?: UseInfiniteQueryOptions<Collection[], any, Collection[]>
) => {
  return useInfiniteQuery<Collection[]>(
    collectionsKeys.infiniteCollections(filter, sort),
    ({ pageParam }) => getCollections({ pagination: pageParam, filter, sort }),
    {
      getNextPageParam,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      ...queryOptions,
    }
  );
};

export const useInfiniteCollectionsBase = (
  filter?: CollectionsParams["filter"],
  sort?: CollectionsParams["sort"],
  queryOptions?: UseInfiniteQueryOptions<CollectionBase[], any, CollectionBase[]>
) => {
  return useInfiniteQuery<CollectionBase[]>(
    collectionsKeys.infiniteCollections(filter, sort, "base"),
    ({ pageParam }) => getCollectionsBase({ pagination: pageParam, filter, sort }),
    {
      getNextPageParam,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      ...queryOptions,
    }
  );
};

export const useCollectionsBase = (
  params: CollectionsParams,
  queryOptions?: UseQueryOptions<CollectionBase[], any, CollectionBase[]>
) => {
  return useQuery<CollectionBase[]>(
    collectionsKeys.collectionsBase(params),
    () => getCollectionsBase(params),
    queryOptions
  );
};

export const useInfiniteCollectionsFilters = (
  {
    pagination,
    sort,
    filter,
  }: {
    filter?: CollectionFilterInput;
    pagination?: Pagination;
    sort?: CollectionsSort;
  },
  queryOptions?: UseInfiniteQueryOptions<CollectionFilterItem[], any, CollectionFilterItem[]>
) => {
  return useInfiniteQuery<CollectionFilterItem[]>(
    collectionsKeys.collectionsFilters({ pagination, sort, filter }),
    ({ pageParam }) => getCollectionsFilters({ pagination: pageParam, filter, sort }),
    {
      getNextPageParam: (lastPage: CollectionFilterItem[]): Pagination | undefined => {
        if (lastPage.length < COLLECTIONS_PAGINATION_FIRST) {
          return undefined;
        }
        const lastCollection = last(lastPage);
        const cursor = lastCollection?.address;
        return { first: COLLECTIONS_PAGINATION_FIRST, cursor };
      },
      ...queryOptions,
    }
  );
};

export const useCollectionLeaderboard = (
  options?: UseQueryOptions<CollectionLeaderboard[], any, CollectionLeaderboard[]>
) => {
  return useQuery<CollectionLeaderboard[]>(collectionsKeys.collectionLeadboard(), () => getCollectionLeaderboard(), {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    ...options,
  });
};
