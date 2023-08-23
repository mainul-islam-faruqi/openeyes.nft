import { UseQueryOptions, useQuery } from "react-query";
import { useWeb3React } from "@web3-react/core";
import { TokenStandard } from "types/config";
import { balanceOf, ownerOf } from "utils/calls/nft";
import { isAddressEqual } from "utils/guards";

interface CheckOwnerReturn {
  isOwner: boolean;
  ownerAddress?: string;
}

interface CheckOwner {
  addressToCheck: string;
  tokenId: string;
  collectionAddress: string;
  collectionType: TokenStandard;
}

export const useCheckOwner = (
  { addressToCheck, tokenId, collectionAddress, collectionType }: CheckOwner,
  options?: UseQueryOptions<CheckOwnerReturn, any, CheckOwnerReturn>
) => {
  const isErc1155 = collectionType === "ERC1155";
  const { library } = useWeb3React();

  return useQuery<CheckOwnerReturn>(
    ["is-owner", addressToCheck, tokenId, collectionAddress, collectionType],
    async () => {
      try {
        if (isErc1155) {
          const response = await balanceOf(library, collectionAddress, tokenId, addressToCheck);

          return { isOwner: response.gt(0) };
        }

        const response = await ownerOf(library, collectionAddress, tokenId);
        return { ownerAddress: response, isOwner: isAddressEqual(response, addressToCheck) };
      } catch {
        return { isOwner: false };
      }
    },
    {
      refetchOnWindowFocus: false,
      ...options,
    }
  );
};
