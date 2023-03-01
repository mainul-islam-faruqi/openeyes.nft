import { SupportedChainId } from "@looksrare/sdk";

/**
 * Prompt the user to add a custom token to metamask
 * @param tokenAddress
 * @param tokenSymbol
 * @param tokenDecimals
 * @param tokenImageSrc
 * @returns {boolean} true if the token has been added, false otherwise
 */
export const addTokenToWallet = async (
  tokenAddress: string,
  tokenSymbol: string,
  tokenDecimals: number,
  tokenImageSrc: string
) => {
  const tokenAdded = await window.ethereum?.request({
    method: "wallet_watchAsset",
    params: {
      type: "ERC20",
      options: {
        address: tokenAddress,
        symbol: tokenSymbol,
        decimals: tokenDecimals,
        image: tokenImageSrc,
      },
    },
  });

  return tokenAdded;
};

/**
 * Switch the wallet to the provided chain
 * @param chainId SupportedChainId
 * @returns true if the request was sucessful
 */
export const switchNetwork = async (chainId: SupportedChainId): Promise<boolean> => {
  const res = await window.ethereum?.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: `0x${chainId.toString(16)}` }],
  });
  return res === null;
};
