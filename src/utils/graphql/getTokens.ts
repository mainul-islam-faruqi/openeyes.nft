import { gql } from "graphql-request";
import {
  NFTCard,
  TokenOwner,
  Pagination,
  TokenFilter,
  TokensSort,
  TokenOwnerFilter,
  OrderStatus,
  ImageData,
  CollectionFloor,
} from "types/graphql";
import { OrderFragment, orderFragment, tokensFragment } from "./fragments";
import { graphql } from "./graphql";
import { BigNumberish } from "ethers";
import { TokenStandard } from "types/config";
import { formatGqlOrder } from "utils/format";
import { getUnixTime } from "date-fns";

type GetTokensResponse = {
  tokens?: {
    id: string;
    tokenId: string;
    image: ImageData;
    name: string;
    lastOrder?: {
      price: BigNumberish;
      currency: string;
    };
    owners: TokenOwner[];
    collection: {
      name: string;
      address: string;
      type: TokenStandard;
      isVerified: boolean;
      totalSupply: number;
      floorOrder?: {
        price: BigNumberish;
      };
      floor: CollectionFloor;
      volume: {
        volumeAll: BigNumberish;
        volume24h: BigNumberish;
        change24h: number;
      };
      points: number | null;
    };
    ask: OrderFragment;
    bids: OrderFragment[];
  }[];
};

interface TokensQueryArgs {
  filter?: TokenFilter;
  pagination?: Pagination;
  sort?: TokensSort;
  ownerFilter?: TokenOwnerFilter;
  requestHeaders?: HeadersInit;
}

export const getTokens = async ({
  filter,
  pagination,
  sort,
  ownerFilter,
  requestHeaders,
}: TokensQueryArgs): Promise<NFTCard[]> => {
  const query = gql`
    query GetTokens(
      $filter: TokenFilterInput
      $pagination: PaginationInput
      $sort: TokenSortInput
      $ownerFilter: TokenOwnerInput
      $bidsFilter: OrderFilterInput
    ) {
      tokens(filter: $filter, pagination: $pagination, sort: $sort) {
        ...TokensFragment
        owners(filter: $ownerFilter) {
          address
          balance
        }
        ask {
          ...OrderFragment
        }
        bids(filter: $bidsFilter, sort: PRICE_DESC, pagination: { first: 1 }) {
          ...OrderFragment
        }
      }
    }
    ${tokensFragment}
    ${orderFragment}
  `;

  const now = getUnixTime(new Date());
  const res: GetTokensResponse = await graphql(
    query,
    {
      filter,
      pagination,
      sort,
      ownerFilter,
      bidsFilter: {
        status: OrderStatus.VALID,
        startTime: now,
        endTime: now,
      },
    },
    requestHeaders
  );
  if (!res.tokens) {
    return [];
  }

  return res.tokens.map((token) => ({
    ...token,
    ask: token.ask && formatGqlOrder(token.ask),
    bids: token.bids.map(formatGqlOrder),
  }));
};

type GetUserTokensResponse = {
  user?: GetTokensResponse;
};

interface UserTokensQueryArgs extends TokensQueryArgs {
  address: string;
}

export const getUserTokens = async ({
  address,
  filter,
  pagination,
  sort,
  ownerFilter,
  requestHeaders,
}: UserTokensQueryArgs): Promise<NFTCard[]> => {
  const query = gql`
    query GetUserTokens(
      $address: Address!
      $filter: TokenFilterInput
      $pagination: PaginationInput
      $sort: TokenSortInput
      $ownerFilter: TokenOwnerInput
      $bidsFilter: OrderFilterInput
    ) {
      user(address: $address) {
        tokens(filter: $filter, pagination: $pagination, sort: $sort) {
          ...TokensFragment
          owners(filter: $ownerFilter) {
            address
            balance
          }
          ask {
            ...OrderFragment
          }
          bids(filter: $bidsFilter, sort: PRICE_DESC, pagination: { first: 1 }) {
            ...OrderFragment
          }
        }
      }
    }
    ${tokensFragment}
    ${orderFragment}
  `;

  const now = getUnixTime(new Date());
  const res: GetUserTokensResponse = await graphql(
    query,
    {
      address,
      filter,
      pagination,
      sort,
      ownerFilter,
      bidsFilter: {
        status: OrderStatus.VALID,
        startTime: now,
        endTime: now,
      },
    },
    requestHeaders
  );
  if (!res?.user?.tokens) {
    return [];
  }

  return res.user.tokens.map((token) => ({
    ...token,
    ask: token.ask && formatGqlOrder(token.ask),
    bids: token.bids.map(formatGqlOrder),
  }));
};
