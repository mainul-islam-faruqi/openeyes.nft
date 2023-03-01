// import { ButtonProps, forwardRef } from "@chakra-ui/react";
// import { Button } from "uikit";



import { ButtonProps, forwardRef } from "@chakra-ui/react";
import { Button } from "uikit/Button/Button";


interface Props extends ButtonProps {
  isActive?: boolean;
}

export const ToggleListButton = forwardRef<Props, "div">(({ isActive, children, ...props }, ref) => {
  return (
    <Button
      color={isActive ? "link-01" : "text-02"}
      variant={isActive ? "solid" : "ghost"}
      colorScheme="secondary"
      bg={isActive ? "interactive-02" : "transparent"}
      borderColor="border-01"
      ref={ref}
      {...props}
    >
      {children}
    </Button>
  );
});
