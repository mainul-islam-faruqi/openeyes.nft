import { BigNumber } from "ethers";
import { useActiveProvider } from "../useActiveProvider";
import { useQuery, UseQueryOptions } from "react-query";
import {
  viewUserInfo,
  FeeSharingSystemUserInfo,
  calculateSharesValueInLOOKS,
  calculatePendingRewards,
  calculateSharePriceInLOOKS,
  viewCurrentWethRewardPerBlock,
  viewTotalShares,
} from "utils/calls/feeSharingSystem";
import { CONTRACT_BALANCE_INTERVAL } from "config/constants";

export const BASE_FEE_SHARING_KEY = "fee-sharing";

export const useCalculateSharePriceInLOOKS = (options?: UseQueryOptions<BigNumber, any, BigNumber>) => {
  const library = useActiveProvider();
  return useQuery<BigNumber>(
    [BASE_FEE_SHARING_KEY, "share-price-in-looks"],
    () => calculateSharePriceInLOOKS(library),
    {
      refetchInterval: CONTRACT_BALANCE_INTERVAL,
      ...options,
    }
  );
};

export const useFeeSharingSystemUserInfo = (
  address: string,
  options?: UseQueryOptions<FeeSharingSystemUserInfo, any, FeeSharingSystemUserInfo>
) => {
  const library = useActiveProvider();
  return useQuery<FeeSharingSystemUserInfo>(
    [BASE_FEE_SHARING_KEY, "user-info", address],
    () => viewUserInfo(library, address),
    {
      refetchInterval: CONTRACT_BALANCE_INTERVAL,
      ...options,
    }
  );
};

export const useCalculateUserSharesValueInLOOKS = (
  address: string,
  options?: UseQueryOptions<BigNumber, any, BigNumber>
) => {
  const library = useActiveProvider();
  return useQuery<BigNumber>(
    [BASE_FEE_SHARING_KEY, "user-shares-in-looks", address],
    () => calculateSharesValueInLOOKS(library, address),
    { refetchInterval: CONTRACT_BALANCE_INTERVAL, ...options }
  );
};

export const useCalculatePendingUserRewards = (
  address: string,
  options?: UseQueryOptions<BigNumber, any, BigNumber>
) => {
  const library = useActiveProvider();
  return useQuery<BigNumber>(
    [BASE_FEE_SHARING_KEY, "user-rewards", address],
    () => calculatePendingRewards(library, address),
    {
      refetchInterval: CONTRACT_BALANCE_INTERVAL,
      ...options,
    }
  );
};

export const useViewCurrentWethRewardPerBlock = (options?: UseQueryOptions<BigNumber, any, BigNumber>) => {
  const library = useActiveProvider();
  return useQuery<BigNumber>([BASE_FEE_SHARING_KEY, "reward-per-block"], () => viewCurrentWethRewardPerBlock(library), {
    ...options,
  });
};

export const useViewTotalShares = (options?: UseQueryOptions<BigNumber, any, BigNumber>) => {
  const library = useActiveProvider();
  return useQuery<BigNumber>([BASE_FEE_SHARING_KEY, "total-shares"], () => viewTotalShares(library), {
    ...options,
  });
};
