import { InputProps, useBreakpointValue } from "@chakra-ui/react";
import { ChangeEventHandler } from "react";
import { Input } from "./Input";

export const onlyDecimalsRegExp = new RegExp(/^\d*\.?\d*$/);

export interface NumberInputProps extends Omit<InputProps, "onChange" | "type"> {
  onTextChange: (value: string) => void;
}

export const NumberInput = ({ onTextChange, ...props }: NumberInputProps) => {
  const inputType = useBreakpointValue({
    base: "number",
    md: "text",
  });

  const handleChange: ChangeEventHandler<HTMLInputElement> = (evt) => {
    const { value } = evt.target;
    if (value === "" || onlyDecimalsRegExp.test(value)) {
      onTextChange(value);
    }
  };

  return <Input type={inputType} onChange={handleChange} {...props} />;
};
