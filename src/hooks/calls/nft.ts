import { BigNumber } from "ethers";
import { useActiveProvider } from "hooks/useActiveProvider";
import { useCallback } from "react";
import { useQuery, useQueryClient, UseQueryOptions } from "react-query";
import { TokenStandard } from "types/config";
import { balanceOf, isApprovedForAll, ownerOf } from "utils/calls/nft";
import { isAddressEqual } from "utils/guards";

export const BASE_NFT_CALLS_KEY = "nft-calls";

export const nftKeys = {
  tokenStandard: (collectionAddress: string, type: TokenStandard, tokenId: string, owner: string) => [
    "balance-of-token-standard",
    collectionAddress,
    type,
    tokenId,
    owner,
  ],
};

export const useOwnerOfErc721 = (
  collectionAddress: string,
  tokenId: string,
  options?: UseQueryOptions<string, any, string>
) => {
  const library = useActiveProvider();
  return useQuery<string>(
    [BASE_NFT_CALLS_KEY, collectionAddress, tokenId],
    () => ownerOf(library, collectionAddress, tokenId),
    {
      ...options,
    }
  );
};

export const useBalanceOfErc1155 = (
  collectionAddress: string,
  tokenId: string,
  owner: string,
  options?: UseQueryOptions<BigNumber, any, BigNumber>
) => {
  const library = useActiveProvider();
  return useQuery<BigNumber>(
    [BASE_NFT_CALLS_KEY, collectionAddress, tokenId, owner],
    () => balanceOf(library, collectionAddress, tokenId, owner),
    {
      ...options,
    }
  );
};

export const useBalanceOfTokenStandard = (
  collectionAddress: string,
  type: TokenStandard,
  tokenId: string,
  owner: string,
  options?: UseQueryOptions<number, any, number>
) => {
  const library = useActiveProvider();
  return useQuery<number>(
    nftKeys.tokenStandard(collectionAddress, type, tokenId, owner),
    async () => {
      if (type === "ERC1155") {
        const tokenBalanceOf = await balanceOf(library, collectionAddress, tokenId, owner);
        return tokenBalanceOf.toNumber();
      }

      const tokenOwner = await ownerOf(library, collectionAddress, tokenId);
      return isAddressEqual(tokenOwner, owner) ? 1 : 0;
    },
    {
      ...options,
    }
  );
};

export const useInvalidateBalanceOfTokenStandard = () => {
  const queryClient = useQueryClient();
  return useCallback(
    (collectionAddress: string, type: TokenStandard, tokenId: string, owner: string) => {
      queryClient.invalidateQueries(nftKeys.tokenStandard(collectionAddress, type, tokenId, owner));
    },
    [queryClient]
  );
};

export const useIsApprovedForAll = (
  abi: any,
  collectionAddress: string,
  owner: string,
  operator: string,
  options?: UseQueryOptions<boolean, any, boolean>
) => {
  const library = useActiveProvider();
  return useQuery<boolean>(
    [BASE_NFT_CALLS_KEY, collectionAddress, owner, operator],
    () => isApprovedForAll(library, abi, collectionAddress, owner, operator),
    {
      ...options,
    }
  );
};
