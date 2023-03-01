import { BigNumberish } from "ethers";
import { gql } from "graphql-request";
import { COLLECTION_LEADERBOARD_TO_FETCH } from "config/constants";
import { TokenStandard } from "types/config";
import {
  Attribute,
  Collection,
  CollectionBase,
  CollectionFilterItem,
  CollectionFloor,
  CollectionInternalSort,
  CollectionsSort,
  ImageData,
  Pagination,
  Royalty,
} from "types/graphql";
import { getAuthCookie } from "utils/cookies";
import {
  AttributeFragment,
  attributeFragment,
  collectionBaseFragment,
  CollectionBaseFragment,
  collectionFilterItemFragment,
  collectionFragment,
  CollectionFragment,
} from "./fragments";
import { graphql } from "./graphql";

interface GetCollectionResponse {
  collection: CollectionFragment;
}

export const getCollection = async (address: string, requestHeaders?: HeadersInit): Promise<Collection> => {
  const query = gql`
    query GetCollection($address: Address!) {
      collection(address: $address) {
        ...CollectionFragment
      }
    }
    ${collectionFragment}
  `;

  const res: GetCollectionResponse = await graphql(query, { address }, requestHeaders);
  if (!res.collection) {
    throw new Error(`Collection ${address} doesn't exist`);
  }
  return res.collection;
};

export interface CollectionWarningMeta {
  logo?: Collection["logo"];
  countOwners?: Collection["countOwners"];
  totalSupply?: Collection["totalSupply"];
}

export const getCollectionWarningMeta = async (
  address: string,
  requestHeaders?: HeadersInit
): Promise<CollectionWarningMeta> => {
  const query = gql`
    query GetUnverifiedCollectionWarningMeta($address: Address!) {
      collection(address: $address) {
        logo {
          src
          contentType
        }
        countOwners
        totalSupply
      }
    }
  `;

  const res: {
    collection: CollectionWarningMeta;
  } = await graphql(query, { address }, requestHeaders);
  if (!res.collection) {
    throw new Error(`Collection ${address} doesn't exist`);
  }
  return res.collection;
};

interface GetCollectionAttributesResponse {
  collection: {
    attributes: AttributeFragment[];
  };
}

export const getCollectionAttributes = async (address: string, requestHeaders?: HeadersInit): Promise<Attribute[]> => {
  const query = gql`
    query GetCollectionAttributes($address: Address!) {
      collection(address: $address) {
        attributes {
          ...AttributeFragment
        }
      }
    }
    ${attributeFragment}
  `;

  const res: GetCollectionAttributesResponse = await graphql(query, { address }, requestHeaders);
  return res.collection.attributes;
};

export interface CollectionFilterInput {
  address?: string;
  owner?: string;
  name?: string;
  type?: TokenStandard;
  isVerified?: boolean;
  isEligibleLR?: boolean;
  isWithRoyalty?: boolean;
}

export interface CollectionsParams {
  filter?: CollectionFilterInput;
  pagination?: Pagination;
  sort?: CollectionsSort;
}

interface GetCollectionsBaseResponse {
  collections: CollectionBaseFragment[];
}

export const getCollectionsBase = async (
  params?: CollectionsParams,
  requestHeaders?: HeadersInit
): Promise<CollectionBase[]> => {
  const query = gql`
    query GetCollectionsBase($filter: CollectionFilterInput, $pagination: PaginationInput, $sort: CollectionSortInput) {
      collections(filter: $filter, pagination: $pagination, sort: $sort) {
        ...CollectionBaseFragment
      }
    }
    ${collectionBaseFragment}
  `;

  const res: GetCollectionsBaseResponse = await graphql(query, params, requestHeaders);
  return res.collections;
};

interface GetCollectionsResponse {
  collections: CollectionFragment[];
}

export const getCollections = async (params?: CollectionsParams): Promise<Collection[]> => {
  const query = gql`
    query GetCollections($filter: CollectionFilterInput, $pagination: PaginationInput, $sort: CollectionSortInput) {
      collections(filter: $filter, pagination: $pagination, sort: $sort) {
        ...CollectionFragment
      }
    }
    ${collectionFragment}
  `;

  const res: GetCollectionsResponse = await graphql(query, params);
  return res.collections;
};

