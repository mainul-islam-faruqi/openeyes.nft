import { useActiveProvider } from "hooks/useActiveProvider";
import { addresses } from "config/addresses";
import { BigNumber, FixedNumber } from "ethers";
import { useQuery } from "react-query";
import { SupportedProviders } from "types/config";
import { balanceOf, totalSupply } from "utils/calls/erc20";
import { toDecimals } from "utils/format";

interface LpPrices {
  lpTotalSupply?: BigNumber;
  lpPriceWeth?: BigNumber;
  lpPriceLooks?: BigNumber;
  wethPriceInLooks?: BigNumber;
  looksPriceInWeth?: BigNumber;
  isSuccess: boolean;
  isLoading: boolean;
}

interface QueryProps {
  wethLpBalance: BigNumber;
  looksLpBalance: BigNumber;
  lpTotalSupply: BigNumber;
}

const fetcher = async (library: SupportedProviders) => {
  const wethLpBalance = await balanceOf(library, addresses.WETH, addresses.LOOKS_LP);
  const looksLpBalance = await balanceOf(library, addresses.LOOKS, addresses.LOOKS_LP);
  const lpTotalSupply = await totalSupply(library, addresses.LOOKS_LP);
  return { wethLpBalance, looksLpBalance, lpTotalSupply };
};

const useData = () => {
  const library = useActiveProvider();
  return useQuery<QueryProps>("lp-price", () => fetcher(library));
};

export const useLooksLpPrice = (): LpPrices => {
  const { data, isSuccess, isLoading } = useData();
  const { wethLpBalance, looksLpBalance, lpTotalSupply } = data || {};

  // lp token price in looks & weth
  const twiceLooksLpBalance = looksLpBalance && looksLpBalance.mul(2);
  const twiceWethLpBalance = wethLpBalance && wethLpBalance.mul(2);

  try {
    const looksPerLpTokenUnsafe =
      twiceLooksLpBalance &&
      lpTotalSupply &&
      FixedNumber.from(twiceLooksLpBalance).divUnsafe(FixedNumber.from(lpTotalSupply));
    const wethPerLpTokenUnsafe =
      twiceWethLpBalance &&
      lpTotalSupply &&
      FixedNumber.from(twiceWethLpBalance).divUnsafe(FixedNumber.from(lpTotalSupply));

    const looksPerLpTokenInWei = looksPerLpTokenUnsafe && toDecimals(looksPerLpTokenUnsafe.toString());
    const wethPerLpTokenInWei = wethPerLpTokenUnsafe && toDecimals(wethPerLpTokenUnsafe.toString());

    // weth / looks prices
    const wethPriceLooks =
      looksPerLpTokenUnsafe && wethPerLpTokenUnsafe && looksPerLpTokenUnsafe.divUnsafe(wethPerLpTokenUnsafe);
    const looksPriceWeth =
      looksPerLpTokenUnsafe && wethPerLpTokenUnsafe && wethPerLpTokenUnsafe.divUnsafe(looksPerLpTokenUnsafe);
    const wethPriceLooksInWei = wethPriceLooks && toDecimals(wethPriceLooks.toString());
    const looksPriceWethInWei = looksPriceWeth && toDecimals(looksPriceWeth.toString());

    return {
      lpPriceLooks: looksPerLpTokenInWei,
      lpPriceWeth: wethPerLpTokenInWei,
      lpTotalSupply,
      wethPriceInLooks: wethPriceLooksInWei,
      looksPriceInWeth: looksPriceWethInWei,
      isSuccess,
      isLoading,
    };
  } catch {
    return {
      lpPriceLooks: undefined,
      lpPriceWeth: undefined,
      lpTotalSupply: undefined,
      wethPriceInLooks: undefined,
      looksPriceInWeth: undefined,
      isSuccess,
      isLoading,
    };
  }
};
