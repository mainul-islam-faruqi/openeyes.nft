import { BigNumber } from "ethers";
import {
  getRoyaltyFeeManagerContract,
  getRoyaltyFeeRegistryContract,
  getRoyaltyFeeSetterContract,
  getStrategyContract,
} from "utils/contracts";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import { SupportedProviders } from "types/config";

/**
 * Retrieve the protocol fees for a specific strategy
 * @param library Etherjs provider
 * @param strategyAddress
 * @returns the protocol fee on a 10,000 basis
 */
export const viewProtocolFee = async (library: SupportedProviders, strategyAddress: string): Promise<BigNumber> => {
  const strategyContract = getStrategyContract(library, strategyAddress);
  const protocolFee = await strategyContract.viewProtocolFee();
  return BigNumber.from(protocolFee);
};

/**
 * Retrieve the royalty info specific collection
 * @param library Etherjs provider
 * @param strategyAddress
 * @returns the royalty information: setter, receiver, and fee
 */
export const viewCollectionRoyaltyInfo = async (
  library: SupportedProviders,
  collectionAddress: string
): Promise<{ setter: string; receiver: string; fee: BigNumber }> => {
  const royaltyFeeRegistryContract = getRoyaltyFeeRegistryContract(library);
  const [setter, receiver, fee]: [string, string, BigNumber] =
    await royaltyFeeRegistryContract.royaltyFeeInfoCollection(collectionAddress);
  return { setter, receiver, fee };
};

/**
 * Retrieve the creator fees for a specific collection
 * @param library Etherjs provider
 * @param strategyAddress
 * @returns the protocol fee on a 10,000 basis
 */
export const viewCreatorFee = async (library: SupportedProviders, collectionAddress: string): Promise<BigNumber> => {
  const { fee } = await viewCollectionRoyaltyInfo(library, collectionAddress);
  return BigNumber.from(fee);
};

/**
 * @see https://looksrare.atlassian.net/wiki/spaces/LRR/pages/68845569/Royalty+fee+logic
 * @returns
 * 0 - Setter is already set
 * 1 - Setter is not set but ERC2981 is available
 * 2 - Setter is not set. There is an owner() in the NFT collection contract
 * 3 - Setter is not set. There is an admin() in the NFT collection contract
 * 4 - Setter is not set. There is no owner() or admin() in the NFT collection contract
 */
export const viewCollectionSetterStatus = async (
  library: SupportedProviders,
  collectionAddress: string
): Promise<number> => {
  const royaltyFeeSetterContract = getRoyaltyFeeSetterContract(library);
  const [, status]: [string, number] = await royaltyFeeSetterContract.checkForCollectionSetter(collectionAddress);
  return status;
};

/**
 * Sets initial royalty information for a collection. This function is used when a setter HAS NOT
 * been set on a collection. If a setter has been set use "updateRoyaltyInfo"
 *
 * @param setterType Determines which update function to call: admin or owner
 * @param library Etherjs provider
 * @param account User adddress (need to be an address connected to the app)
 * @param collectionAddress
 * @param setter The address that can update the royalty information in the future
 * @param receiver The address for fees to be sent to (Royalty address)
 * @param fee Royalty fee. 2.5% = 250, 14% = 1400
 * @returns TransactionResponse
 */
export const setRoyaltyInfo = async (
  setterType: "admin" | "owner",
  library: SupportedProviders,
  account: string,
  collectionAddress: string,
  setter: string,
  receiver: string,
  fee: string
): Promise<TransactionResponse> => {
  const royaltyFeeSetterContract = getRoyaltyFeeSetterContract(library, account);
  const method =
    setterType === "admin" ? "updateRoyaltyInfoForCollectionIfAdmin" : "updateRoyaltyInfoForCollectionIfOwner";
  return royaltyFeeSetterContract[method](collectionAddress, setter, receiver, fee);
};

/**
 * Updates royalty info for a collection
 *
 * @param library Etherjs provider
 * @param collectionAddress
 * @param setter The address of the connected wallet
 * @param receiver The address for fees to be sent to (Royalty address)
 * @param fee Royalty fee. 2.5% = 250, 14% = 1400
 * @returns TransactionResponse
 */
export const updateRoyaltyInfo = async (
  library: SupportedProviders,
  collectionAddress: string,
  setter: string,
  receiver: string,
  fee: string
): Promise<TransactionResponse> => {
  const royaltyFeeSetterContract = getRoyaltyFeeSetterContract(library, setter);
  return royaltyFeeSetterContract.updateRoyaltyInfoForCollectionIfSetter(collectionAddress, setter, receiver, fee);
};

export interface CalculateRoyaltyFeeAndGetRecipientResponse {
  receiver: string;
  royaltyAmount: BigNumber;
}

/**
 * Calculates royalty fee and gets recipient
 *
 * @param library Etherjs provider
 * @param collectionAddress
 * @param tokenId
 * @param amount
 * @return response
 * @param response.receiver address that receives the royalty
 * @param response.royaltyAmount
 */
export const calculateRoyaltyFeeAndGetRecipient = async (
  library: SupportedProviders,
  collectionAddress: string,
  tokenId: string,
  amount: BigNumber
): Promise<CalculateRoyaltyFeeAndGetRecipientResponse> => {
  const royaltyFeeManagerContract = getRoyaltyFeeManagerContract(library);
  const [receiver, royaltyAmount] = await royaltyFeeManagerContract.calculateRoyaltyFeeAndGetRecipient(
    collectionAddress,
    tokenId,
    amount
  );

  return {
    receiver,
    royaltyAmount: BigNumber.from(royaltyAmount),
  };
};
