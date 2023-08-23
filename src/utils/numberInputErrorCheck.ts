import { BigNumber } from "ethers";
import { toDecimals } from "utils/format";

export enum NumberInputErrorType {
  BELOW_MIN = "BELOW_MIN",
  ABOVE_MAX = "ABOVE_MAX",
  INVALID_INPUT = "INVALID_INPUT",
  REQUIRED = "REQUIRED",
}

interface NumberInputError {
  type: NumberInputErrorType;
  message?: string;
}

interface NumberInputOptions {
  max?: BigNumber;
  min?: BigNumber;
  required?: boolean;
  errorMessages?: {
    [NumberInputErrorType.BELOW_MIN]?: string;
    [NumberInputErrorType.ABOVE_MAX]?: string;
    [NumberInputErrorType.INVALID_INPUT]?: string;
  };
}

/**
 * Return NumberInputError based on whether value is valid and within defined min/max range
 * @param inputValue string numeric input value
 * @param max BigNumber
 * @param min BigNumber
 * @returns NumberInputErrorType enum
 */
export const numberInputErrorCheck = (
  inputValue: string,
  options?: NumberInputOptions
): NumberInputError | undefined => {
  const { min, max, required = false, errorMessages } = options || {};
  try {
    // No need to validate an empty string that is not required
    if (!inputValue && !required) {
      return;
    }

    if (!inputValue && required) {
      return {
        type: NumberInputErrorType.INVALID_INPUT,
        message: errorMessages?.INVALID_INPUT,
      };
    }

    const valueAsDecimal = toDecimals(inputValue);

    if (min && valueAsDecimal.lt(min)) {
      return { type: NumberInputErrorType.BELOW_MIN, message: errorMessages?.BELOW_MIN };
    }

    if (max && valueAsDecimal.gt(max)) {
      return { type: NumberInputErrorType.ABOVE_MAX, message: errorMessages?.ABOVE_MAX };
    }
    return;
  } catch {
    return {
      type: NumberInputErrorType.INVALID_INPUT,
      message: errorMessages?.INVALID_INPUT,
    };
  }
};
