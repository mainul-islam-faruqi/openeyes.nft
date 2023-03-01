import { ethers, Contract } from "ethers";
import {
  ERC20Abi,
  ReverseRecordsAbi,
  FeeSharingSystemAbi,
  RoyaltyFeeSetterAbi,
  TokenDistributorAbi,
  LooksRareExchangeAbi,
  RoyaltyFeeManagerAbi,
  IExecutionStrategyAbi,
  RoyaltyFeeRegistryAbi,
  MultiRewardsDistributorAbi,
  PrivateSaleWithFeeSharingAbi,
  TradingRewardsDistributorAbi,
  AggregatorFeeSharingWithUniswapV3Abi,
  WETHAbi,
} from "@looksrare/sdk";
// import { StakingPoolForUniswapV2TokensAbi } from "abis";
import { addresses } from "config/addresses";
import { SupportedProviders } from "types/config";

/**
 * Generic Contract helper, please use specific helpers below
 * If the ACCOUNT is not provided, the contract can be used to call view functions only.
 * @param address The address of the contract
 * @param ABI The ABI of the contract
 * @param library The etherjs provider
 * @param account (optional) The user account used to get the signer and send transactions
 * @returns Contract
 */
export const getContract = (library: SupportedProviders, address: string, ABI: any, account?: string): Contract => {
  if (!ethers.utils.getAddress(address) || address === ethers.constants.AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'`);
  }
  // @ts-ignore
  return new Contract(address, ABI, account ? library.getSigner(account) : library);
};

export const getERC20Contract = (library: SupportedProviders, address: string, account?: string): Contract => {
  return getContract(library, address, ERC20Abi, account);
};

export const getExchangeContract = (library: SupportedProviders, account?: string): Contract => {
  return getContract(library, addresses.EXCHANGE, LooksRareExchangeAbi, account);
};

export const getRoyaltyFeeManagerContract = (library: SupportedProviders, account?: string): Contract => {
  return getContract(library, addresses.ROYALTY_FEE_MANAGER, RoyaltyFeeManagerAbi, account);
};

export const getRoyaltyFeeRegistryContract = (library: SupportedProviders, account?: string): Contract => {
  return getContract(library, addresses.ROYALTY_FEE_REGISTRY, RoyaltyFeeRegistryAbi, account);
};

export const getRoyaltyFeeSetterContract = (library: SupportedProviders, account?: string): Contract => {
  return getContract(library, addresses.ROYALTY_FEE_SETTER, RoyaltyFeeSetterAbi, account);
};

// export const getLPStakingPoolContract = (library: SupportedProviders, account?: string): Contract => {
//   return getContract(library, addresses.STAKING_POOL_FOR_LOOKS_LP, StakingPoolForUniswapV2TokensAbi, account);
// };

export const getStrategyContract = (library: SupportedProviders, address: string, account?: string): Contract => {
  return getContract(library, address, IExecutionStrategyAbi, account);
};

export const getPrivateTokenSaleWithFeeSharingContract = (library: SupportedProviders, account: string): Contract => {
  return getContract(library, addresses.PRIVATE_SALE_WITH_FEE_SHARING, PrivateSaleWithFeeSharingAbi, account);
};

export const getFeeSharingSystemContract = (library: SupportedProviders, account?: string): Contract => {
  return getContract(library, addresses.FEE_SHARING_SYSTEM, FeeSharingSystemAbi, account);
};

export const getTokenDistributorContract = (library: SupportedProviders, account?: string): Contract => {
  return getContract(library, addresses.TOKEN_DISTRIBUTOR, TokenDistributorAbi, account);
};

export const getTradingRewardsDistributorContract = (library: SupportedProviders, account?: string): Contract => {
  return getContract(library, addresses.TRADING_REWARDS_DISTRIBUTOR, TradingRewardsDistributorAbi, account);
};

export const getMultiRewardsDistributorContract = (library: SupportedProviders, account?: string): Contract => {
  return getContract(library, addresses.MULTI_REWARDS_DISTRIBUTOR, MultiRewardsDistributorAbi, account);
};

export const getWETHContract = (library: SupportedProviders, account?: string): Contract => {
  return getContract(library, addresses.WETH, WETHAbi, account);
};

export const getResolveRecordsContract = (library: SupportedProviders, account?: string): Contract => {
  return getContract(library, addresses.REVERSE_RECORDS, ReverseRecordsAbi, account);
};

export const getAggregatorUniswapV3Contract = (library: SupportedProviders, account?: string): Contract => {
  return getContract(library, addresses.AGGREGATOR_UNISWAP_V3, AggregatorFeeSharingWithUniswapV3Abi, account);
};
