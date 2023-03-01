// @ts-nocheck
// import { multicall, Call } from "@looksrare/shared";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import { BigNumber, BigNumberish } from "ethers";
import { addresses } from "config/addresses";
import { getAggregatorUniswapV3Contract } from "utils/contracts";
import { SupportedProviders } from "types/config";
import { AggregatorFeeSharingWithUniswapV3Abi } from "@looksrare/sdk";
import { estimateGas } from "./helpers";

const AGGREGATOR_GAS_LIMIT = BigNumber.from("350000");
const HARVEST_AND_SELL_GAS_LIMIT = BigNumber.from("500000");

export interface AggregatorUserInfo {
  shares: BigNumber;
}

/**
 * Evaluate whether the aggregator contract will harvest & sell WETH based on current block, last harvest block and the harvest buffer
 *
 * @param library
 * @returns Promise<boolean>
 */
const getWillHarvestAndSell = async (library: SupportedProviders): Promise<boolean> => {
  const WILL_HARVEST_BLOCK_BUFFER = BigNumber.from(12); // ~2:30 buffer (in blocks) for tx to be sent

  const calls: Call[] = [
    {
      contractAddress: addresses.AGGREGATOR_UNISWAP_V3,
      functionName: "lastHarvestBlock",
    },
    {
      contractAddress: addresses.AGGREGATOR_UNISWAP_V3,
      functionName: "harvestBufferBlocks",
    },
  ];

  const [lastHarvestBlock, harvestBufferBlocks]: BigNumber[] = await multicall(
    library,
    addresses.MULTICALL2,
    AggregatorFeeSharingWithUniswapV3Abi,
    calls
  );
  const currentBlock = await library.getBlockNumber();

  const blocksUntilHarvestAndSell = lastHarvestBlock.add(harvestBufferBlocks).sub(BigNumber.from(currentBlock));
  const willHarvestAndSell = blocksUntilHarvestAndSell.lte(WILL_HARVEST_BLOCK_BUFFER);

  return willHarvestAndSell;
};

/**
 * Return gasLimit based on whether the contract will harvest & sell, and whether the gas estimate is higher than the static value
 *
 * @param willHarvestAndSell
 * @param estimatedGasLimit
 * @returns BigNumber
 */
const getGasLimit = (willHarvestAndSell: boolean, estimatedGasLimit: BigNumber): BigNumber => {
  if (willHarvestAndSell) {
    return estimatedGasLimit.gt(HARVEST_AND_SELL_GAS_LIMIT) ? estimatedGasLimit : HARVEST_AND_SELL_GAS_LIMIT;
  }
  return estimatedGasLimit.gt(AGGREGATOR_GAS_LIMIT) ? estimatedGasLimit : AGGREGATOR_GAS_LIMIT;
};

/**
 * Deposit LOOKS tokens
 * @param library Etherjs provider
 * @param account User adddress (need to be an address connected to the app)
 * @param amount amount to deposit (in looksRareToken)
 * @returns TransactionResponse
 */
export const deposit = async (
  library: SupportedProviders,
  account: string,
  amount: BigNumber
): Promise<TransactionResponse> => {
  const aggregatorUniswapV3Contract = getAggregatorUniswapV3Contract(library, account);
  const willHarvestAndSell = await getWillHarvestAndSell(library);
  const estimatedGasLimit = await estimateGas(aggregatorUniswapV3Contract, "deposit", [amount]);
  const gasLimit = getGasLimit(willHarvestAndSell, estimatedGasLimit);

  return aggregatorUniswapV3Contract.deposit(amount, {
    gasLimit,
  });
};

/**
 * Withdraw/redeem shares for LOOKS tokens
 * @param library Etherjs provider
 * @param account User adddress (need to be an address connected to the app)
 * @param shares shares to withdraw
 * @returns TransactionResponse
 */
