// import { useRef, useState } from "react";
// import { useTranslation } from "react-i18next";
// import debounce from "lodash/debounce";
// import { Grid, Flex, GridItem } from "@chakra-ui/react";
// import { EthIcon, NumberInput, Text } from "uikit";
// import { parseInputToSafeDecimals } from "utils/guards";
// import { BasicFilter } from "./BasicFilter";





import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import debounce from "lodash/debounce";
import { Grid, Flex, GridItem } from "@chakra-ui/react";
import { EthIcon } from "uikit";
import { NumberInput } from "uikit/Input/NumberInput";
import { Text } from "uikit/Text/Text";
import { parseInputToSafeDecimals } from "utils/guards";
import { BasicFilter } from "./BasicFilter";




interface PriceRangeFilterProps {
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  initialMin?: string;
  initialMax?: string;
}

const isValidMinNumber = (minStr: string, maxStr: string) => {
  // No validation required
  if (minStr === "") {
    return true;
  }

  const min = parseFloat(minStr);
  const max = parseFloat(maxStr);

  if (maxStr !== "" && max < min) {
    return false;
  }

  return min >= 0;
};

const isValidMaxNumber = (minStr: string, maxStr: string) => {
  // No validation required
  if (maxStr === "") {
    return true;
  }

  const min = parseFloat(minStr);
  const max = parseFloat(maxStr);

  if (minStr !== "" && min > max) {
    return false;
  }

  return true;
};

export const PriceRangeFilter = ({
  onMinPriceChange,
  onMaxPriceChange,
  initialMin = "",
  initialMax = "",
}: PriceRangeFilterProps) => {
  const { t } = useTranslation();
  const [min, setMin] = useState(initialMin);
  const [max, setMax] = useState(initialMax);
  const [isValidMinMax, setIsValidMinMax] = useState({ min: true, max: true });

  const debouncedOnMaxPriceChange = useRef(debounce(onMaxPriceChange, 150));
  const debouncedOnMinPriceChange = useRef(debounce(onMinPriceChange, 150));

  const handleMinValueChange = (value: string) => {
    const isValid = isValidMinNumber(value, max);
    const safeValue = parseInputToSafeDecimals(value);

    setMin(safeValue);
    setIsValidMinMax({
      min: isValid,
      max: isValidMaxNumber(value, max),
    });

    // Do not trigger callbacks if the number is not valid
    if (isValid) {
      debouncedOnMinPriceChange.current(safeValue);
    }
  };

  const handleMaxValueChange = (value: string) => {
    const isValid = isValidMaxNumber(min, value);
    const safeValue = parseInputToSafeDecimals(value);

    setMax(safeValue);
    setIsValidMinMax({
      min: isValidMinNumber(min, value),
      max: isValid,
    });

    // Do not trigger callbacks if the number is not valid
    if (isValid) {
      debouncedOnMaxPriceChange.current(safeValue);
    }
  };

  return (
    <BasicFilter bg="ui-01">
      <Grid display={"grid"} gridTemplateAreas="'a a a' 'b c d'" rowGap={2} columnGap={2} whiteSpace="nowrap" py={3}>
        <GridItem gridArea="a">
          <Text textStyle="helper">{t("Price Range")}</Text>
        </GridItem>
        <GridItem gridArea="b">
          <NumberInput
            onTextChange={handleMinValueChange}
            placeholder="Low"
            value={min}
            isInvalid={!isValidMinMax.min}
            height="40px"
          />
        </GridItem>
        <GridItem gridArea="c">
          <NumberInput
            onTextChange={handleMaxValueChange}
            placeholder="High"
            value={max}
            isInvalid={!isValidMinMax.max}
            height="40px"
          />
        </GridItem>
        <GridItem gridArea="d">
          <Flex height="100%" alignItems="center">
            <EthIcon />
          </Flex>
        </GridItem>
      </Grid>
    </BasicFilter>
  );
};
