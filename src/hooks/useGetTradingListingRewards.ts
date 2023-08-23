import { useWeb3React } from "@web3-react/core";
import { BigNumber, constants } from "ethers";
import { useCallback } from "react";
import { useQuery, useQueryClient, UseQueryOptions } from "react-query";
import { getRewardsClaimed } from "utils/calls/multiRewardsDistributor";
import { getUserTradingListingRewards } from "utils/graphql/rewards";

const tradingListingRewardsKey = (account: string) => ["user-reward", account];

interface UserRewardTreeData {
  claimed: BigNumber;
  total: BigNumber;
  pending: BigNumber;
  proof: string[] | null;
}

export interface UserRewardPayload {
  tradingRewards: UserRewardTreeData;
  listingRewards: UserRewardTreeData;
}

export const useGetTradingListingRewards = (
  account: string,
  options?: UseQueryOptions<UserRewardPayload, any, UserRewardPayload>
) => {
  const { library } = useWeb3React();
  return useQuery<UserRewardPayload>(
    tradingListingRewardsKey(account),
    async () => {
      // amountClaimed = total amount claimed for trading & listing rewards (on-chain)
      // userRewards = total amount can claim (api)
      const [amountClaimed, userRewards] = await Promise.all([
        getRewardsClaimed(library, account),
        getUserTradingListingRewards(account),
      ]);

      const earnedTradingRewards = userRewards.tradingReward
        ? BigNumber.from(userRewards.tradingReward.looksTotal)
        : constants.Zero;
      const earnedListingRewards = userRewards.listingReward
        ? BigNumber.from(userRewards.listingReward.looksTotal)
        : constants.Zero;

      return {
        tradingRewards: {
          claimed: amountClaimed.tradingRewards,
          total: earnedTradingRewards,
          pending: earnedTradingRewards.sub(amountClaimed.tradingRewards),
          proof: userRewards.tradingReward ? userRewards.tradingReward.proof : null,
        },
        listingRewards: {
          claimed: amountClaimed.listingRewards,
          total: earnedListingRewards,
          pending: earnedListingRewards.sub(amountClaimed.listingRewards),
          proof: userRewards.listingReward ? userRewards.listingReward.proof : null,
        },
      };
    },
    {
      refetchOnReconnect: false,
      ...options,
    }
  );
};

export const useInvalidateTradingListingRewards = () => {
  const queryClient = useQueryClient();
  return useCallback(
    (account: string) => {
      queryClient.invalidateQueries(tradingListingRewardsKey(account));
    },
    [queryClient]
  );
};
