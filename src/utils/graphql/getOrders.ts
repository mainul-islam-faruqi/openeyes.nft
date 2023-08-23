import { gql } from "graphql-request";
import { OrderFilter, OrderSort, OrderStatus, Pagination } from "types/graphql";
import { graphql } from "./graphql";
import { OrderFragment, orderFragment } from "./fragments";
import { MakerOrderWithSignatureAndHash } from "types/orders";
import { formatGqlOrder } from "utils/format";

interface Response {
  orders: OrderFragment[];
}

/**
 * Retrieve VALID orders
 * @param filter OrderFilter
 * @param sort OrderSort
 * @param pagination Pagination
 * @returns MakerOrderWithSignatureAndHash[]
 */
const getOrders = async (
  {
    filter,
    sort,
    pagination,
  }: {
    filter?: OrderFilter;
    sort?: OrderSort;
    pagination?: Pagination;
  },
  requestHeaders?: HeadersInit
): Promise<MakerOrderWithSignatureAndHash[]> => {
  const query = gql`
    query GetOrders($filter: OrderFilterInput, $pagination: PaginationInput, $sort: OrderSortInput) {
      orders(filter: $filter, pagination: $pagination, sort: $sort) {
        ...OrderFragment
      }
    }
    ${orderFragment}
  `;

  const res: Response = await graphql(
    query,
    { filter: { status: [OrderStatus.VALID], ...filter }, sort, pagination },
    requestHeaders
  );
  const orders = res.orders.map((order) => formatGqlOrder(order));
  return orders;
};

export default getOrders;
