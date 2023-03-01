import { forwardRef, Textarea as ChakraTextarea, TextareaProps as ChakraTextareaProps } from "@chakra-ui/react";

export const Textarea = forwardRef<ChakraTextareaProps, "textarea">((props, ref) => (
  <ChakraTextarea ref={ref} {...props} />
));
