import { FixedNumber } from "ethers";
import { getApr, getApy } from "utils/apr";
import { useViewThresholdAmount } from "./calls/useAggregatorUniswapV3";
import { useViewCurrentWethRewardPerBlock } from "./calls/useFeeSharingSystem";
import { useGetTotalLOOKSInFeeSharingPools } from "./useGetTotalLOOKSInFeeSharingPools";
import { useLooksLpPrice } from "./useLooksLpPrice";

const AVG_BLOCKS_PER_DAY = 6500;

interface FeeSharingApy {
  isSuccess: boolean;
  isLoading: boolean;
  apy?: number;
  apr?: number;
  dailyCompounds?: number;
}

export const useFeeSharingWethRewardsApy = (): FeeSharingApy => {
  const { looksPriceInWeth, isSuccess, isLoading } = useLooksLpPrice();
  const { data: wethRewardPerBlock, ...wethRewardPerBlockQuery } = useViewCurrentWethRewardPerBlock();
  const { data: wethThreshold, ...wethThresholdQuery } = useViewThresholdAmount();
  const { totalLOOKSInFeeSharingPools, aggregatorTotalLOOKSWei, ...totalLOOKSInPoolsQuery } =
    useGetTotalLOOKSInFeeSharingPools();

  const apr =
    looksPriceInWeth &&
    wethRewardPerBlock &&
    totalLOOKSInFeeSharingPools && // only LOOKS in fee sharing pools earns WETH
    getApr(looksPriceInWeth, wethRewardPerBlock, totalLOOKSInFeeSharingPools);

  const aggregatorWethRewardsShare =
    totalLOOKSInFeeSharingPools &&
    aggregatorTotalLOOKSWei &&
    FixedNumber.from(aggregatorTotalLOOKSWei).divUnsafe(FixedNumber.from(totalLOOKSInFeeSharingPools));

  const aggregatorWethRewardPerDay =
    aggregatorWethRewardsShare &&
    wethRewardPerBlock &&
    FixedNumber.from(wethRewardPerBlock)
      .mulUnsafe(FixedNumber.from(AVG_BLOCKS_PER_DAY))
      .mulUnsafe(aggregatorWethRewardsShare);

  const dailyCompounds =
    (wethThreshold &&
      aggregatorWethRewardPerDay &&
      aggregatorWethRewardPerDay.divUnsafe(FixedNumber.from(wethThreshold)).round().toUnsafeFloat()) ||
    1;

  const apy = apr && dailyCompounds && getApy(apr, dailyCompounds);

  return {
    apy,
    apr,
    dailyCompounds,
    isSuccess:
      isSuccess &&
      wethRewardPerBlockQuery.isSuccess &&
      totalLOOKSInPoolsQuery.isSuccess &&
      wethThresholdQuery.isSuccess,
    isLoading:
      isLoading ||
      wethRewardPerBlockQuery.isLoading ||
      totalLOOKSInPoolsQuery.isLoading ||
      wethThresholdQuery.isLoading,
  };
};
