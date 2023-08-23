import { BigNumber, BigNumberish } from "ethers";
import { getAddress } from "ethers/lib/utils";
import { TokenOwner } from "types/graphql";

type Stringish = string | undefined | null;

/**
 * Evaluates for falsy addresses and then compares whether two checksummed addresses are equal
 * @param address1
 * @param address2
 * @returns {boolean}
 */
export const isAddressEqual = (address1: Stringish, address2: Stringish) => {
  if (!address1 || !address2) {
    return false;
  }

  return getAddress(address1) === getAddress(address2);
};

/**
 * Evaluates for falsy arguments and then whether an address exists in an array of owners and has a balance greater than 1
 * @param address
 * @param owners
 * @returns {boolean}
 */
export const isAddressOneOfOwners = (address: Stringish, owners: TokenOwner[]) => {
  if (!owners || !address) {
    return false;
  }

  const matchedOwner = owners.find((owner) => isAddressEqual(owner.address, address));
  if (matchedOwner) {
    return matchedOwner.balance > 0;
  } else {
    return false;
  }
};

/**
 * Ensure a numeric input string doesn't exceed safeDecimals on either side of the decimal pt
 * @param value
 * @params safeIntegers max permissable integers
 * @param decimals max permissable decimals
 * @returns string
 */
export const parseInputToSafeDecimals = (value: string, safeIntegers = 9, safeDecimals = 18) => {
  const [beforeDecimal, afterDecimal] = value.split(".");
  if (value === ".") {
    return "0.";
  }

  const countAfterDecimal = afterDecimal ? afterDecimal.length : 0;
  const countBeforeDecimal = beforeDecimal ? beforeDecimal.length : 0;
  const integerDigits = beforeDecimal && beforeDecimal.substring(0, safeIntegers);
  const decimalDigits = afterDecimal && afterDecimal.substring(0, safeDecimals);

  // Integer digit length is greater than safeDecimals
  if (countBeforeDecimal > safeIntegers) {
    if (countAfterDecimal > safeDecimals) {
      return `${integerDigits}.${decimalDigits}`;
    }
    return `${integerDigits}${afterDecimal ? `.${afterDecimal}` : ""}`;
  }

  // Decimal digit length is greater than safeDecimals
  if (countAfterDecimal > safeDecimals) {
    if (countBeforeDecimal > safeIntegers) {
      return `${integerDigits}.${decimalDigits}`;
    }
    return `${beforeDecimal}.${decimalDigits}`;
  }

  return value;
};

/**
 * Check if the input number is a valid BigNumber
 * @param number BigNumberish
 * @returns boolean
 */
export const isValidBigNumber = (number: BigNumberish): boolean => {
  try {
    return BigNumber.isBigNumber(BigNumber.from(number));
  } catch (error) {
    return false;
  }
};