export const withdraw = async (
  library: SupportedProviders,
  account: string,
  shares: BigNumberish
): Promise<TransactionResponse> => {
  const aggregatorUniswapV3Contract = getAggregatorUniswapV3Contract(library, account);
  const willHarvestAndSell = await getWillHarvestAndSell(library);
  const estimatedGasLimit = await estimateGas(aggregatorUniswapV3Contract, "withdraw", [shares]);
  const gasLimit = getGasLimit(willHarvestAndSell, estimatedGasLimit);

  return aggregatorUniswapV3Contract.withdraw(shares, {
    gasLimit,
  });
};

/**
 * Withdraw/redeem shares for LOOKS tokens
 * @param library Etherjs provider
 * @param account User adddress (need to be an address connected to the app)
 * @returns TransactionResponse
 */
export const withdrawAll = async (library: SupportedProviders, account: string): Promise<TransactionResponse> => {
  const aggregatorUniswapV3Contract = getAggregatorUniswapV3Contract(library, account);
  const willHarvestAndSell = await getWillHarvestAndSell(library);
  const estimatedGasLimit = await estimateGas(aggregatorUniswapV3Contract, "withdrawAll");
  const gasLimit = getGasLimit(willHarvestAndSell, estimatedGasLimit);

  return aggregatorUniswapV3Contract.withdrawAll({
    gasLimit,
  });
};

/**
 * Get UserInfo for users that stake LOOKS tokens using the aggregator
 * @param library Etherjs provider
 * @param account User adddress (need to be an address connected to the app)
 * @returns UserInfo
 */
export const viewUserInfo = async (library: SupportedProviders, account: string): Promise<AggregatorUserInfo> => {
  const aggregatorUniswapV3Contract = getAggregatorUniswapV3Contract(library, account);
  const shares = await aggregatorUniswapV3Contract.userInfo(account);
  return {
    shares: BigNumber.from(shares),
  };
};

/**
 * Total existing shares
 * @param library Etherjs provider
 * @returns BigNumber
 */
export const viewTotalShares = async (library: SupportedProviders): Promise<BigNumber> => {
  const aggregatorUniswapV3Contract = getAggregatorUniswapV3Contract(library);
  const totalShares = await aggregatorUniswapV3Contract.totalShares();

  return BigNumber.from(totalShares);
};

/**
 * Threshold before sale of reward token for LOOKS
 * @param library Etherjs provider
 * @returns BigNumber
 */
export const viewThresholdAmount = async (library: SupportedProviders): Promise<BigNumber> => {
  const aggregatorUniswapV3Contract = getAggregatorUniswapV3Contract(library);
  const thresholdAmount = await aggregatorUniswapV3Contract.thresholdAmount();

  return BigNumber.from(thresholdAmount);
};

/**
 * Calculates price of one share (in LOOKS token)
 * @param library Etherjs provider
 * @returns BigNumber Share price is expressed times 1e18
 */
export const calculateSharePriceInLOOKS = async (library: SupportedProviders): Promise<BigNumber> => {
  const aggregatorUniswapV3Contract = getAggregatorUniswapV3Contract(library);
  const sharePriceInLooks = await aggregatorUniswapV3Contract.calculateSharePriceInLOOKS();

  return BigNumber.from(sharePriceInLooks);
};

/**
 * Calculate value of LOOKS for a user given a number of shares owned
 * @param library Etherjs provider
 * @param account User adddress (need to be an address connected to the app)
 * @returns BigNumber
 */
export const calculateSharesValueInLOOKS = async (library: SupportedProviders, account: string): Promise<BigNumber> => {
  const aggregatorUniswapV3Contract = getAggregatorUniswapV3Contract(library, account);
  const looksValueForUserShares = await aggregatorUniswapV3Contract.calculateSharesValueInLOOKS(account);

  return BigNumber.from(looksValueForUserShares);
};

/**
 * Returns whether the aggregator is paused for deposits
 * @param library Etherjs provider
 * @returns boolean
 */
export const viewIsDepositPaused = async (library: SupportedProviders): Promise<boolean> => {
  const aggregatorUniswapV3Contract = getAggregatorUniswapV3Contract(library);
  const isPaused = await aggregatorUniswapV3Contract.paused();

  return isPaused;
};
