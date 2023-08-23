import { TransactionResponse } from "@ethersproject/abstract-provider";
import { BigNumber } from "ethers";
import { ERC721Abi, ERC1155Abi } from "@looksrare/sdk";
import { getContract } from "utils/contracts";
import { SupportedProviders } from "types/config";

/**
 *
 * @param library Etherjs provider
 * @param abi ERC 721 / 1155 abi
 * @param collectionAddress collection
 * @param owner user account
 * @param operator transferManagerAddress
 * @returns true or false
 */
export const isApprovedForAll = async (
  library: SupportedProviders,
  abi: any,
  collectionAddress: string,
  owner: string,
  operator: string
): Promise<boolean> => {
  try {
    const contract = getContract(library, collectionAddress, abi);
    return await contract.isApprovedForAll(owner, operator);
  } catch (error) {
    console.error(error);
    return false;
  }
};

/**
 *
 * @param library Etherjs provider
 * @param abi ERC 721 / 1155 abi
 * @param collectionAddress collection
 * @param owner user account
 * @param operator transferManagerAddress
 * @returns TransactionResponse
 */
export const setApprovalForAll = async (
  library: SupportedProviders,
  abi: any,
  collectionAddress: string,
  owner: string,
  operator: string
): Promise<TransactionResponse> => {
  const contract = getContract(library, collectionAddress, abi, owner);
  return await contract.setApprovalForAll(operator, true);
};

/**
 * ERC721 ownerOf
 * @param library Etherjs provider
 * @param collectionAddress collection
 * @param tokenId string
 * @returns string
 */
export const ownerOf = async (
  library: SupportedProviders,
  collectionAddress: string,
  tokenId: string
): Promise<string> => {
  const contract = getContract(library, collectionAddress, ERC721Abi);
  return await contract.ownerOf(tokenId);
};

/**
 * ERC721 safeTransferFrom
 * @param library Etherjs provider
 * @param collectionAddress collection
 * @param owner sender
 * @param to recipient
 * @param tokenId
 * @returns TransactionResponse
 */
export const erc721SafeTransferFrom = async (
  library: SupportedProviders,
  collectionAddress: string,
  owner: string,
  recipient: string,
  tokenId: string
): Promise<TransactionResponse> => {
  const contract = getContract(library, collectionAddress, ERC721Abi, owner);
  // @see https://docs.ethers.io/v5/single-page/#/v5/migration/web3/-%23-migration-from-web3-js--contracts--overloaded-functions
  return contract["safeTransferFrom(address,address,uint256)"](owner, recipient, tokenId);
};

/**
 * ERC1155 balanceOf
 * @param library Etherjs provider
 * @param collectionAddress collection
 * @param tokenId string
 * @param owner string,
 * @returns BigNumber
 */
export const balanceOf = async (
  library: SupportedProviders,
  collectionAddress: string,
  tokenId: string,
  owner: string
): Promise<BigNumber> => {
  const contract = getContract(library, collectionAddress, ERC1155Abi);
  return await contract.balanceOf(owner, tokenId);
};

/**
 * ERC1155 safeTransferFrom
 * @param library Etherjs provider
 * @param collectionAddress collection
 * @param owner sender
 * @param recipient recipient
 * @param id the token id
 * @param amount the number of tokens to transfer
 * @returns string
 */
export const erc1155SafeTransferFrom = async (
  library: SupportedProviders,
  collectionAddress: string,
  owner: string,
  recipient: string,
  id: string,
  amount: number
): Promise<TransactionResponse> => {
  const contract = getContract(library, collectionAddress, ERC1155Abi, owner);
  return contract.safeTransferFrom(owner, recipient, id, amount, []);
};
