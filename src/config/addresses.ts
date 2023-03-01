import { SupportedChainId, addressesByNetwork, Addresses } from "@looksrare/sdk";
// @ts-ignore
import { Strategy } from "types/config";
import { APP_CHAIN_ID } from "./chains";

export const ETH_ADDRESS = "0x0000000000000000000000000000000000000000";

const hardhatAddresses: Addresses = {
  LOOKS: process.env.LOOKS_RARE_TOKEN_ADDRESS || "",
  LOOKS_LP: process.env.MOCK_LP_ADDRESS,
  WETH: process.env.WETH_ADDRESS,
  ROYALTY_FEE_MANAGER: process.env.ROYALTY_FEE_MANAGER_ADDRESS,
  ROYALTY_FEE_REGISTRY: process.env.ROYALTY_FEE_REGISTRY_ADDRESS,
  ROYALTY_FEE_SETTER: process.env.ROYALTY_FEE_SETTER_ADDRESS,
  EXCHANGE: process.env.EXCHANGE_ADDRESS,
  TRANSFER_MANAGER_ERC721: process.env.TRANSFER_MANAGER_ERC721_ADDRESS,
  TRANSFER_MANAGER_ERC1155: process.env.TRANSFER_MANAGER_ERC1155_ADDRESS,
  TRANSFER_SELECTOR_NFT: process.env.TRANSFER_SELECTOR_NFT_ADDRESS,
  STRATEGY_STANDARD_SALE: process.env.STRATEGY_STANDARD_SALE_ADDRESS,
  STRATEGY_COLLECTION_SALE: process.env.STRATEGY_COLLECTION_SALE_ADDRESS,
  STRATEGY_PRIVATE_SALE: process.env.STRATEGY_PRIVATE_SALE_ADDRESS,
  STRATEGY_DUTCH_AUCTION: process.env.STRATEGY_DUTCH_AUCTION_ADDRESS,
  PRIVATE_SALE_WITH_FEE_SHARING: process.env.PRIVATE_SALE_WITH_FEE_SHARING_ADDRESS,
  FEE_SHARING_SYSTEM: process.env.FEE_SHARING_SYSTEM_ADDRESS,
  STAKING_POOL_FOR_LOOKS_LP: process.env.STAKING_POOL_FOR_LOOKS_LP_ADDRESS,
  TOKEN_DISTRIBUTOR: process.env.TOKEN_DISTRIBUTOR_ADDRESS,
  TRADING_REWARDS_DISTRIBUTOR: "",
  MULTI_REWARDS_DISTRIBUTOR: "",
  MULTICALL2: "",
  REVERSE_RECORDS: "",
  AGGREGATOR_UNISWAP_V3: process.env.AGGREGATOR_UNISWAP_V3_ADDRESS,
};

const addressesByNetworkWithHardhat: { [chainId in SupportedChainId]: Addresses } = {
  ...addressesByNetwork,
  [SupportedChainId.HARDHAT]: hardhatAddresses,
};

export const addresses = addressesByNetworkWithHardhat[APP_CHAIN_ID];

export const STRATEGIES_ADDRESS: Record<Strategy, string> = {
  standard: addresses?.STRATEGY_STANDARD_SALE,
  collection: addresses?.STRATEGY_COLLECTION_SALE,
  private: addresses?.STRATEGY_PRIVATE_SALE,
  dutchAuction: addresses?.STRATEGY_DUTCH_AUCTION,
};
