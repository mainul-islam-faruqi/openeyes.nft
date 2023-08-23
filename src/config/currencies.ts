import { ReactElement } from "react";
import { EthHalfIcon, WethHalfIcon } from "uikit";
import { IconProps } from "uikit/Icons/Icon";
import { CurrencyConfig, Currency } from "types/config";
import { isAddressEqual } from "utils/guards";
import { addresses, ETH_ADDRESS } from "./addresses";

const WETH: CurrencyConfig = {
  symbol: "WETH",
  icon: WethHalfIcon,
  decimals: 18,
  name: "Wrapped Ether",
};

const ETH: CurrencyConfig = {
  symbol: "ETH",
  icon: EthHalfIcon,
  decimals: 18,
  name: "Ethereum",
};

const currenciesMapByAddress: { [address: string]: CurrencyConfig } = {
  [addresses?.WETH]: WETH,
  [ETH_ADDRESS]: ETH,
};

// @ts-ignore
export const currenciesMapBySymbol: Record<Currency, CurrencyConfig> = {
  WETH,
  ETH,
};

/**
 * Return a currency object from its address
 * @param address
 * @param useEthForWeth For cases where we want to display ETH icon for WETH address
 * @returns CurrencyConfig
 */
export const getCurrencyConfig = (address: string, useEthForWeth = false) => {
  if (useEthForWeth && isAddressEqual(address, addresses.WETH)) {
    return currenciesMapByAddress[ETH_ADDRESS];
  }
  return currenciesMapByAddress[address] || currenciesMapByAddress[ETH_ADDRESS];
};
