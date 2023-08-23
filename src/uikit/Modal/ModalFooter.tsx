import {
  forwardRef,
  ModalFooterProps as ChakraModalFooterProps,
  ModalFooter as ChakraModalFooter,
} from "@chakra-ui/react";

const ModalFooter = forwardRef<ChakraModalFooterProps, "div">(({ children, ...props }, ref) => (
  <ChakraModalFooter ref={ref} {...props}>
    {children}
  </ChakraModalFooter>
));

export default ModalFooter;
