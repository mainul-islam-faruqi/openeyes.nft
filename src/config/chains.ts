import { CHAIN_INFO, SupportedChainId } from "@looksrare/sdk";

if (!process.env.APP_CHAIN_ID) {
  // throw new Error(`Set you env var (see readme) ${process.env.APP_CHAIN_ID}`);
}

export const APP_CHAIN_ID = parseInt(process.env.APP_CHAIN_ID || "", 10) as SupportedChainId;
export const currentChainInfo = CHAIN_INFO[APP_CHAIN_ID];
export const rpcUrl = `${currentChainInfo?.rpcUrl}${process.env.ALCHEMY_KEY ? `/${process.env.ALCHEMY_KEY}` : ""}`;
