import { forwardRef, ModalBodyProps as ChakraModalBodyProps, ModalBody as ChakraModalBody } from "@chakra-ui/react";

const ModalBody = forwardRef<ChakraModalBodyProps, "div">(({ children, ...props }, ref) => (
  <ChakraModalBody ref={ref} {...props}>
    {children}
  </ChakraModalBody>
));

export default ModalBody;
