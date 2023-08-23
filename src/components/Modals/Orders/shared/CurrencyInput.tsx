import React from "react";
import { useTranslation } from "react-i18next";
import { Grid, GridProps, Flex, InputProps, InputRightElement, InputGroup } from "@chakra-ui/react";
import { Text, NumberInput, Button } from "uikit";
import { currenciesMapBySymbol } from "config/currencies";
import { Currency } from "types/config";
import { parseInputToSafeDecimals } from "utils/guards";

interface CurrencyInputProps extends InputProps {
  price: string;
  setPrice: (inputValue: string) => void;
  onMax?: () => void;
  currency: Currency;
  info?: string;
  warning?: string;
  wrapperProps?: GridProps;
}

const CurrencyInput = ({
  price,
  setPrice,
  onMax,
  currency,
  warning,
  info,
  wrapperProps,
  ...props
}: CurrencyInputProps) => {
  const { t } = useTranslation();
  // @ts-ignore
  const { icon: Icon, symbol } = currenciesMapBySymbol[currency];

  return (
    <Grid templateColumns="1fr auto" templateRows={`1fr ${warning ? "auto" : "16px"}`} {...wrapperProps}>
      <InputGroup>
        <NumberInput
          placeholder={t("Input price")}
          value={price}
          onTextChange={(newValue) => setPrice(parseInputToSafeDecimals(newValue))}
          isInvalid={!!warning}
          paddingRight={onMax ? "60px" : 4}
          {...props}
        />
        {onMax && (
          <InputRightElement mr={2}>
            <Button size="xs" colorScheme="gray" variant="ghost" onClick={onMax}>
              {t("Max")}
            </Button>
          </InputRightElement>
        )}
      </InputGroup>
      <Flex alignItems="center" border="solid 1px" borderColor="border-01" borderLeft={0} px={4}>
        <Icon />
        <Text color="text-02">{symbol}</Text>
      </Flex>
      {warning && (
        <Text textStyle="helper" color="text-error" gridColumn="1" mt={2}>
          {warning}
        </Text>
      )}
      {info && (
        <Text textStyle="helper" color="text-02" gridColumn="1" mt={2}>
          {info}
        </Text>
      )}
    </Grid>
  );
};

export default CurrencyInput;
