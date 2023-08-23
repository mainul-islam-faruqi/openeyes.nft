import { constants } from "ethers";
import { useViewLooksRewardPerBlockForStaking, useViewTotalAmountStaked } from "hooks/calls/useTokenDistributor";
import { getApr, getApy } from "utils/apr";

const DAILY_LOOKS_AUTO_COMPOUNDS = 24; // 1 per hr

interface LooksStakingApr {
  isSuccess: boolean;
  isLoading: boolean;
  apr?: number;
  sevenDayApy?: number;
  oneDayApy?: number;
  annualApy?: number;
}

export const useLooksStakingApr = (): LooksStakingApr => {
  const { data: looksPerBlockRewards, ...looksRewardsPerBlockQuery } = useViewLooksRewardPerBlockForStaking();
  const { data: totalLooksStaked, ...totalAmountStakedQuery } = useViewTotalAmountStaked();

  const apr =
    looksPerBlockRewards && totalLooksStaked && getApr(constants.WeiPerEther, looksPerBlockRewards, totalLooksStaked);
  const sevenDayApy = apr && getApy(apr, DAILY_LOOKS_AUTO_COMPOUNDS, 7);
  const oneDayApy = apr && getApy(apr, DAILY_LOOKS_AUTO_COMPOUNDS, 1);
  const annualApy = apr && getApy(apr, DAILY_LOOKS_AUTO_COMPOUNDS);

  return {
    apr,
    sevenDayApy,
    oneDayApy,
    annualApy,
    isSuccess: looksRewardsPerBlockQuery.isSuccess && totalAmountStakedQuery.isSuccess,
    isLoading: looksRewardsPerBlockQuery.isLoading || totalAmountStakedQuery.isLoading,
  };
};
