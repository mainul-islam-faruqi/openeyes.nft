import { useMutation, UseMutationOptions, useQuery, useQueryClient, UseQueryOptions } from "react-query";
import { baseQueryKeys } from "config/reactQueries";
import { Attribute, Collection } from "types/graphql";
import {
  CollectionUpdateInput,
  CollectionWarningMeta,
  getCollection,
  getCollectionAttributes,
  getCollectionWarningMeta,
  updateCollection,
} from "utils/graphql/collection";

export const collectionKeys = {
  ...baseQueryKeys("collection"),
  collection: (address: string) => [...collectionKeys.single(), address],
  collectionWarningMeta: (address: string) => [...collectionKeys.single(), "warning-meta", address],
  attributes: (address: string) => [...collectionKeys.list(), "attributes", address],
};

export const useCollection = (address: string, options?: UseQueryOptions<Collection, any, Collection>) => {
  return useQuery<Collection>(collectionKeys.collection(address), () => getCollection(address), { ...options });
};

export const useCollectionAttributes = (
  address: string,
  queryOptions?: UseQueryOptions<Attribute[], any, Attribute[]>
) => {
  return useQuery<Attribute[]>(collectionKeys.attributes(address), () => getCollectionAttributes(address), {
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    ...queryOptions,
  });
};

interface UpdateCollectionParams {
  account: string;
  data: CollectionUpdateInput;
}

export const useUpdateCollection = (options?: UseMutationOptions<Collection, any, UpdateCollectionParams>) => {
  const client = useQueryClient();

  return useMutation<Collection, any, UpdateCollectionParams>(({ account, data }) => updateCollection(account, data), {
    onSettled: (collection) => {
      if (collection) {
        client.invalidateQueries(collectionKeys.collection(collection.address));
      }
    },
    ...options,
  });
};

export const useCollectionWarningMeta = (
  address: string,
  options?: UseQueryOptions<CollectionWarningMeta, any, CollectionWarningMeta>
) => {
  return useQuery<CollectionWarningMeta>(
    collectionKeys.collectionWarningMeta(address),
    () => getCollectionWarningMeta(address),
    { ...options }
  );
};
