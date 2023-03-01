import { gql } from "graphql-request";
import { OrderFilter, OrderSort, Pagination } from "types/graphql";
import { MakerOrderWithSignatureAndHash } from "types/orders";
import { graphql } from "./graphql";

interface OrderNonceWithHash {
  nonce: MakerOrderWithSignatureAndHash["nonce"];
  hash: MakerOrderWithSignatureAndHash["hash"];
}

/**
 * Lightweight request to get order nonces. Used to construct multi-order cancellation calls. Hash is also returned for pagination if necessary.
 */
const getOrderNonces = async ({
  filter,
  sort,
  pagination,
}: {
  filter?: OrderFilter;
  sort?: OrderSort;
  pagination?: Pagination;
}): Promise<OrderNonceWithHash[]> => {
  const query = gql`
    query GetOrderNonces($filter: OrderFilterInput, $pagination: PaginationInput, $sort: OrderSortInput) {
      orders(filter: $filter, pagination: $pagination, sort: $sort) {
        nonce
        hash
      }
    }
  `;

  try {
    const res: {
      orders: OrderNonceWithHash[];
    } = await graphql(query, {
      filter,
      sort,
      pagination,
    });
    return res.orders;
  } catch (e) {
    console.error(e);
    return [];
  }
};

export default getOrderNonces;
