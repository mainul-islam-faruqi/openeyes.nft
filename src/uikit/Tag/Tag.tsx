import { forwardRef, Tag as ChakraTag, TagProps as ChakraTagProps } from "@chakra-ui/react";

export interface TagProps extends ChakraTagProps {
  isClickable?: boolean;
  onClick?: () => void;
}

export const Tag = forwardRef<TagProps, "span">(({ children, ...props }, ref) => {
  return (
    <ChakraTag ref={ref} data-id="tag" {...props}>
      {children}
    </ChakraTag>
  );
});
