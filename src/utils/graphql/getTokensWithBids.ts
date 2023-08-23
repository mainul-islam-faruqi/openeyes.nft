import { gql } from "graphql-request";
import { TokenOwner, Pagination, TokenFilter, TokenOwnerFilter, ImageData } from "types/graphql";
import { graphql } from "./graphql";
import { BigNumberish } from "ethers";
import { TokenStandard } from "types/config";

export interface NFTWithBids {
  id: string;
  tokenId: string;
  image: ImageData;
  name: string;
  createdAt: string;
  owners: TokenOwner[];
  collection: {
    name: string;
    address: string;
    totalSupply: number;
    type: TokenStandard;
    isVerified: boolean;
    floorOrder?: {
      price: BigNumberish;
    };
  };
  bids: {
    price: BigNumberish;
  }[];
}

interface Response {
  tokens?: NFTWithBids[];
}

export interface TokensWithBidsParams {
  filter: TokenFilter;
  pagination?: Pagination;
  ownerFilter?: TokenOwnerFilter;
}

export const getTokensWithBids = async ({
  filter,
  pagination,
  ownerFilter,
}: TokensWithBidsParams): Promise<NFTWithBids[]> => {
  const query = gql`
    query GetTokensWithBids($filter: TokenFilterInput, $pagination: PaginationInput, $ownerFilter: TokenOwnerInput) {
      tokens(filter: $filter, pagination: $pagination) {
        id
        tokenId
        image {
          src
          contentType
        }
        name
        createdAt
        owners(filter: $ownerFilter) {
          address
          balance
        }
        collection {
          name
          address
          totalSupply
          type
          isVerified
          floorOrder {
            price
          }
        }
        bids {
          price
        }
      }
    }
  `;

  const res: Response = await graphql(query, { filter, pagination, ownerFilter });

  if (!res.tokens) {
    throw new Error(`No tokens returned for query: GetTokensWithBids`);
  }

  return res.tokens;
};
