import { BigNumber } from "ethers";
import { MultiRewardsDistributorAbi } from "@looksrare/sdk";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import { addresses } from "config/addresses";
import { LISTING_REWARDS_TREE_ID, TRADING_REWARDS_TREE_ID } from "config/constants";
import { getMultiRewardsDistributorContract } from "utils/contracts";
import { SupportedProviders } from "types/config";
// @ts-ignore
import { Call, multicall } from "@looksrare/shared";

/**
 * Claim pending rewards i.e. trading & listing
 * @param library Etherjs provider
 * @param account User adddress (need to be an address connected to the app)
 * @param treeIds Array of merkle tree ids
 * @param amounts amounts to claim (corresponding to tree ids)
 * @param merkleProofs array containing the merkle proofs (corresponding to tree ids)
 * @returns TransactionResponse
 */
export const claim = async (
  library: SupportedProviders,
  account: string,
  treeIds: number[],
  amounts: BigNumber[],
  merkleProofs: Array<string[]>
): Promise<TransactionResponse> => {
  const multiRewardsDistributorContract = getMultiRewardsDistributorContract(library, account);
  return multiRewardsDistributorContract.claim(treeIds, amounts, merkleProofs);
};

/**
 * Get rewards claimed from trading & listing rewards
 * @NOTE This gets the rewards specifically for tree 0, 1 (trading, listing). In the future we
 * might support other trees so this will need to be more generic
 */
export const getRewardsClaimed = async (library: SupportedProviders, address: string) => {
  // const calls: Call[] = [
  //   {
  //     contractAddress: addresses.MULTI_REWARDS_DISTRIBUTOR,
  //     functionName: "amountClaimedByUserPerTreeId",
  //     params: [address, TRADING_REWARDS_TREE_ID],
  //   },
  //   {
  //     contractAddress: addresses.MULTI_REWARDS_DISTRIBUTOR,
  //     functionName: "amountClaimedByUserPerTreeId",
  //     params: [address, LISTING_REWARDS_TREE_ID],
  //   },
  // ];
  // const [tradingRewards, listingRewards]: BigNumber[] = await multicall(
  //   library,
  //   addresses.MULTICALL2,
  //   MultiRewardsDistributorAbi,
  //   calls
  // );
  // return { tradingRewards, listingRewards };
};
