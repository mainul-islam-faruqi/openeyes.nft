import { useQuery, UseQueryOptions } from "react-query";
import { BigNumber } from "ethers";
import { CONTRACT_BALANCE_INTERVAL } from "config/constants";
import { SupportedProviders } from "types/config";
import { useActiveProvider } from "hooks/useActiveProvider";
import {
  calculateSharePriceInLOOKS as calculateFeeSharingSharePriceInLOOKS,
  viewTotalShares as viewTotalFeeSharingShares,
} from "utils/calls/feeSharingSystem";
import {
  calculateSharePriceInLOOKS as calculateAggregatorSharePriceInLOOKS,
  viewTotalShares as viewTotalAggregatorShares,
} from "utils/calls/aggregatorUniswapV3";
import { toDecimals } from "utils/format";

interface PoolSharesData {
  totalFeeSharingShares: BigNumber;
  totalAggregatorShares: BigNumber;
  aggregatorSharePriceLOOKS: BigNumber;
  feeSharingSharePriceLOOKS: BigNumber;
}

const fetcher = async (library: SupportedProviders) => {
  const [totalFeeSharingShares, totalAggregatorShares, aggregatorSharePriceLOOKS, feeSharingSharePriceLOOKS] =
    await Promise.all([
      viewTotalFeeSharingShares(library),
      viewTotalAggregatorShares(library),
      calculateAggregatorSharePriceInLOOKS(library),
      calculateFeeSharingSharePriceInLOOKS(library),
    ]);

  return {
    totalFeeSharingShares,
    totalAggregatorShares,
    aggregatorSharePriceLOOKS,
    feeSharingSharePriceLOOKS,
  };
};

const useLOOKSPoolsShareData = (options?: UseQueryOptions<PoolSharesData, any, PoolSharesData>) => {
  const library = useActiveProvider();
  return useQuery<PoolSharesData>(["looks-in-fee-sharing-pools-data"], () => fetcher(library), {
    ...options,
    refetchInterval: CONTRACT_BALANCE_INTERVAL,
  });
};

export const useGetTotalLOOKSInFeeSharingPools = () => {
  const looksPoolsQuery = useLOOKSPoolsShareData();

  const { totalFeeSharingShares, totalAggregatorShares, aggregatorSharePriceLOOKS, feeSharingSharePriceLOOKS } =
    looksPoolsQuery.data || {};

  const feeSharingPriceMulShares =
    totalFeeSharingShares && feeSharingSharePriceLOOKS && feeSharingSharePriceLOOKS.mul(totalFeeSharingShares);
  const feeSharingTotalLOOKSWei = feeSharingPriceMulShares && feeSharingPriceMulShares.div(toDecimals("1")); // Normalise the total after multiplying two wei values

  const aggregatorSharePriceMulShares =
    totalAggregatorShares && aggregatorSharePriceLOOKS && aggregatorSharePriceLOOKS.mul(totalAggregatorShares);
  const aggregatorTotalLOOKSWei = aggregatorSharePriceMulShares && aggregatorSharePriceMulShares.div(toDecimals("1"));

  const totalLOOKSInFeeSharingPools =
    aggregatorTotalLOOKSWei && feeSharingTotalLOOKSWei && feeSharingTotalLOOKSWei.add(aggregatorTotalLOOKSWei);

  return {
    totalLOOKSInFeeSharingPools,
    aggregatorTotalLOOKSWei,
    feeSharingTotalLOOKSWei,
    ...looksPoolsQuery,
  };
};
