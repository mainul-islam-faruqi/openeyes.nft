export const JWT_COOKIE = "looksauth_";

export const MINIMUM_COLLECTION_OFFER = "10000000000000000"; // 0.01 ETH
export const MINIMUM_STANDARD_OFFER = "100000000000000"; // 0.0001 ETH
export const MINIMUM_LISTING_PRICE = "100000000000000"; // 0.0001 ETH
export const PROVIDER_POLLING_INTERVAL_MS = 12000;

// Difference in percentage points
export const LOW_FLOOR_THRESHOLD = -2;
export const HIGH_FLOOR_THRESHOLD = -20;

/* Polling intervals */
export const CONTRACT_BALANCE_INTERVAL = 30 * 1000; // 30 seconds
export const ETH_AVG_BLOCK_TIME_MS = 13000; // 13 seconds

/**
 * Max fee you can set on a collection 1500 = 15%, 9500 = 95%
 *
 * NOTE: This value might be different for other environments. At the time of writing this
 * the max royalty fee for local (Hardhat) is 15%
 */
export const ROYALTY_MAX_FEE = "9500";
export const ROYALTY_FEE_WARNING_THRESHOLD = "1000"; // 10%

/* Pagination */
export const EVENTS_PER_PAGE = 20;
export const ORDERS_PER_PAGE = 20;
export const TOKENS_PER_PAGE = 16;
export const TOKENS_WITH_BIDS_PER_PAGE = 20;
export const USER_PROFILE_AVATAR_NFTS_PER_PAGE = 16;
export const COLLECTIONS_TO_FETCH_FOR_HOME = 10;
export const COLLECTION_ROYALTIES_TO_FETCH = 20;
export const COLLECTION_LEADERBOARD_TO_FETCH = 30;

/* Trading Rewards Timer (UTC times) */
export const DAILY_TRADING_REWARD_PAUSE_UTC = { h: 9, m: 0, s: 0 };
export const DAILY_TRADING_REWARD_DISTRIBUTION_UTC = { h: 11, m: 0, s: 0 };

/* Listing Rewards */
export const DAILY_LISTING_REWARD_INTERVAL = 10; // minutes
export const DAILY_LOOKS_DISTRIBUTED = 250000;
export const DAILY_FLOOR_THRESHOLD = 1.5; // floor multiplier e.g. 1.5x
export const TRADING_REWARD_CLAIM_DEADLINE = "Fri, April 22nd 9:00 UTC";
export const TRADING_REWARDS_TREE_ID = 0;
export const LISTING_REWARDS_TREE_ID = 1;

// This variable is used to enforce a slippage of 15% on all orders because a lot of collection won't have fees,
// orders will become invalid when they add fees
export const minNetPriceRatio = 8500;
