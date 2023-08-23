// import { ButtonProps, forwardRef } from "@chakra-ui/react";
// import { Button } from "uikit";


import { ButtonProps, forwardRef } from "@chakra-ui/react";
import { Button } from "uikit/Button/Button";



interface Props extends ButtonProps {
  isActive?: boolean;
}

export const SwitchButton = forwardRef<Props, "div">(({ isActive, colorScheme, children, ...props }, ref) => {
  return (
    <Button
      colorScheme={colorScheme || (isActive ? "white" : "secondary")}
      variant={isActive ? "solid" : "outline"}
      flex="1"
      ref={ref}
      square
      {...props}
    >
      {children}
    </Button>
  );
});
