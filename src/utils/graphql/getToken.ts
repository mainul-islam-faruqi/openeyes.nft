import { BigNumberish } from "ethers";
import { gql } from "graphql-request";
import { NFT, AnimationData, ImageData, TokenOwner, TokenOwnerFilter, CollectionFloor } from "types/graphql";
import { TokenStandard } from "types/config";
import {
  AttributeFragment,
  attributeFragment,
  CollectionOwnerFragment,
  collectionOwnerFragment,
  OrderFragment,
  orderFragment,
} from "./fragments";
import { formatGqlOrder } from "utils/format";
import { graphql } from "./graphql";

type Response = {
  token?: {
    id: string;
    tokenId: string;
    image: ImageData;
    name: string;
    countOwners: number;
    description?: string;
    animation?: AnimationData;
    lastOrder?: {
      price: BigNumberish;
      currency: string;
    };
    collection: {
      name: string;
      address: string;
      type: TokenStandard;
      owner: CollectionOwnerFragment;
      isVerified: boolean;
      totalSupply: number;
      description?: string;
      floorOrder?: {
        price: BigNumberish;
      };
      floor: CollectionFloor;
      points: number | null;
    };
    ask: OrderFragment;
    bids: OrderFragment[];
    attributes: AttributeFragment[];
  };
};

export interface GetTokenParams {
  collection: string;
  tokenId: string;
}

export const getToken = async ({ collection, tokenId }: GetTokenParams, requestHeaders?: HeadersInit): Promise<NFT> => {
  const query = gql`
    query GetToken($collection: Address!, $tokenId: String!) {
      token(collection: $collection, tokenId: $tokenId) {
        id
        tokenId
        image {
          src
          contentType
        }
        name
        countOwners
        description
        animation {
          src
          contentType
          original
        }
        lastOrder {
          price
          currency
        }
        collection {
          name
          address
          type
          isVerified
          points
          totalSupply
          description
          owner {
            ...CollectionOwnerFragment
          }
          floorOrder {
            price
          }
          floor {
            floorPriceOS
            floorPrice
            floorChange24h
            floorChange7d
            floorChange30d
          }
        }
        ask {
          ...OrderFragment
        }
        bids {
          ...OrderFragment
        }
        attributes {
          ...AttributeFragment
        }
      }
    }
    ${attributeFragment}
    ${orderFragment}
    ${collectionOwnerFragment}
  `;

  const res: Response = await graphql(query, { collection, tokenId }, requestHeaders);

  if (!res.token) {
    throw new Error(`Token id${tokenId} from collection ${collection} doesn't exist`);
  }

  const bids = res.token.bids.map((bid) => formatGqlOrder(bid));
  const ask = res.token.ask && formatGqlOrder(res.token.ask);
  //@ts-ignore
  return { ...res.token, bids, ask };
};

export interface TokenForTransfer {
  tokenId: NFT["tokenId"];
  image: NFT["image"];
  name: NFT["name"];
  collection: {
    address: NFT["collection"]["address"];
    name: NFT["collection"]["name"];
    isVerified: NFT["collection"]["isVerified"];
    type: NFT["collection"]["type"];
    floorOrder?: {
      price: BigNumberish;
    };
  };
  ask: {
    nonce: BigNumberish;
  };
}

export const getTokenForTransfer = async (
  address: string,
  tokenId: string,
  requestHeaders?: HeadersInit
): Promise<TokenForTransfer> => {
  const query = gql`
    query TokenForTransfer($collection: Address!, $tokenId: String!) {
      token(collection: $collection, tokenId: $tokenId) {
        collection {
          address
          name
          isVerified
          type
          floorOrder {
            price
          }
        }
        tokenId
        image {
          src
          contentType
        }
        name
        ask {
          nonce
        }
      }
    }
  `;

  const res = await graphql(query, { collection: address, tokenId }, requestHeaders);

  if (!res.token) {
    throw new Error(`Token id${tokenId} from collection ${address} doesn't exist`);
  }

  return res.token;
};

export interface GetTokenOwnersParams extends GetTokenParams {
  ownerFilter: TokenOwnerFilter | undefined;
}

export const getTokenOwners = async (
  { collection, tokenId, ownerFilter }: GetTokenOwnersParams,
  requestHeaders?: HeadersInit
): Promise<TokenOwner[]> => {
  const query = gql`
    query GetTokenOwners($collection: Address!, $tokenId: String!, $ownerFilter: TokenOwnerInput) {
      token(collection: $collection, tokenId: $tokenId) {
        owners(filter: $ownerFilter) {
          address
          balance
        }
      }
    }
  `;

  const res: {
    token: {
      owners: TokenOwner[];
    };
  } = await graphql(query, { collection, tokenId, ownerFilter }, requestHeaders);

  if (!res.token) {
    throw new Error(`Token id${tokenId} from collection ${collection} doesn't exist`);
  }

  return res.token.owners;
};
