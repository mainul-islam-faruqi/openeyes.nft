import { SupportedChainId } from "@looksrare/sdk";

enum MainnetIndices {
  TOKENS = "prod_tokens",
  COLLECTIONS = "prod_collections",
  USERS = "prod_users",
}

enum RinkebyIndices {
  TOKENS = "dev_tokens",
  COLLECTIONS = "dev_collections",
  USERS = "dev_users",
}

enum HardhatIndices {
  TOKENS = "",
  COLLECTIONS = "",
  USERS = "",
}

export type AlgoliaIndex = MainnetIndices | RinkebyIndices | HardhatIndices;

export const ALGOLIA_TOKENS_INDEX = {
  [SupportedChainId.MAINNET]: MainnetIndices.TOKENS,
  [SupportedChainId.RINKEBY]: RinkebyIndices.TOKENS,
  [SupportedChainId.HARDHAT]: HardhatIndices.TOKENS,
};

export const ALGOLIA_COLLECTIONS_INDEX = {
  [SupportedChainId.MAINNET]: MainnetIndices.COLLECTIONS,
  [SupportedChainId.RINKEBY]: RinkebyIndices.COLLECTIONS,
  [SupportedChainId.HARDHAT]: HardhatIndices.COLLECTIONS,
};

export const ALGOLIA_USERS_INDEX = {
  [SupportedChainId.MAINNET]: MainnetIndices.USERS,
  [SupportedChainId.RINKEBY]: RinkebyIndices.USERS,
  [SupportedChainId.HARDHAT]: HardhatIndices.USERS,
};
