import { forwardRef, Checkbox as ChakraCheckbox, CheckboxProps as ChakraCheckboxProps } from "@chakra-ui/react";

const Checkbox = forwardRef<ChakraCheckboxProps, "div">(({ ...props }, ref) => <ChakraCheckbox ref={ref} {...props} />);

export default Checkbox;