export const getCollectionsFilters = async (
  {
    pagination,
    sort,
    filter,
  }: {
    filter?: CollectionFilterInput;
    pagination?: Pagination;
    sort?: CollectionsSort;
  },
  requestHeaders?: HeadersInit
): Promise<CollectionFilterItem[]> => {
  const query = gql`
    query GetCollectionsFilters(
      $filter: CollectionFilterInput
      $pagination: PaginationInput
      $sort: CollectionSortInput
    ) {
      collections(filter: $filter, pagination: $pagination, sort: $sort) {
        ...CollectionFilterItemFragment
      }
    }
    ${collectionFilterItemFragment}
  `;

  const res: { collections: CollectionFilterItem[] } = await graphql(
    query,
    { pagination, sort, filter },
    requestHeaders
  );
  return res.collections;
};

export interface CollectionUpdateInput {
  address: string;
  name?: string | null;
  description?: string | null;
  websiteLink?: string | null;
  telegramLink?: string | null;
  mediumLink?: string | null;
  discordLink?: string | null;
  isExplicit?: boolean;
}

export const updateCollection = async (account: string, data: CollectionUpdateInput) => {
  const query = gql`
    mutation UpdateCollectionMutation($data: CollectionUpdateInput!) {
      updateCollection(data: $data) {
        ...CollectionFragment
      }
    }
    ${collectionFragment}
  `;

  const authCookie = getAuthCookie(account);
  const requestHeaders = {
    Authorization: `Bearer ${authCookie}`,
  };

  const res: { updateCollection: Collection } = await graphql(query, { data }, requestHeaders);
  return res.updateCollection;
};

export const getCollectionRoyalties = async (address: string, pagination?: Pagination): Promise<Royalty[]> => {
  const query = gql`
    query GetCollectionRoyalties($address: Address!, $pagination: PaginationInput) {
      collection(address: $address) {
        royalties(pagination: $pagination) {
          id
          currency
          amount
          to
          hash
          createdAt
          token {
            id
            tokenId
            image {
              src
              contentType
            }
            name
          }
        }
      }
    }
  `;

  const res: { collection: { royalties: Royalty[] } } = await graphql(query, { address, pagination });
  return res.collection.royalties;
};

export interface ImportOsCollectionImagesResponse {
  success: boolean;
  message: string;
}

export const importOsCollectionImages = async (collection: string, account: string) => {
  const query = gql`
    mutation ImportCollectionImagesMutation($collection: Address!) {
      importCollectionImages(collection: $collection) {
        success
        message
      }
    }
  `;

  const authCookie = getAuthCookie(account);
  const requestHeaders = {
    Authorization: `Bearer ${authCookie}`,
  };
  const res: ImportOsCollectionImagesResponse = await graphql(query, { collection }, requestHeaders);
  return res;
};

export interface CollectionLeaderboard {
  name: string;
  address: string;
  points: number;
  logo: ImageData;
  isVerified: boolean;
  volume: {
    volume24hOS: BigNumberish;
    volume24h: BigNumberish;
  };
  floor: CollectionFloor;
}

export const getCollectionLeaderboard = async (requestHeaders?: HeadersInit): Promise<CollectionLeaderboard[]> => {
  const query = gql`
    query CollectionLeaderboard(
      $sort: CollectionSortInput
      $pagination: PaginationInput
      $filter: CollectionFilterInput
    ) {
      collections(sort: $sort, pagination: $pagination, filter: $filter) {
        name
        address
        points
        logo {
          src
          contentType
        }
        isVerified
        volume {
          volume24hOS
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

  const res: { collections: CollectionLeaderboard[] } = await graphql(
    query,
    {
      sort: CollectionInternalSort.LISTING_REWARD,
      pagination: { first: COLLECTION_LEADERBOARD_TO_FETCH },
      filter: {
        isEligibleLR: true,
      },
    },
    requestHeaders
  );
  return res.collections;
};
