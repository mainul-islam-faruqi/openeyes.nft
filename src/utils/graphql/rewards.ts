import { BigNumberish } from "ethers";
import { gql } from "graphql-request";
import { graphql } from "./graphql";

export interface UserReward {
  proof: string[];
  looksTotal: BigNumberish;
}

interface Response {
  tradingReward: UserReward | null;
  listingReward: UserReward | null;
}

/**
 * Get trading reward data for a specific user
 * @param account User account address
 * @returns UserReward
 */
export const getUserTradingListingRewards = async (account: string) => {
  const query = gql`
    query Rewards($address: Address!) {
      tradingReward(address: $address) {
        proof
        looksTotal
      }
      listingReward(address: $address) {
        proof
        looksTotal
      }
    }
  `;

  const res: Response = await graphql(query, { address: account });
  return {
    tradingReward: res.tradingReward,
    listingReward: res.listingReward,
  };
};
