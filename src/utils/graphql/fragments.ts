import { BigNumberish } from "ethers";
import { gql } from "graphql-request";
import {
  User,
  Event,
  EventOrder,
  Attribute,
  Collection,
  CollectionBase,
  CollectionOwner,
  CollectionFilterItem,
  NFTCard,
} from "types/graphql";

export type AttributeFragment = Attribute;

export const attributeFragment = gql`
  fragment AttributeFragment on Attribute {
    traitType
    value
    displayType
    count
    floorOrder {
      price
    }
  }
`;

export type UserFragment = User; // Currently the two are equal, this may change

export const userFragment = gql`
  fragment UserFragment on User {
    address
    name
    biography
    countCollections
    websiteLink
    instagramLink
    twitterLink
    isVerified
    avatar {
      id
      tokenId
      name
      description
      image {
        src
        contentType
      }
      collection {
        address
      }
    }
    listingReward24h {
      totalPoints
      points
      updatedAt
    }
  }
`;

export type CollectionOwnerFragment = CollectionOwner;

export const collectionOwnerFragment = gql`
  fragment CollectionOwnerFragment on User {
    address
    name
    isVerified
    avatar {
      id
      tokenId
      image {
        src
        contentType
      }
    }
  }
`;

export type CollectionFilterItemFragment = CollectionFilterItem;

export const collectionFilterItemFragment = gql`
  fragment CollectionFilterItemFragment on Collection {
    name
    address
    totalSupply
    owned
    isVerified
    points
    volume {
      volume24h
    }
    logo {
      src
      contentType
    }
    floorOrder {
      price
    }
  }
`;

export type CollectionBaseFragment = CollectionBase;

export const collectionBaseFragment = gql`
  fragment CollectionBaseFragment on Collection {
    name
    address
    type
    logo {
      src
      contentType
    }
    isVerified
    isExplicit
    countOwners
    totalSupply
    points
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
    volume {
      volume24h
      change24h
      volumeAll
    }
  }
`;

export type CollectionFragment = Collection;

export const collectionFragment = gql`
  fragment CollectionFragment on Collection {
    name
    address
    type
    description
    logo {
      src
      contentType
    }
    banner {
      src
      contentType
    }
    totalSupply
    isVerified
    isExplicit
    websiteLink
    facebookLink
    twitterLink
    telegramLink
    instagramLink
    mediumLink
    discordLink
    countOwners
    points
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
    volume {
      volume24h
      change24h
      volumeAll
    }
  }
  ${collectionOwnerFragment}
`;

export interface OrderFragment {
  isOrderAsk: boolean;
  signer: string;
  collection: {
    address: string;
  };
  price: BigNumberish;
  amount: BigNumberish;
  strategy: string;
  currency: string;
  nonce: BigNumberish;
  startTime: BigNumberish;
  endTime: BigNumberish;
  minPercentageToAsk: BigNumberish;
  signature: string | null; // signature only returned for VALID orders
  params: any[];
  hash: string;
  token?: {
    tokenId: string;
  };
}

// @TODO there is probably some room for improvement here because we won't use all the data
export const orderFragment = gql`
  fragment OrderFragment on Order {
    isOrderAsk
    signer
    collection {
      address
    }
    price
    amount
    strategy
    currency
    nonce
    startTime
    endTime
    minPercentageToAsk
    params
    signature
    token {
      tokenId
    }
    hash
  }
`;

export interface EventFragment extends Event {
  order: EventOrder;
}

export const eventFragment = gql`
  fragment EventFragment on Event {
    id
    type
    hash
    createdAt
    to {
      ...UserEventFragment
    }
    from {
      ...UserEventFragment
    }
    token {
      tokenId
      image {
        src
        contentType
      }
      name
    }
    collection {
      address
      name
      description
      totalSupply
      logo {
        src
        contentType
      }
      floorOrder {
        price
      }
    }
    order {
      isOrderAsk
      price
      endTime
      currency
      strategy
      status
      params
    }
  }
  fragment UserEventFragment on User {
    address
    name
    isVerified
    avatar {
      image {
        src
        contentType
      }
    }
  }
`;

export interface TokensFragment {
  id: NFTCard["id"];
  tokenId: NFTCard["id"];
  image: NFTCard["image"];
  name: NFTCard["name"];
  lastOrder?: NFTCard["lastOrder"];
  collection: NFTCard["collection"];
}

export const tokensFragment = gql`
  fragment TokensFragment on Token {
    id
    tokenId
    image {
      src
      contentType
    }
    name
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
      floorOrder {
        price
      }
      volume {
        volume24h
      }
      floor {
        floorPriceOS
        floorPrice
        floorChange24h
        floorChange7d
        floorChange30d
      }
    }
  }
`;
