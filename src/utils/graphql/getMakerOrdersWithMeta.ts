import { gql } from "graphql-request";
import { OrderFilter, Pagination, Collection, NFT, OrderSort, TokenOwnerFilter, TokenOwner } from "types/graphql";
import { MakerOrderWithSignatureAndHash } from "types/orders";
import { graphql } from "./graphql";

export type MakerOrderTokenMeta = {
  tokenId: NFT["tokenId"];
  image: NFT["image"];
  name: NFT["name"];
  owners: TokenOwner[];
};

export interface MakerOrderCollectionMeta {
  address: Collection["address"];
  name: Collection["name"];
  logo: Collection["logo"];
  type: Collection["type"];
  totalSupply: Collection["totalSupply"];
  isVerified?: Collection["isVerified"];
  floorOrder?: Collection["floorOrder"];
}

export interface CollectionMakerOrderWithMeta extends Omit<MakerOrderWithSignatureAndHash, "collection" | "tokenId"> {
  collection: MakerOrderCollectionMeta;
}

export interface StandardMakerOrderWithMeta extends CollectionMakerOrderWithMeta {
  token: MakerOrderTokenMeta;
}

interface Res extends CollectionMakerOrderWithMeta {
  token?: MakerOrderTokenMeta; // optional as will be null for CollectionOrder responses
}

export interface MakerOrdersWithMetaParams {
  filter?: OrderFilter;
  pagination?: Pagination;
  sort?: OrderSort;
  ownerFilter?: TokenOwnerFilter;
}

/**
 * Retrieve a list of StandardMakerOrderWithMeta or CollectionMakerOrderWithMeta
 * @param filter OrderFilter
 * @param pagination Pagination
 * @returns StandardMakerOrderWithMeta | CollectionMakerOrderWithMeta)[]
 */
export const getMakerOrdersWithMeta = async ({
  filter,
  pagination,
  sort,
  ownerFilter,
}: MakerOrdersWithMetaParams): Promise<(StandardMakerOrderWithMeta | CollectionMakerOrderWithMeta)[]> => {
  const query = gql`
    query GetMakerOrdersWithMeta(
      $filter: OrderFilterInput
      $pagination: PaginationInput
      $sort: OrderSortInput
      $ownerFilter: TokenOwnerInput
    ) {
      orders(filter: $filter, pagination: $pagination, sort: $sort) {
        collection {
          address
          name
          logo {
            src
            contentType
          }
          type
          isVerified
          totalSupply
          floorOrder {
            price
          }
        }
        token {
          tokenId
          image {
            src
            contentType
          }
          name
          owners(filter: $ownerFilter) {
            address
            balance
          }
        }
        isOrderAsk
        amount
        price
        strategy
        currency
        nonce
        startTime
        endTime
        minPercentageToAsk
        params
        signer
        signature
        hash
      }
    }
  `;

  const res: { orders: Res[] } = await graphql(query, {
    filter,
    pagination,
    sort,
    ownerFilter,
  });

  return res.orders;
};
