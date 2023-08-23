import {
  forwardRef,
  Flex,
  MenuButtonProps as ChakraMenuButtonProps,
  MenuButton as ChakraMenuButton,
} from "@chakra-ui/react";
import { ChevronDown, ChevronUp } from "..";

interface MenuButtonProps extends ChakraMenuButtonProps {
  isOpen: boolean;
}

export const MenuButton = forwardRef<MenuButtonProps, "div">(({ children, isOpen, disabled, ...props }, ref) => {
  const defaultProps = {
    ref,
    cursor: disabled ? "not-allowed" : "pointer",
    color: disabled ? "text-03" : "text-01",
    disabled,
    "data-id": "menu-button",
  };

  return (
    <>
      {props.as ? (
        <ChakraMenuButton {...defaultProps} {...props}>
          {children}
        </ChakraMenuButton>
      ) : (
        <ChakraMenuButton {...defaultProps} {...props}>
          <Flex alignItems="center" justifyContent="space-between">
            {children} {isOpen ? <ChevronUp /> : <ChevronDown />}
          </Flex>
        </ChakraMenuButton>
      )}
    </>
  );
});
