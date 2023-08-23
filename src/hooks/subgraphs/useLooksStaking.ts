import { CONTRACT_BALANCE_INTERVAL } from "config/constants";
import { useQuery, UseQueryOptions } from "react-query";
import { getRewardsSubgraph, RewardsSubgraph } from "utils/subgraphs/looksStaking";

export const BASE_REWARDS_SUBGRAPH_KEY = "looks-distribution-subgraph";

/**
 * Get user rewards data relating to LOOKS & LP staking, fee sharing WETH rewards and LOOKS trading rewards
 * @param address Account to query
 * @returns RewardsSubgraph
 */
export const useRewardsSubgraph = (
  address: string,
  queryOptions?: UseQueryOptions<RewardsSubgraph, any, RewardsSubgraph>
) => {
  const lowercaseAddress = address.toLowerCase();
  return useQuery<RewardsSubgraph>(
    [BASE_REWARDS_SUBGRAPH_KEY, lowercaseAddress],
    () => getRewardsSubgraph(lowercaseAddress),
    {
      refetchInterval: CONTRACT_BALANCE_INTERVAL,
      ...queryOptions,
    }
  );
};
