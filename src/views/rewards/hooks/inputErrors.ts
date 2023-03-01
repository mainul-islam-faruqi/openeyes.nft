import { BigNumber, constants } from "ethers";
import { useTranslation } from "next-i18next";
import { fromDecimals } from "utils/format";
import { numberInputErrorCheck, NumberInputErrorType } from "utils/numberInputErrorCheck";

const LOOKS_STAKING_MINIMUM = constants.WeiPerEther; // 1 LOOKS

interface StakeProps {
  inputValue: string;
  max?: BigNumber;
  min?: BigNumber;
}

export const useStakeInputError = ({ inputValue, max, min = LOOKS_STAKING_MINIMUM }: StakeProps) => {
  const { t } = useTranslation();

  return numberInputErrorCheck(inputValue, {
    max,
    min,
    errorMessages: {
      [NumberInputErrorType.BELOW_MIN]: t("When staking, the amount must be at least {{amount}} {{token}}", {
        amount: "1",
        token: "LOOKS",
      }),
      [NumberInputErrorType.ABOVE_MAX]: t("Insufficient {{token}} balance", { token: "LOOKS" }),
      [NumberInputErrorType.INVALID_INPUT]: t("Please enter a valid number"),
    },
  });
};

interface UnstakeProps {
  inputValue: string;
  min: BigNumber;
  max?: BigNumber;
}

export const useUnstakeInputError = ({ inputValue, max, min }: UnstakeProps) => {
  const { t } = useTranslation();

  return numberInputErrorCheck(inputValue, {
    max,
    min,
    errorMessages: {
      [NumberInputErrorType.ABOVE_MAX]: t("Insufficient staked balance"),
      [NumberInputErrorType.BELOW_MIN]: t("Minimum withdrawal amount is {{amount}} {{token}}", {
        amount: fromDecimals(min),
        token: "LOOKS",
      }),
      [NumberInputErrorType.INVALID_INPUT]: t("Please enter a valid number"),
    },
  });
};
