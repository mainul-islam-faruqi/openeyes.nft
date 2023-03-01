import { Box, Flex, FlexProps, InputProps } from "@chakra-ui/react";
import { EthIcon, NumberInput, NumberInputProps } from "uikit";

interface InputWithIconProps extends FlexProps {
  inputProps: InputProps;
  onTextChange: NumberInputProps["onTextChange"];
}

export const InputWithIcon = ({ inputProps, onTextChange, ...props }: InputWithIconProps) => {
  return (
    <Flex alignItems="stretch" outline="1px solid" outlineColor="border-01" borderRadius="4px" {...props}>
      <NumberInput size="sm" height="auto" onTextChange={onTextChange} {...inputProps} />
      <Box px={3} py={2}>
        <EthIcon boxSize={5} />
      </Box>
    </Flex>
  );
};
