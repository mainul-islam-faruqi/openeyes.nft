import { BigNumber } from "ethers";
import { getTokenDistributorContract } from "utils/contracts";
import { SupportedProviders } from "types/config";

/**
 * Tokens distributed per block for staking
 * @param library Etherjs provider
 * @returns BigNumber
 */
export const viewLooksRewardPerBlockForStaking = async (library: SupportedProviders): Promise<BigNumber> => {
  const tokenDistributorContract = getTokenDistributorContract(library);
  const rewardPerBlockForStaking = await tokenDistributorContract.rewardPerBlockForStaking();

  return BigNumber.from(rewardPerBlockForStaking);
};

/**
 * Total amount staked
 * @param library Etherjs provider
 * @returns BigNumber
 */
export const viewTotalAmountStaked = async (library: SupportedProviders): Promise<BigNumber> => {
  const tokenDistributorContract = getTokenDistributorContract(library);
  const totalAmountStaked = await tokenDistributorContract.totalAmountStaked();

  return BigNumber.from(totalAmountStaked);
};
