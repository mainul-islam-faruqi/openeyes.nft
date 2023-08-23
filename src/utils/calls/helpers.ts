import { Contract, BigNumber, PayableOverrides } from "ethers";

const gasMargin = 130; // 30%

/**
 * Estimate the gas for a rpc call, with a bigger margin than what ethers uses
 * @param contract Ethers contract
 * @param methodName RPC method name
 * @param methodArgs RPC method arguments
 * @param overrides https://docs.ethers.io/v5/api/contract/contract/#contract-functionsSend
 * @returns Gas limit
 */
export const estimateGas = async (
  contract: Contract,
  methodName: string,
  methodArgs: any[] = [],
  overrides: PayableOverrides = {}
): Promise<BigNumber> => {
  const estimate = await contract.estimateGas[methodName](...methodArgs, overrides);
  return estimate.mul(gasMargin).div(100);
};

export const callWithEstimateGas = async (
  contract: Contract,
  methodName: string,
  methodArgs: any[],
  overrides: PayableOverrides = {}
) => {
  const estimate = await estimateGas(contract, methodName, methodArgs, overrides);
  return contract[methodName](...methodArgs, {
    ...overrides,
    gasLimit: estimate,
  });
};
