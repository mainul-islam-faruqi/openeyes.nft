import { useInfiniteQuery, UseInfiniteQueryOptions, useQuery, UseQueryOptions } from "react-query";
import last from "lodash/last";
import { baseQueryKeys } from "config/reactQueries";
import { ORDERS_PER_PAGE } from "config/constants"
import { OrderFilter, OrderSort, OrderStatus, Pagination } from "types/graphql";
import { MakerOrderWithSignatureAndHash } from "types/orders";
import getOrders from "utils/graphql/getOrders";
import {
  getMakerOrdersWithMeta,
  CollectionMakerOrderWithMeta,
  StandardMakerOrderWithMeta,
  MakerOrdersWithMetaParams,
} from "utils/graphql/getMakerOrdersWithMeta";
import getOrderNonces from "utils/graphql/getOrderNonces";

export const ORDERS_WITH_META_KEY = "orders-with-meta";
export const STALE_KEY = "stale";

export const ordersKeys = {
  ...baseQueryKeys("orders"),
  orders: ({ filter, sort, pagination }: { filter?: OrderFilter; sort?: OrderSort; pagination?: Pagination }) => [
    ...ordersKeys.list(),
    filter,
    sort,
    pagination,
  ],
  ordersWithMeta: ({ filter, sort, ownerFilter }: MakerOrdersWithMetaParams) => [
    ...ordersKeys.infiniteQueries(),
    ORDERS_WITH_META_KEY,
    filter,
    sort,
    ownerFilter,
  ],
  staleOrders: ({ filter, sort }: { filter?: OrderFilter; sort?: OrderSort }) => [
    ...ordersKeys.list(),
    STALE_KEY,
    filter,
    sort,
  ],
};

type UseOrdersArgs = {
  filter?: OrderFilter;
  sort?: OrderSort;
  pagination?: Pagination;
};

export const useOrders = (
  { filter, sort, pagination = { first: ORDERS_PER_PAGE } }: UseOrdersArgs,
  queryOptions: UseQueryOptions<MakerOrderWithSignatureAndHash[], any, MakerOrderWithSignatureAndHash[]>
) => {
  return useQuery<MakerOrderWithSignatureAndHash[]>(
    ordersKeys.orders({ filter, sort, pagination }),
    () => getOrders({ filter, sort, pagination }),
    queryOptions
  );
};

export const useInfiniteMakerOrdersWithMeta = (
  { filter, sort, pagination = { first: ORDERS_PER_PAGE }, ownerFilter }: MakerOrdersWithMetaParams,
  queryOptions?: UseInfiniteQueryOptions<
    (StandardMakerOrderWithMeta | CollectionMakerOrderWithMeta)[],
    any,
    (StandardMakerOrderWithMeta | CollectionMakerOrderWithMeta)[]
  >
) => {
  return useInfiniteQuery<(StandardMakerOrderWithMeta | CollectionMakerOrderWithMeta)[]>(
    ordersKeys.ordersWithMeta({ filter, sort, pagination, ownerFilter }),
    ({ pageParam = pagination }) => getMakerOrdersWithMeta({ filter, pagination: pageParam, sort, ownerFilter }),
    {
      getNextPageParam: (
        lastPage: (StandardMakerOrderWithMeta | CollectionMakerOrderWithMeta)[]
      ): Pagination | undefined => {
        const paginationFirst = pagination?.first || ORDERS_PER_PAGE;
        if (lastPage.length < paginationFirst) {
          return undefined;
        }
        const lastOrder = last(lastPage);
        // @ts-ignore
        return { first: paginationFirst, cursor: lastOrder?.hash };
      },
      refetchOnWindowFocus: false,
      ...queryOptions,
    }
  );
};

export interface StaleOrderIssues {
  hasApprovalIssue: boolean;
  hasBalanceIssue: boolean;
  hasOwnerIssue: boolean;
  hasCollectionApprovalIssue: boolean;
}

/** Lightweight order request to validate if there are any orders with stale order statuses */
export const useStaleOrders = (
  {
    filter,
    sort,
  }: {
    filter?: OrderFilter;
    sort?: OrderSort;
  },
  queryOptions?: UseQueryOptions<StaleOrderIssues, any, StaleOrderIssues>
) => {
  return useQuery<StaleOrderIssues>(
    ordersKeys.staleOrders({ filter, sort }),
    () => {
      const fetcher = async (): Promise<StaleOrderIssues> => {
        const [approvalRevoked, insufficientWeth, invalidOwner, collectionApprovalRevoked] = await Promise.all([
          getOrderNonces({
            filter: { status: [OrderStatus.ERC20_APPROVAL], ...filter },
            sort,
            pagination: { first: 1 },
          }),
          getOrderNonces({
            filter: { status: [OrderStatus.ERC20_BALANCE], ...filter },
            sort,
            pagination: { first: 1 },
          }),
          getOrderNonces({
            filter: { status: [OrderStatus.INVALID_OWNER], ...filter },
            sort,
            pagination: { first: 1 },
          }),
          getOrderNonces({
            filter: { status: [OrderStatus.ERC_APPROVAL], ...filter },
            sort,
            pagination: { first: 1 },
          }),
        ]);

        return {
          hasApprovalIssue: approvalRevoked.length > 0,
          hasBalanceIssue: insufficientWeth.length > 0,
          hasOwnerIssue: invalidOwner.length > 0,
          hasCollectionApprovalIssue: collectionApprovalRevoked.length > 0,
        };
      };

      return fetcher();
    },
    queryOptions
  );
};
