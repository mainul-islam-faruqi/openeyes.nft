import { BigNumber } from "ethers";
import { useQuery, UseQueryOptions } from "react-query";
import { useActiveProvider } from "hooks/useActiveProvider";
import { viewLooksRewardPerBlockForStaking, viewTotalAmountStaked } from "utils/calls/tokenDistributor";

export const BASE_TOKEN_DISTRIBUTOR_KEY = "token-distributor";

export const useViewLooksRewardPerBlockForStaking = (options?: UseQueryOptions<BigNumber, any, BigNumber>) => {
  const library = useActiveProvider();
  return useQuery<BigNumber>(
    [BASE_TOKEN_DISTRIBUTOR_KEY, "reward-per-block"],
    () => viewLooksRewardPerBlockForStaking(library),
    {
      ...options,
    }
  );
};

export const useViewTotalAmountStaked = (options?: UseQueryOptions<BigNumber, any, BigNumber>) => {
  const library = useActiveProvider();
  return useQuery<BigNumber>(
    [BASE_TOKEN_DISTRIBUTOR_KEY, "total-amount-staked"],
    () => viewTotalAmountStaked(library),
    {
      ...options,
    }
  );
};
