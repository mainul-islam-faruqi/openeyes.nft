import { useMemo } from "react";
import { useWeb3React } from "@web3-react/core";
import { Web3ReactContextInterface } from "@web3-react/core/dist/types";
import { Web3Provider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { rpcUrl, APP_CHAIN_ID } from "config/chains";
import { PROVIDER_POLLING_INTERVAL_MS } from "config/constants";

/**
 * Return the wallet provider if the user is connected, or the static provider otherwise
 * This hook is meant to be used to fetch data when the user is disconnected
 * @returns The active provider
 */
export const useActiveProvider = (): Web3Provider | StaticJsonRpcProvider => {
  const context: Web3ReactContextInterface<Web3Provider> = useWeb3React();
  const library = useMemo(() => {
    const jsonRpcProvider = new StaticJsonRpcProvider(rpcUrl, APP_CHAIN_ID);
    jsonRpcProvider.pollingInterval = PROVIDER_POLLING_INTERVAL_MS;
    return jsonRpcProvider;
  }, []);
  return context.active && context.library ? context.library : library;
};
