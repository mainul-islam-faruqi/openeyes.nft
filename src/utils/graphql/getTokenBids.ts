import { gql } from "graphql-request";
import { OrderFilter, OrderSort, Pagination } from "types/graphql";
import { MakerOrderWithSignatureAndHash } from "types/orders";
import { formatGqlOrder } from "utils/format";
import { OrderFragment, orderFragment } from "./fragments";
import { graphql } from "./graphql";

interface Response {
  token: {
    bids: OrderFragment[];
  };
}

/**
 * Retrieve a list of bids for a specific token
 * @param address Collection address
 * @param tokenId Token id
 * @param pagination Pagination
 * @param filter OrderFilter
 * @param sort OrderSort
 * @returns MakerOrderWithSignatureAndHash[]
 */
export const getTokenBids = async (
  address: string,
  tokenId: string,
  pagination?: Pagination,
  filter?: OrderFilter,
  sort?: OrderSort
): Promise<MakerOrderWithSignatureAndHash[]> => {
  const query = gql`
    query TokenBids(
      $collection: Address!
      $tokenId: String!
      $pagination: PaginationInput
      $filter: OrderFilterInput
      $sort: OrderSortInput
    ) {
      token(collection: $collection, tokenId: $tokenId) {
        bids(pagination: $pagination, filter: $filter, sort: $sort) {
          ...OrderFragment
        }
      }
    }
    ${orderFragment}
  `;

  const res: Response = await graphql(query, {
    collection: address,
    tokenId,
    pagination,
    filter,
    sort,
  });

  const bids = res.token.bids.map((bid) => formatGqlOrder(bid));
  return bids;
};
