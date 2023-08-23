import { gql } from "graphql-request";
import { currentChainInfo } from "config/chains";
import { graphql } from "../graphql/graphql";

export interface RewardsSubgraph {
  feeSharingAdjustedDepositAmount?: string;
  feeSharingTotalCollectedWETH?: string;
  feeSharingTotalCollectedLOOKS?: string;
  feeSharingLastHarvestDate?: string;
  feeSharingLastDepositDate?: string;
  stakingPoolUniswapV2LastHarvestDate?: string;
  stakingPoolUniswapV2TotalCollectedLOOKS?: string;
  tradingRewardsAmount?: string;
  tradingRewardsLastClaimDate?: string;
  aggregatorAdjustedDepositAmount?: string;
  aggregatorTotalCollectedLOOKS?: string;
}

/**
 * Query rewards subgraph for values relating to fee sharing, trading rewards, LOOKS & LP staking
 * @param address lowercased address to query
 * @returns RewardsSubgraph promise
 */

export const getRewardsSubgraph = async (address: string): Promise<RewardsSubgraph> => {
  const query = gql`
    query GetRewardsSubgraph($where: User_filter) {
      users(first: 1, where: $where) {
        feeSharingAdjustedDepositAmount
        feeSharingTotalCollectedWETH
        feeSharingTotalCollectedLOOKS
        feeSharingLastHarvestDate
        feeSharingLastDepositDate
        stakingPoolUniswapV2LastHarvestDate
        stakingPoolUniswapV2TotalCollectedLOOKS
        tradingRewardsAmount
        tradingRewardsLastClaimDate
        aggregatorAdjustedDepositAmount
        aggregatorTotalCollectedLOOKS
      }
    }
  `;

  const res = await graphql(query, { where: { id: address } }, undefined, currentChainInfo.rewardsSubgraphUrl);
  return res.users[0];
};
