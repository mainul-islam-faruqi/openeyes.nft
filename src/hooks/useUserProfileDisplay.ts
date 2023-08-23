import { useCallback } from "react";
import { useQuery, useQueryClient, UseQueryOptions } from "react-query";
import { constants } from "ethers";
import uniq from "lodash/uniq";
// @ts-ignore
import namehash from "eth-ens-namehash";
import { Event, User, UserProfileDisplay } from "types/graphql";
import { getResolveRecordsContract } from "utils/contracts";
import { getUserProfileDisplay } from "utils/graphql/user";
import { isAddressEqual } from "utils/guards";
import { useActiveProvider } from "./useActiveProvider";
import { UserHitProps } from "components/Nav/SearchModal/SearchResults/UserHit";

export const userProfileDisplayKeys = {
  userProfileDisplay: (address: string) => ["user-profile-data", address],
  userEns: (address: string) => ["user-ens-data", address],
};

export const useUserProfileDisplay = (
  address: string,
  options?: UseQueryOptions<UserProfileDisplay, any, UserProfileDisplay>
) => {
  const library = useActiveProvider();

  return useQuery<UserProfileDisplay>(
    userProfileDisplayKeys.userProfileDisplay(address),
    async () => {
      if (isAddressEqual(address, constants.AddressZero)) {
        return {
          address,
          ensDomain: null,
          isVerified: false,
        };
      }

      const [user, ensDomain] = await Promise.all([getUserProfileDisplay(address), library.lookupAddress(address)]);
      return {
        ...user,
        ensDomain,
      };
    },
    {
      staleTime: Infinity,
      cacheTime: Infinity,
      refetchOnWindowFocus: false,
      ...options,
    }
  );
};

export const useUserEns = (address: string, options?: UseQueryOptions<string | null, any, string | null>) => {
  const library = useActiveProvider();

  return useQuery<string | null>(
    userProfileDisplayKeys.userEns(address),
    async () => {
      if (isAddressEqual(address, constants.AddressZero)) {
        return null;
      }
      const ensDomain = await library.lookupAddress(address);
      return ensDomain;
    },
    {
      staleTime: Infinity,
      cacheTime: Infinity,
      refetchOnWindowFocus: false,
      ...options,
    }
  );
};

export const useUpdateUserProfileData = () => {
  const queryClient = useQueryClient();
  return useCallback(
    (data: UserProfileDisplay) => {
      queryClient.setQueryData<UserProfileDisplay>(
        userProfileDisplayKeys.userProfileDisplay(data.address),
        (oldUserProfileData) => {
          return {
            ...oldUserProfileData,
            ...data,
          };
        }
      );
    },
    [queryClient]
  );
};

export const useSetUserProfiles = () => {
  const queryClient = useQueryClient();
  const library = useActiveProvider();
  const updateProfileData = useUpdateUserProfileData();

  return useCallback(
    async ({ users, addresses }: { users: Record<string, User>; addresses: string[] }) => {
      const reverseRecordsContract = getResolveRecordsContract(library);
      // Step 1: Filter addresses by checking for existing data and null address
      const uniqUnfetchedAddresses = uniq(addresses).filter((address) => {
        const queryData = queryClient.getQueryData<UserProfileDisplay>(
          userProfileDisplayKeys.userProfileDisplay(address)
        );
        return queryData === undefined && address !== constants.AddressZero;
      });

      // Step 2: Fetch the ENS domains we know have not been fetched yet
      const ensDomains = await reverseRecordsContract.getNames(uniqUnfetchedAddresses);

      // Step 3: Normalize the domain names and attach them to an address
      const normalizedEnsDomains = uniqUnfetchedAddresses.reduce<Record<string, string>>(
        (accum, uniqAddress, index) => ({
          ...accum,
          [uniqAddress]: namehash.normalize(ensDomains[index]) === ensDomains[index] ? ensDomains[index] : "", // prevents homograph attacks
        }),
        {}
      );

      // Step 5: Update query cache with new user data (UserProfileDisplay)
      Object.values(users).forEach((user) => {
        const userData: UserProfileDisplay = {
          address: user.address,
          name: user.name,
          image: user.avatar?.image,
          isVerified: !!user.isVerified,
        };

        // Only include the ENS Domain if it exists because we don't want to overwrite existing data
        if (normalizedEnsDomains[user.address]) {
          userData.ensDomain = normalizedEnsDomains[user.address];
        }

        updateProfileData(userData);
      });
    },
    [library, queryClient, updateProfileData]
  );
};

export const useSetUserProfilesFromEvents = () => {
  const setUserProfiles = useSetUserProfiles();

  return useCallback(
    async (events: Event[]) => {
      // Extract all the unique user data and addresses from the event set
      const { users, addresses } = events.reduce<{ users: Record<string, User>; addresses: string[] }>(
        (accum, event) => {
          const { from, to } = event;

          const addressAdditions = [from.address]; // Convenience variable containing all addresses
          const userAdditions: Record<string, User> = {};

          if (!accum.users[from.address]) {
            userAdditions[from.address] = from;
          }

          if (to && !accum.users[to.address]) {
            userAdditions[to.address] = to;
            addressAdditions.push(to.address);
          }

          return {
            addresses: [...accum.addresses, ...addressAdditions],
            users: {
              ...accum.users,
              ...userAdditions,
            },
          };
        },
        { users: {}, addresses: [] }
      );

      await setUserProfiles({ users, addresses });
    },
    [setUserProfiles]
  );
};

export const useSetUserProfilesFromSearchHits = () => {
  const setUserProfiles = useSetUserProfiles();

  return useCallback(
    async (userHits: UserHitProps[]) => {
      // Extract all the unique user data and addresses from the userHits
      const { users, addresses } = userHits.reduce<{ users: Record<string, User>; addresses: string[] }>(
        (accum, userHit) => {
          const { address } = userHit;
          accum.users[address] = userHit;
          accum.addresses.push(address);
          return accum;
        },
        { users: {}, addresses: [] }
      );

      await setUserProfiles({ users, addresses });
    },
    [setUserProfiles]
  );
};
