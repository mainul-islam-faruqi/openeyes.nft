import { useInfiniteQuery, UseInfiniteQueryOptions } from "react-query";
import last from "lodash/last";
import { baseQueryKeys, COLLECTION_ROYALTIES_TO_FETCH } from "config";
import { Royalty } from "types/graphql";
import { getCollectionRoyalties } from "utils/graphql";

export const royaltyKeys = {
  ...baseQueryKeys("royalty"),
  royalties: (collectionAddress: string) => [...royaltyKeys.infiniteQueries(), "payouts", collectionAddress],
};

export const useCollectionRoyalties = (
  collectionAddress: string,
  options?: UseInfiniteQueryOptions<Royalty[], any, Royalty[]>
) => {
  return useInfiniteQuery<Royalty[]>(
    royaltyKeys.royalties(collectionAddress),
    ({ pageParam = { first: COLLECTION_ROYALTIES_TO_FETCH } }) => getCollectionRoyalties(collectionAddress, pageParam),
    {
      getNextPageParam: (lastPage) => {
        if (lastPage.length < COLLECTION_ROYALTIES_TO_FETCH) {
          return undefined;
        }

        const lastRoyalty = last(lastPage);
        return { first: COLLECTION_ROYALTIES_TO_FETCH, cursor: lastRoyalty?.id };
      },
      refetchOnWindowFocus: false,
      ...options,
    }
  );
};
