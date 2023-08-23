import { BigNumber } from "ethers";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import { getWETHContract } from "utils/contracts";
import { SupportedProviders } from "types/config";

/**
 * Deposit ETH to wrap to WETH
 * @param library Etherjs provider
 * @param account User adddress (need to be an address connected to the app)
 * @param amount Amount to wrap (in wei)
 * @returns TransactionResponse
 */
export const deposit = async (
  library: SupportedProviders,
  account: string,
  amount: BigNumber
): Promise<TransactionResponse> => {
  const wethContract = getWETHContract(library, account);
  return wethContract.deposit({
    value: amount,
  });
};

/**
 * Withdraw WETH to unwrap to ETH
 * @param library Etherjs provider
 * @param account User adddress (need to be an address connected to the app)
 * @param amount Amount to unwrap (in wei)
 * @returns TransactionResponse
 */
export const withdraw = async (
  library: SupportedProviders,
  account: string,
  amount: BigNumber
): Promise<TransactionResponse> => {
  const wethContract = getWETHContract(library, account);
  return wethContract.withdraw(amount);
};
