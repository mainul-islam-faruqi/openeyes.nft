import { ChangeEvent, ReactNode } from "react";
import {
  InputGroup,
  InputGroupProps,
  InputProps,
  InputRightElement as ChakraInputRightElement,
  InputLeftElement as ChakraInputLeftElement,
} from "@chakra-ui/input";
import { Input } from "./Input";
import { SearchIcon, CloseIcon } from "..";
import { IconButton } from "@chakra-ui/button";

interface TextInputProps extends InputProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onClear?: () => void;
  placeholder?: string;
  InputLeftElement?: ReactNode;
  InputRightElement?: ReactNode;
  wrapperProps?: InputGroupProps;
}

export const TextInput: React.FC<TextInputProps> = ({
  placeholder = "",
  value,
  onChange,
  onClear,
  InputLeftElement = (
    <ChakraInputLeftElement pointerEvents="none">
      <SearchIcon color="text-01" />
    </ChakraInputLeftElement>
  ),
  InputRightElement = (
    <>
      {onClear && (
        <ChakraInputRightElement>
          <IconButton onClick={onClear} variant="ghost" colorScheme="gray" aria-label="clear search">
            <CloseIcon color="text-01" />
          </IconButton>
        </ChakraInputRightElement>
      )}
    </>
  ),
  wrapperProps,
  ...props
}) => {
  return (
    <InputGroup width={{ base: "100%", md: "280px" }} {...wrapperProps}>
      {InputLeftElement}
      <Input
        {...props}
        pl={InputLeftElement ? 12 : 4}
        pr={InputRightElement ? 12 : 4}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {InputRightElement}
    </InputGroup>
  );
};
