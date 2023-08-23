import { BigNumber } from "ethers";
import { toDecimals } from "utils/format";
import { useCalculateAggregatorSharePriceInLOOKS, useViewTotalAggregatorShares } from "./calls/useAggregatorUniswapV3";
import { useCalculateSharePriceInLOOKS, useViewTotalShares } from "./calls/useFeeSharingSystem";
import { useCoinPrices } from "./useCoinPrices";

interface Tvl {
  tvlInLOOKS: BigNumber | undefined;
  tvlInUSD: BigNumber | undefined;
}

const useLOOKSPriceUSDWei = (): BigNumber | undefined => {
  const coinPricesQuery = useCoinPrices();
  const looksPriceUSDWei = coinPricesQuery.isSuccess ? toDecimals(coinPricesQuery.data.looks.toString()) : undefined;
  return looksPriceUSDWei;
};

export const useAggregatorLOOKSTvl = (): Tvl => {
  const sharePriceQuery = useCalculateAggregatorSharePriceInLOOKS();
  const totalSharesQuery = useViewTotalAggregatorShares();
  const looksPriceUSDWei = useLOOKSPriceUSDWei();

  const tvlInLOOKS =
    sharePriceQuery.isSuccess && totalSharesQuery.isSuccess
      ? sharePriceQuery.data.mul(totalSharesQuery.data).div(toDecimals("1"))
      : undefined;

  const tvlInUSD = tvlInLOOKS && looksPriceUSDWei ? tvlInLOOKS.mul(looksPriceUSDWei).div(toDecimals("1")) : undefined;
  return { tvlInLOOKS, tvlInUSD };
};

export const useFeeSharingLOOKSTvl = (): Tvl => {
  const sharePriceQuery = useCalculateSharePriceInLOOKS();
  const totalSharesQuery = useViewTotalShares();
  const looksPriceUSDWei = useLOOKSPriceUSDWei();

  const tvlInLOOKS =
    sharePriceQuery.isSuccess && totalSharesQuery.isSuccess
      ? sharePriceQuery.data.mul(totalSharesQuery.data).div(toDecimals("1"))
      : undefined;

  const tvlInUSD = tvlInLOOKS && looksPriceUSDWei ? tvlInLOOKS.mul(looksPriceUSDWei).div(toDecimals("1")) : undefined;
  return { tvlInLOOKS, tvlInUSD };
};
