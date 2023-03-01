import { BigNumber } from "ethers";
import { toDecimals } from "utils/format";

/**
 * Return number of shares equivalent to an amount of LOOKS given the share price in LOOKS
 * @param sharePriceInLooks BigNumber
 * @param amountLooks BigNumber
 * @returns BigNumber
 */
export const getSharesFromLooks = (sharePriceInLooks: BigNumber, amountLooks: BigNumber): BigNumber => {
  const amountLooksPow18 = amountLooks.mul(toDecimals("1"));
  const shareValueOfLooks = amountLooksPow18.div(sharePriceInLooks);

  return shareValueOfLooks;
};
