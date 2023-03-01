import { gql } from "graphql-request";
import { BigNumber, BigNumberish } from "ethers";
import { CollectionFilterItem, User, Pagination, RelativeCollectionsSort, UserProfileDisplay } from "types/graphql";
import { getAuthCookie } from "utils/cookies";
import { COLLECTION_LEADERBOARD_TO_FETCH } from "config/constants";
import { graphql } from "./graphql";
import { collectionFilterItemFragment, UserFragment, userFragment } from "./fragments";
import { CollectionFilterInput } from "./collection";

interface UserResponse {
  user: UserFragment;
}

export const getUser = async (address: string): Promise<User> => {
  const query = gql`
    query GetUser($address: Address!) {
      user(address: $address) {
        ...UserFragment
      }
    }
    ${userFragment}
  `;

  const res: UserResponse = await graphql(query, { address });
  return res.user;
};

interface RelativeCollectionsResponse {
  user: {
    relativeCollections: CollectionFilterItem[];
  };
}

export interface GetUserRelativeCollectionsProps {
  address: string;
  filter?: CollectionFilterInput;
  pagination?: Pagination;
  sort?: RelativeCollectionsSort;
}

export const getUserRelativeCollections = async ({
  address,
  filter,
  pagination,
  sort,
}: GetUserRelativeCollectionsProps): Promise<CollectionFilterItem[]> => {
  const query = gql`
    query GetUserRelativeCollections(
      $address: Address!
      $filter: CollectionFilterInput
      $pagination: PaginationInput
      $sort: RelativeCollectionSortInput
    ) {
      user(address: $address) {
        relativeCollections(filter: $filter, pagination: $pagination, sort: $sort) {
          ...CollectionFilterItemFragment
        }
      }
    }
    ${collectionFilterItemFragment}
  `;

  const res: RelativeCollectionsResponse = await graphql(query, { address, filter, pagination, sort });
  return res.user.relativeCollections;
};

interface UserUpdateResponse {
  updateUser: UserFragment;
}

export type UserUpdateInput = {
  biography?: User["biography"] | null;
  name?: User["biography"] | null;
  websiteLink?: User["biography"] | null;
};

export const updateUser = async (address: string, userData: UserUpdateInput): Promise<User> => {
  const query = gql`
    mutation UpdateUserMutation($userData: UserUpdateInput!) {
      updateUser(data: $userData) {
        ...UserFragment
      }
    }
    ${userFragment}
  `;

  const authCookie = getAuthCookie(address);
  const requestHeaders = {
    Authorization: `Bearer ${authCookie}`,
  };

  const res: UserUpdateResponse = await graphql(query, { userData }, requestHeaders);
  return res.updateUser;
};

interface UpdateUserAvatarResponse {
  updateUserAvatar: UserFragment;
}

export interface UserAvatarUpdateInput {
  collection?: string | null;
  tokenId?: string | null;
}

export const updateUserAvatar = async (
  address: string,
  userAvatarUpdateInput: UserAvatarUpdateInput
): Promise<User> => {
  const query = gql`
    mutation UpdateUserAvatarMutation($data: UserAvatarUpdateInput!) {
      updateUserAvatar(data: $data) {
        ...UserFragment
      }
    }
    ${userFragment}
  `;

  const authCookie = getAuthCookie(address);
  const requestHeaders = {
    Authorization: `Bearer ${authCookie}`,
  };

  const res: UpdateUserAvatarResponse = await graphql(query, { data: userAvatarUpdateInput }, requestHeaders);
  return res.updateUserAvatar;
};

interface UsernameValidityResponse {
  usernameValid: boolean;
}

export const checkUsernameValidity = async (username: string): Promise<boolean> => {
  const query = gql`
    query CheckUsernameValidity($username: String!) {
      usernameValid(username: $username)
    }
  `;

  const res: UsernameValidityResponse = await graphql(query, { username });
  return res.usernameValid;
};

interface UserNonceResponse {
  user: { nonce: BigNumberish };
}

/**
 * Get the user nonce
 * @param account User address
 * @returns User nonce
 */
export const getUserNonce = async (address: string): Promise<BigNumber> => {
  const query = gql`
    query Query($address: Address!) {
      user(address: $address) {
        nonce
      }
    }
  `;

  const res: UserNonceResponse = await graphql(query, { address });
  return BigNumber.from(res.user.nonce || 0);
};

/**
 * Get user data to display an avatar
 * @param address User address
 */
export const getUserProfileDisplay = async (
  address: string
): Promise<Pick<UserProfileDisplay, "address" | "name" | "image" | "isVerified">> => {
  const query = gql`
    query GetUserProfileDisplay($address: Address!) {
      user(address: $address) {
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
    }
  `;

  const res = await graphql(query, { address });
  return {
    address: res.user.address,
    name: res.user.name,
    image: res.user.avatar?.image,
    isVerified: res.user.isVerified,
  };
};

export interface UserPoints {
  name: string;
  address: string;
  listingReward24h?: {
    points: number;
    totalPoints: number;
    updatedAt: string;
  };
}

export const getUserPoints = async (address: string): Promise<UserPoints> => {
  const query = gql`
    query GetUserPoints($address: Address!) {
      user(address: $address) {
        name
        address
        listingReward24h {
          points
          totalPoints
          updatedAt
        }
      }
    }
  `;

  const res = await graphql(query, { address });

  return {
    address: res.user.address,
    name: res.user.name,
    listingReward24h: res.user.listingReward24h && {
      points: parseInt(res.user.listingReward24h.points, 10),
      totalPoints: parseInt(res.user.listingReward24h.totalPoints, 10),
      updatedAt: res.user.listingReward24h.updatedAt,
    },
  };
};

export const getUserLeaderboardRelativeCollectionAddresses = async (address: string): Promise<string[]> => {
  const query = gql`
    query UserLeaderboardRelativeCollections(
      $address: Address!
      $filter: CollectionFilterInput
      $pagination: PaginationInput
    ) {
      user(address: $address) {
        relativeCollections(filter: $filter, pagination: $pagination) {
          address
        }
      }
    }
  `;

  const res: { user: { relativeCollections: { address: string }[] } } = await graphql(query, {
    address,
    filter: {
      isEligibleLR: true,
    },
    pagination: {
      first: COLLECTION_LEADERBOARD_TO_FETCH,
    },
  });

  if (!res.user || !res.user.relativeCollections) {
    return [];
  }

  return res.user.relativeCollections.map((relativeCollection) => relativeCollection.address);
};
