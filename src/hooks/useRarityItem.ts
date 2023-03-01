import { useCallback } from "react";
import { QueryClient, useQuery, useQueryClient, UseQueryOptions } from "react-query";
import { NFTCard } from "types/graphql";
import { RarityItem } from "types/rarity";
import { getRarityScore, rarityFetchErrorMap } from "utils/api/rarity";

export const rarityItemKeys = {
  rarityItemKey: (address: string, tokenId: string) => ["rarity-item", address.toLowerCase(), tokenId],
};

export const useRarityItem = (
  collectionAddress: string,
  tokenId: string,
  options?: UseQueryOptions<RarityItem | null, any, RarityItem | null>
) => {
  return useQuery<RarityItem | null>(
    rarityItemKeys.rarityItemKey(collectionAddress, tokenId),
    async () => {
      const rarityScore = await getRarityScore({ address: collectionAddress, tokenIds: [tokenId], limit: 1, page: 1 });

      if (!rarityScore) {
        return null;
      }

      const [rarityItem] = rarityScore.items;
      return rarityItem ?? null;
    },
    {
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      cacheTime: Infinity,
      ...options,
    }
  );
};

const getRarityItemsByPage = (nftPage: NFTCard[], queryClient: QueryClient) => {
  // Step 1: Filter out tokens from any collections that have already tried to fetch but failed
  const filteredNftPage = nftPage.filter((nftTokenPage) => !rarityFetchErrorMap.has(nftTokenPage.collection.address));

  // Step 2: Organize by all unique collections and skip data we have already collected
  const tokensByCollection = filteredNftPage.reduce<Record<string, string[]>>((accum, nft) => {
    const existingQueryData = queryClient.getQueryData<RarityItem>(
      rarityItemKeys.rarityItemKey(nft.collection.address, nft.tokenId)
    );

    if (existingQueryData) {
      return accum;
    }

    if (!accum[nft.collection.address]) {
      accum[nft.collection.address] = [];
    }

    accum[nft.collection.address].push(nft.tokenId);
    return accum;
  }, {});

  // Step 3: For each unique collection fetch the rarity data (without blocking) and update the query cache
  const getSingleRarityItem = async (address: string, tokenIds: string[]) => {
    const rarityScore = await getRarityScore({ address, tokenIds, limit: 25, page: 1 });
    if (rarityScore) {
      rarityScore.items.forEach((rarityItem) => {
        queryClient.setQueryData(
          rarityItemKeys.rarityItemKey(rarityItem.contractAddress, rarityItem.tokenId),
          rarityItem
        );
      });
    }
  };
  return Promise.all(
    Object.entries(tokensByCollection).map(async ([address, tokenIds]) => getSingleRarityItem(address, tokenIds))
  );
};

/**
 * For each page fetch the rarity item by collection
 */
export const useSetRarityItemsByNftPages = () => {
  const queryClient = useQueryClient();
  return useCallback(
    async (nftPages: NFTCard[][]) => {
      const nftPagesCopy = nftPages.slice(); // Copy of the pages

      const getAllRarityItems = async (nftPage?: NFTCard[]) => {
        if (nftPage) {
          await getRarityItemsByPage(nftPage, queryClient);

          if (nftPagesCopy.length > 0) {
            // Fetch next page
            getAllRarityItems(nftPagesCopy.shift());
          }
        }
      };

      // Fetch first page
      getAllRarityItems(nftPagesCopy.shift());
    },
    [queryClient]
  );
};
