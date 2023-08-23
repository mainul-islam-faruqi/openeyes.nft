import { forwardRef, Input as ChakraInput, InputProps as ChakraInputProps } from "@chakra-ui/react";

export const Input = forwardRef<ChakraInputProps, "input">((props, ref) => <ChakraInput ref={ref} {...props} />);
