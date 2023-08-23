import { BigNumberish } from "ethers";
import { useQuery, UseQueryOptions } from "react-query";
import { Web3ReactAccount } from "types";

interface OsListingResponse {
  price: BigNumberish | null;
  usd: number | null;
}

export const useOsListing = (
  collectionAddress: string,
  tokenId: string,
  account: Web3ReactAccount,
  options?: UseQueryOptions<OsListingResponse, any, OsListingResponse>
) => {
  return useQuery<OsListingResponse>(
    ["token-listing", collectionAddress, tokenId, account],
    async (): Promise<OsListingResponse> => {
      const response = await fetch(`/api/listings/${collectionAddress}/${tokenId}?account=${account}`);
      const data: OsListingResponse = await response.json();
      return data;
    },
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      ...options,
    }
  );
};
