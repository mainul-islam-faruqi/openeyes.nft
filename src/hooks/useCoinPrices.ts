import { useQuery, UseQueryOptions } from "react-query";
import { COIN_GECKO_API_URL } from "config/urls";

interface GeckoApiResponse {
  ethereum: {
    usd: number;
  };
  looksrare: {
    usd: number;
  };
}

interface CoinPriceResponse {
  eth: number;
  looks: number;
}

/**
 * @see https://www.coingecko.com/en/api/documentation
 *
 * Supported Coins
 * @see https://api.coingecko.com/api/v3/coins/list
 *
 * Supported currencies
 * @see https://api.coingecko.com/api/v3/simple/supported_vs_currencies
 *
 * Price of ETH in USD
 * @see https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd
 *
 */
export const useCoinPrices = (options?: UseQueryOptions<CoinPriceResponse, any, CoinPriceResponse>) => {
  return useQuery<CoinPriceResponse>(
    "coin-gecko-prices",
    async () => {
      const response = await fetch(`${COIN_GECKO_API_URL}/simple/price?ids=ethereum,looksrare&vs_currencies=usd`);
      const data: GeckoApiResponse = await response.json();
      return { eth: data.ethereum.usd, looks: data.looksrare.usd };
    },
    options
  );
};
