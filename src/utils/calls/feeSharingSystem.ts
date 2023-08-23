import { BigNumber, BigNumberish } from "ethers";
import { getFeeSharingSystemContract } from "utils/contracts";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import { SupportedProviders } from "types/config";

const FEE_SHARING_GAS_LIMIT = "300000";
const FEE_SHARING_HARVEST_GAS_LIMIT = "240000";

export interface FeeSharingSystemUserInfo {
  shares: BigNumber;
  userRewardPerTokenPaid: BigNumber;
  rewards: BigNumber;
}

/**
 * Deposit staked tokens (and collect reward tokens if requested)
 * @param library Etherjs provider
 * @param account User adddress (need to be an address connected to the app)
 * @param amount amount to deposit (in looksRareToken)
 * @param shouldClaimRewardToken whether to claim reward tokens
 * @returns TransactionResponse
 */
export const deposit = async (
  library: SupportedProviders,
  account: string,
  amount: BigNumber,
  shouldClaimRewardToken: boolean
): Promise<TransactionResponse> => {
  const feeSharingSystemContract = getFeeSharingSystemContract(library, account);
  return feeSharingSystemContract.deposit(amount, shouldClaimRewardToken, {
    gasLimit: FEE_SHARING_GAS_LIMIT,
  });
};

/**
 * Harvest reward tokens that are pending
 * @param library Etherjs provider
 * @param account User adddress (need to be an address connected to the app)
 * @returns TransactionResponse
 */
export const harvest = async (library: SupportedProviders, account: string): Promise<TransactionResponse> => {
  const feeSharingSystemContract = getFeeSharingSystemContract(library, account);
  return feeSharingSystemContract.harvest({ gasLimit: FEE_SHARING_HARVEST_GAS_LIMIT });
};

/**
 * Withdraw staked tokens (and collect reward tokens if requested)
 * @param library Etherjs provider
 * @param account User adddress (need to be an address connected to the app)
 * @param shares shares to withdraw
 * @param shouldClaimRewardToken whether to claim reward tokens
 * @returns TransactionResponse
 */
export const withdraw = async (
  library: SupportedProviders,
  account: string,
  shares: BigNumberish,
  shouldClaimRewardToken: boolean
): Promise<TransactionResponse> => {
  const feeSharingSystemContract = getFeeSharingSystemContract(library, account);
  return feeSharingSystemContract.withdraw(shares, shouldClaimRewardToken, {
    gasLimit: FEE_SHARING_GAS_LIMIT,
  });
};

/**
 * Withdraw staked tokens (and collect reward tokens if requested)
 * @param library Etherjs provider
 * @param account User adddress (need to be an address connected to the app)
 * @param shouldClaimRewardToken whether to claim reward tokens
 * @returns TransactionResponse
 */
export const withdrawAll = async (
  library: SupportedProviders,
  account: string,
  shouldClaimRewardToken: boolean
): Promise<TransactionResponse> => {
  const feeSharingSystemContract = getFeeSharingSystemContract(library, account);
  return feeSharingSystemContract.withdrawAll(shouldClaimRewardToken, {
    gasLimit: FEE_SHARING_GAS_LIMIT,
  });
};

/**
 * Get UserInfo for users that stake LOOKS tokens
 * @param library Etherjs provider
 * @param account User adddress (need to be an address connected to the app)
 * @returns UserInfo
 */
export const viewUserInfo = async (library: SupportedProviders, account: string): Promise<FeeSharingSystemUserInfo> => {
  const feeSharingSystemContract = getFeeSharingSystemContract(library, account);
  const [shares, userRewardPerTokenPaid, rewards] = await feeSharingSystemContract.userInfo(account);

  return {
    shares: BigNumber.from(shares),
    userRewardPerTokenPaid: BigNumber.from(userRewardPerTokenPaid),
    rewards: BigNumber.from(rewards),
  };
};

/**
 * Reward rate (block)
 * @param library Etherjs provider
 * @returns BigNumber
 */
export const viewCurrentWethRewardPerBlock = async (library: SupportedProviders): Promise<BigNumber> => {
  const feeSharingSystemContract = getFeeSharingSystemContract(library);
  const currentRewardPerBlock = await feeSharingSystemContract.currentRewardPerBlock();

  return BigNumber.from(currentRewardPerBlock);
};

/**
 * Total existing shares
 * @param library Etherjs provider
 * @returns BigNumber
 */
export const viewTotalShares = async (library: SupportedProviders): Promise<BigNumber> => {
  const feeSharingSystemContract = getFeeSharingSystemContract(library);
  const totalShares = await feeSharingSystemContract.totalShares();

  return BigNumber.from(totalShares);
};

/**
 * Calculates price of one share (in LOOKS token)
 * @param library Etherjs provider
 * @returns BigNumber Share price is expressed times 1e18
 */
export const calculateSharePriceInLOOKS = async (library: SupportedProviders): Promise<BigNumber> => {
  const feeSharingSystemContract = getFeeSharingSystemContract(library);
  const sharePriceInLooks = await feeSharingSystemContract.calculateSharePriceInLOOKS();

  return BigNumber.from(sharePriceInLooks);
};

/**
 * Calculate value of LOOKS for a user given a number of shares owned
 * @param library Etherjs provider
 * @param account User adddress (need to be an address connected to the app)
 * @returns BigNumber
 */
export const calculateSharesValueInLOOKS = async (library: SupportedProviders, account: string): Promise<BigNumber> => {
  const feeSharingSystemContract = getFeeSharingSystemContract(library, account);
  const looksValueForUserShares = await feeSharingSystemContract.calculateSharesValueInLOOKS(account);

  return BigNumber.from(looksValueForUserShares);
};

/**
 * Calculate pending rewards for a user
 * @param library Etherjs provider
 * @param account User adddress (need to be an address connected to the app)
 * @returns BigNumber
 */
export const calculatePendingRewards = async (library: SupportedProviders, account: string): Promise<BigNumber> => {
  const feeSharingSystemContract = getFeeSharingSystemContract(library, account);
  const pendingRewards = await feeSharingSystemContract.calculatePendingRewards(account);

  return BigNumber.from(pendingRewards);
};
