import { useWeb3React } from "@web3-react/core";
import { useQuery, UseQueryOptions } from "react-query";
import { BigNumber } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { calculateRoyaltyFeeAndGetRecipient, CalculateRoyaltyFeeAndGetRecipientResponse } from "utils/calls/fees";
import { getCreatorFee } from "utils/tokens";
import { useActiveProvider } from "hooks/useActiveProvider";

export const ROYALTY_FEE_AND_RECIPIENT_BASE_KEY = "royalty-fee-recipient";

type CalculateRoyaltyFeeAndGetRecipientOptions = UseQueryOptions<
  CalculateRoyaltyFeeAndGetRecipientResponse,
  any,
  CalculateRoyaltyFeeAndGetRecipientResponse
>;

export const useCalculateRoyaltyFeeAndGetRecipient = (
  collectionAddress: string,
  tokenId: string,
  amount: BigNumber,
  options?: CalculateRoyaltyFeeAndGetRecipientOptions
) => {
  const { library } = useWeb3React();

  return useQuery<CalculateRoyaltyFeeAndGetRecipientResponse>(
    [ROYALTY_FEE_AND_RECIPIENT_BASE_KEY, collectionAddress, tokenId, amount],
    () => calculateRoyaltyFeeAndGetRecipient(library, collectionAddress, tokenId, amount),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      ...options,
    }
  );
};

export const useCalculateCreatorFeePercentage = (
  collectionAddress: string,
  tokenId: string,
  options?: UseQueryOptions<number, any, number>
) => {
  const library = useActiveProvider();
  const oneEth = parseEther("1");

  return useQuery<number>(
    [ROYALTY_FEE_AND_RECIPIENT_BASE_KEY, collectionAddress, tokenId, oneEth],
    async () => {
      return getCreatorFee(library, collectionAddress, tokenId);
    },
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      ...options,
    }
  );
};
