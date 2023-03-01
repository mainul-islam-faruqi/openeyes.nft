import { gql } from "graphql-request";
import { OrderFilter, OrderSort, OrderStatus, Pagination } from "types/graphql";
import { graphql } from "./graphql";
import { OrderFragment, orderFragment } from "./fragments";
import { MakerOrderWithSignatureAndHash } from "types/orders";
import { formatGqlOrder } from "utils/format";

type Response = {
  token: {
    orders: OrderFragment[];
  };
};

type Props = {
  collection: string;
  tokenId: string;
  filter?: OrderFilter;
  pagination?: Pagination;
  sort?: OrderSort;
};

/**
 * Retrieve VALID orders for a specific token
 * @param collection string collection address
 * @param tokenId string
 * @param filter OrderFilter
 * @param pagination Pagination
 * @param sort OrderSort
 * @returns MakerOrderWithSignatureAndHash[]
 */
const getTokenOrders = async ({
  collection,
  tokenId,
  filter,
  pagination,
  sort,
}: Props): Promise<MakerOrderWithSignatureAndHash[]> => {
  const query = gql`
    query GetTokenOrders(
      $collection: Address!
      $tokenId: String!
      $filter: OrderFilterInput
      $pagination: PaginationInput
      $sort: OrderSortInput
    ) {
      token(collection: $collection, tokenId: $tokenId) {
        orders(filter: $filter, pagination: $pagination, sort: $sort) {
          ...OrderFragment
        }
      }
    }
    ${orderFragment}
  `;

  const res: Response = await graphql(query, {
    collection,
    tokenId,
    filter: { status: [OrderStatus.VALID], ...filter },
    pagination,
    sort,
  });
  const orders = res.token.orders.map((order) => formatGqlOrder(order));
  return orders;
};

export default getTokenOrders;
