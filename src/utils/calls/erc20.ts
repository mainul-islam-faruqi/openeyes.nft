import { BigNumber, constants } from "ethers";
import { getERC20Contract } from "utils/contracts";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import { SupportedProviders } from "types/config";

/**
 * Return the ERC20 balance of an account
 * @param library Etherjs provider
 * @param tokenAddress ERC20 address
 * @param account Account address
 * @returns Balance as BigNumber
 */
export const balanceOf = async (
  library: SupportedProviders,
  tokenAddress: string,
  account: string
): Promise<BigNumber> => {
  try {
    const contract = getERC20Contract(library, tokenAddress);
    const res = await contract.balanceOf(account);
    return BigNumber.from(res);
  } catch (error) {
    console.error(error);
    return BigNumber.from(0);
  }
};

/**
 * Return the total supply of an ERC20 token
 * @param library Etherjs provider
 * @param tokenAddress ERC20 address
 * @returns totalSupply as a BigNumber
 */
export const totalSupply = async (library: SupportedProviders, tokenAddress: string): Promise<BigNumber> => {
  try {
    const contract = getERC20Contract(library, tokenAddress);
    const res = await contract.totalSupply();
    return BigNumber.from(res);
  } catch (error) {
    console.error(error);
    return BigNumber.from(0);
  }
};

/**
 * Request the ERC20 allowance a spender can use on behalf of the owner
 * @param library Etherjs provider
 * @param address ERC20 address
 * @param owner ERC20 owner address
 * @param spender Spender address
 * @returns Current allowance as a BigNumber
 */
export const getAllowance = async (
  library: SupportedProviders,
  address: string,
  owner: string,
  spender: string
): Promise<BigNumber> => {
  try {
    const contract = getERC20Contract(library, address);
    return await contract.allowance(owner, spender);
  } catch (error) {
    console.error(error);
    return BigNumber.from(0);
  }
};

/**
 * Approve an amount of ECR20 to be spent by a spender on behalf of a user
 * @param library Etherjs provider
 * @param address ERC20 address
 * @param owner ERC20 owner address
 * @param spender Spender address
 * @param amount Allowance
 * @returns TransactionResponse
 */
export const approve = async (
  library: SupportedProviders,
  address: string,
  owner: string,
  spender: string,
  amount: BigNumber = constants.MaxUint256
): Promise<TransactionResponse> => {
  const contract = getERC20Contract(library, address, owner);
  return contract.approve(spender, amount);
};
