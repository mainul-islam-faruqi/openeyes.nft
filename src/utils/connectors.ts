import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { ethers } from "ethers";
import { rpcUrl, APP_CHAIN_ID } from "config/chains";
// import { rpcUrl, APP_CHAIN_ID, PROVIDER_POLLING_INTERVAL_MS } from "config/chains";

// Reformat chain info for connectors
const RPC_URLS_BY_CHAIN_ID: { [chainId: number]: string } = { [APP_CHAIN_ID]: rpcUrl };

export const injected = new InjectedConnector({
  supportedChainIds: [APP_CHAIN_ID],
});

export const walletconnect = new WalletConnectConnector({
  supportedChainIds: [APP_CHAIN_ID],
  rpc: RPC_URLS_BY_CHAIN_ID,
  qrcode: true,
});

export const walletlink = new WalletLinkConnector({
  supportedChainIds: [APP_CHAIN_ID],
  url: RPC_URLS_BY_CHAIN_ID[APP_CHAIN_ID],
  appName: "web3-react-looksrare",
});

export function getLibrary(
  provider: ethers.providers.ExternalProvider | ethers.providers.JsonRpcFetchFunc
): ethers.providers.Web3Provider {
  const library = new ethers.providers.Web3Provider(provider, APP_CHAIN_ID);
  // library.pollingInterval = PROVIDER_POLLING_INTERVAL_MS;
  return library;
}
