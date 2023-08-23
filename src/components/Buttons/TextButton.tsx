// import { ButtonProps, forwardRef } from "@chakra-ui/react";
// import { Button } from "uikit";


import { ButtonProps, forwardRef } from "@chakra-ui/react";
import { Button } from "uikit/Button/Button";



export const TextButton = forwardRef<ButtonProps, "div">((props, ref) => (
  <Button ref={ref} p={0} width="fit-content" height="fit-content" data-id="text-button" {...props} />
));
