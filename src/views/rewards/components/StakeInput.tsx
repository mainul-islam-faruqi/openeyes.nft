import { Flex, FlexProps, InputGroup, InputRightElement, ButtonProps } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { Button, NumberInput, NumberInputProps } from "uikit";
import { parseInputToSafeDecimals } from "utils/guards";

export interface StakeInputProps extends NumberInputProps {
  onMaxValue?: () => void;
  onSubmit?: () => void;
  buttonText?: string;
  isLoading?: boolean;
  isInvalid?: boolean;
  disabled?: boolean;
  wrapperProps?: FlexProps;
  buttonProps?: ButtonProps;
}

export const StakeInput = ({
  onMaxValue,
  onSubmit,
  buttonText,
  isLoading,
  isInvalid,
  disabled,
  wrapperProps,
  buttonProps,
  onTextChange,
  ...props
}: StakeInputProps) => {
  const { t } = useTranslation();

  const handleChange = (newValue: string) => {
    return onTextChange(parseInputToSafeDecimals(newValue));
  };

  return (
    <Flex {...wrapperProps}>
      <InputGroup>
        <NumberInput pr={16} isInvalid={isInvalid} onTextChange={handleChange} {...props} />
        <InputRightElement mr={4}>
          <Button size="xs" variant="ghost" colorScheme="gray" disabled={disabled} onClick={onMaxValue}>
            {t("Max")}
          </Button>
        </InputRightElement>
      </InputGroup>
      <Button
        isLoading={isLoading}
        disabled={disabled || !props.value || isInvalid}
        square
        {...buttonProps}
        onClick={onSubmit}
      >
        {buttonText || t("Stake")}
      </Button>
    </Flex>
  );
};
