import React from "react";
import { Flex, CheckboxProps } from "@chakra-ui/react";
import { BigNumber } from "ethers";
import { Text, CheckboxCard } from "uikit";
import { useTranslation } from "react-i18next";
import { formatToSignificant } from "utils/format";
import { currenciesMapBySymbol } from "config/currencies";
import { Currency } from "types/config";

interface Props extends CheckboxProps {
  isChecked: boolean;
  onCheck?: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  userBalance?: BigNumber;
  currency: Currency;
}

const CurrencyCheckbox: React.FC<Props> = ({ isChecked, onCheck, userBalance, currency, ...props }) => {
  const { t } = useTranslation();
  // @ts-ignore
  const { icon: Icon, symbol } = currenciesMapBySymbol[currency];

  const isDisabled = !onCheck || userBalance?.isZero();

  return (
    <CheckboxCard
      disabled={isDisabled}
      isChecked={isChecked}
      onChange={(e) => onCheck && !isDisabled && onCheck(e.target.checked)}
      {...props}
    >
      <Flex>
        <Icon mr={2} />
        <Flex flexDirection="column">
          <Text bold>{symbol}</Text>
          <Text>
            {t("Balance")} {userBalance && formatToSignificant(userBalance, 6)}
          </Text>
        </Flex>
      </Flex>
    </CheckboxCard>
  );
};

export default CurrencyCheckbox;
