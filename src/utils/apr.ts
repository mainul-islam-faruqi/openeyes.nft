import { FixedNumber, BigNumber, BigNumberish, constants } from "ethers";

const AVG_BLOCKS_PER_YEAR = 2102400;

/**
 * Return APR as a %
 * @param stakingTokenPriceInRewardToken BigNumberish staking token price relative to reward token, in WEI
 * @param rewardTokensPerBlock BigNumber
 * @param totalStakedTokens BigNumber
 * @returns number APR as percentage
 */
export const getApr = (
  stakingTokenPriceInRewardToken: BigNumberish,
  rewardTokensPerBlock: BigNumber,
  totalStakedTokens: BigNumber
): number | undefined => {
  const totalRewardTokensPerYearInWei = constants.WeiPerEther.mul(rewardTokensPerBlock.mul(AVG_BLOCKS_PER_YEAR));
  const relativeValueOfStakedTokensInWei = BigNumber.from(stakingTokenPriceInRewardToken).mul(totalStakedTokens);

  if (relativeValueOfStakedTokensInWei.isZero()) {
    return; // Prevent calc resulting in infinite number or div(0) math error
  }

  const apr = FixedNumber.from(totalRewardTokensPerYearInWei)
    .divUnsafe(FixedNumber.from(relativeValueOfStakedTokensInWei))
    .mulUnsafe(FixedNumber.from(100));

  return apr.toUnsafeFloat();
};

/**
 * Given APR, return APY as a %
 * @param apr number APR as percentage
 * @param compoundFrequency number compounds per day
 * @param days number days to compound for
 * @returns number APY as percentage
 */
export const getApy = (apr: number, compoundFrequency = 1, days = 365) => {
  const daysAsDecimalOfYear = days / 365;
  const aprAsDecimal = apr / 100;
  const timesCompounded = 365 * compoundFrequency;
  const apyAsDecimal = (1 + aprAsDecimal / timesCompounded) ** (timesCompounded * daysAsDecimalOfYear) - 1;

  return apyAsDecimal * 100;
};

/**
 * Given wethApy & looksApr, return a % according to the formula APY = (1 + WETH APY) * (1 + LOOKS APR) - 1
 * @param wethApy number as percentage
 * @param looksApr number as percentage
 * @returns number APY as percentage
 */
export const getAggregatorApy = (wethApy: number, looksApr: number): number => {
  const wethAsDecimal = wethApy / 100;
  const looksAsDecimal = looksApr / 100;
  const aggregatorApyAsDecimal = (1 + wethAsDecimal) * (1 + looksAsDecimal) - 1;
  return aggregatorApyAsDecimal * 100;
};
