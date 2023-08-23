import {
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "react-query";
import { last } from "lodash";
import { useWeb3React } from "@web3-react/core";
import { CollectionFilterItem, NFTAvatar, Pagination, RelativeCollectionsSort, User } from "types/graphql";
import { baseQueryKeys } from "config/reactQueries";
import { USER_PROFILE_AVATAR_NFTS_PER_PAGE } from "config/constants"
import { CollectionFilterInput } from "utils/graphql/collection"
import {
  getUser,
  getUserLeaderboardRelativeCollectionAddresses,
  getUserPoints,
  getUserRelativeCollections,
  GetUserRelativeCollectionsProps,
  updateUser,
  updateUserAvatar,
  UserAvatarUpdateInput,
  UserPoints,
  UserUpdateInput,
} from "utils/graphql/user";
import getTokensForProfile from "utils/graphql/getTokensForProfile";
import { useUpdateUserProfileData } from "hooks/useUserProfileDisplay";
import { COLLECTIONS_PAGINATION_FIRST } from "./collections";

export const userKeys = {
  ...baseQueryKeys("user"),
  user: (address: string) => [...userKeys.single(), address],
  userProfileNfts: (owner: string) => [...userKeys.infiniteQueries(), "profile-nfts", owner],
  userRelativeCollections: ({
    address,
    pagination,
    filter,
    sort,
  }: {
    address: string;
    pagination?: Pagination;
    filter?: CollectionFilterInput;
    sort?: RelativeCollectionsSort;
  }) => [...userKeys.infiniteQueries(), "relative-collections", address, filter, pagination, sort],
  userPoints: (address: string) => ["user-points", address],
  userLeaderboardCollections: (address: string) => ["user-collections-leaderboard", address],
};

export const useUser = (address: string, queryOptions?: UseQueryOptions<User, any, User>) => {
  const updateProfileDisplayData = useUpdateUserProfileData();

  return useQuery<User>(
    userKeys.user(address),
    async () => {
      const user = await getUser(address);
      updateProfileDisplayData({
        address: user.address,
        name: user.name,
        image: user.avatar?.image,
        isVerified: !!user.isVerified,
      });
      return user;
    },
    {
      staleTime: Infinity, // User query cache being considered stale should be managed via query client invalidation triggers
      refetchOnWindowFocus: false,
      ...queryOptions,
    }
  );
};

export interface UpdateUserParams {
  address: string;
  data: UserUpdateInput;
}

export const useUpdateUser = (options?: UseMutationOptions<User, any, UpdateUserParams>) => {
  const client = useQueryClient();
  const { account } = useWeb3React();
  const updateProfileDisplayData = useUpdateUserProfileData();

  return useMutation<User, any, UpdateUserParams>(({ data }) => updateUser(account!, data), {
    // Optimistically update any "useUser" queries with fresh data
    onMutate: ({ address, data }) => {
      client.setQueryData<User>(userKeys.user(address), (oldUser) => {
        const newUser = {
          ...oldUser,
          ...data,
        } as User;

        // Update profile display cache
        updateProfileDisplayData({
          address: newUser.address,
          name: newUser.name,
          image: newUser.avatar?.image,
          isVerified: !!newUser.isVerified,
        });

        return newUser;
      });
    },
    ...options,
  });
};

export type UseUpdateUserAvatarOptions = UseMutationOptions<User, any, UserAvatarUpdateInput>;

export const useUpdateUserAvatar = (options?: UseUpdateUserAvatarOptions) => {
  const client = useQueryClient();
  const { account } = useWeb3React();

  return useMutation<User, any, UserAvatarUpdateInput>(
    (userAvatarUpdateInput) => updateUserAvatar(account!, userAvatarUpdateInput),
    {
      onSettled: (user) => {
        if (user) {
          client.invalidateQueries(userKeys.user(user.address));
          client.invalidateQueries(userKeys.userProfileNfts(user.address));
        }
      },
      ...options,
    }
  );
};

export const useUserProfileNfts = (
  owner: string,
  queryOptions?: UseInfiniteQueryOptions<NFTAvatar[], any, NFTAvatar[]>
) => {
  return useInfiniteQuery<NFTAvatar[]>(
    userKeys.userProfileNfts(owner),
    ({ pageParam = { first: USER_PROFILE_AVATAR_NFTS_PER_PAGE } }) => getTokensForProfile({ owner }, pageParam),
    {
      refetchOnWindowFocus: false,
      getNextPageParam: (lastPage) => {
        if (lastPage.length < USER_PROFILE_AVATAR_NFTS_PER_PAGE) {
          return undefined;
        }

        const lastNft = last(lastPage);
        return { first: USER_PROFILE_AVATAR_NFTS_PER_PAGE, cursor: lastNft?.id };
      },
      ...queryOptions,
    }
  );
};

export const useInfiniteUserRelativeCollections = (
  { pagination, sort, filter, address }: GetUserRelativeCollectionsProps,
  queryOptions?: UseInfiniteQueryOptions<CollectionFilterItem[], any, CollectionFilterItem[]>
) => {
  return useInfiniteQuery<CollectionFilterItem[]>(
    userKeys.userRelativeCollections({ address, pagination, sort, filter }),
    ({ pageParam }) => getUserRelativeCollections({ pagination: pageParam, address, filter, sort }),
    {
      getNextPageParam: (lastPage: CollectionFilterItem[]): Pagination | undefined => {
        if (lastPage.length < COLLECTIONS_PAGINATION_FIRST) {
          return undefined;
        }
        const lastCollection = last(lastPage);
        const cursor = lastCollection?.address;
        return { first: COLLECTIONS_PAGINATION_FIRST, cursor };
      },
      staleTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      ...queryOptions,
    }
  );
};

export const useUserPoints = (address: string, options?: UseQueryOptions<UserPoints, any, UserPoints>) => {
  return useQuery<UserPoints>(userKeys.userPoints(address), () => getUserPoints(address), {
    ...options,
  });
};

/**
 * Used to check if a user owns tokens relative to the leaderboard
 */
export const useUserRelativeCollections = (account: string, options?: UseQueryOptions<string[], any, string[]>) => {
  return useQuery<string[]>(
    userKeys.userLeaderboardCollections(account),
    async () => {
      const relativeCollections = await getUserLeaderboardRelativeCollectionAddresses(account);
      return relativeCollections;
    },
    {
      refetchOnWindowFocus: false,
      ...options,
    }
  );
};
