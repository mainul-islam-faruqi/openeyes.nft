import { BigNumber } from "ethers";
import { useQuery, UseQueryOptions } from "react-query";
import { CONTRACT_BALANCE_INTERVAL } from "config/constants";
import { useActiveProvider } from "hooks/useActiveProvider";
import {
  AggregatorUserInfo,
  calculateSharePriceInLOOKS,
  viewTotalShares,
  calculateSharesValueInLOOKS,
  viewUserInfo,
  viewThresholdAmount,
  viewIsDepositPaused,
} from "utils/calls/aggregatorUniswapV3";

export const BASE_AGGREGATOR_KEY = "aggregator-uniswap-v3";

export const useCalculateAggregatorSharePriceInLOOKS = (options?: UseQueryOptions<BigNumber, any, BigNumber>) => {
  const library = useActiveProvider();
  return useQuery<BigNumber>([BASE_AGGREGATOR_KEY, "share-price-in-looks"], () => calculateSharePriceInLOOKS(library), {
    refetchInterval: CONTRACT_BALANCE_INTERVAL,
    ...options,
  });
};

export const useAggregatorUniswapV3UserInfo = (
  address: string,
  options?: UseQueryOptions<AggregatorUserInfo, any, AggregatorUserInfo>
) => {
  const library = useActiveProvider();
  return useQuery<AggregatorUserInfo>(
    [BASE_AGGREGATOR_KEY, "user-info", address],
    () => viewUserInfo(library, address),
    {
      refetchInterval: CONTRACT_BALANCE_INTERVAL,
      ...options,
    }
  );
};

export const useCalculateAggregatorUserSharesValueInLOOKS = (
  address: string,
  options?: UseQueryOptions<BigNumber, any, BigNumber>
) => {
  const library = useActiveProvider();
  return useQuery<BigNumber>(
    [BASE_AGGREGATOR_KEY, "user-shares-in-looks", address],
    () => calculateSharesValueInLOOKS(library, address),
    { refetchInterval: CONTRACT_BALANCE_INTERVAL, ...options }
  );
};

export const useViewTotalAggregatorShares = (options?: UseQueryOptions<BigNumber, any, BigNumber>) => {
  const library = useActiveProvider();
  return useQuery<BigNumber>([BASE_AGGREGATOR_KEY, "total-shares"], () => viewTotalShares(library), {
    ...options,
  });
};

export const useViewThresholdAmount = (options?: UseQueryOptions<BigNumber, any, BigNumber>) => {
  const library = useActiveProvider();
  return useQuery<BigNumber>([BASE_AGGREGATOR_KEY, "threshold"], () => viewThresholdAmount(library), {
    ...options,
  });
};

export const useViewIsDepositPaused = (options?: UseQueryOptions<boolean, any, boolean>) => {
  const library = useActiveProvider();
  return useQuery<boolean>([BASE_AGGREGATOR_KEY, "paused"], () => viewIsDepositPaused(library), {
    ...options,
  });
};
