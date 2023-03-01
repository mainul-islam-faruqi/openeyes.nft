import { ReactNode } from "react";
import {
  forwardRef,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  Popover as ChakraPopover,
  PopoverProps as ChakraPopoverProps,
  PopoverContentProps,
  Portal,
} from "@chakra-ui/react";

interface PopoverProps extends ChakraPopoverProps {
  label: ReactNode;
  contentProps?: PopoverContentProps;
  renderInPortal?: boolean;
}

const Popover = forwardRef<PopoverProps, "div">(
  ({ label, children, contentProps, renderInPortal = false, ...props }, ref) => {
    const popoverContent = (
      <PopoverContent
        ref={ref}
        borderRadius={0}
        p={4}
        width="auto"
        maxWidth="20rem"
        bg="ui-inverse"
        zIndex={10000000000}
        {...contentProps}
      >
        <PopoverArrow bg="ui-inverse" />
        <PopoverBody sx={{ bg: "ui-inverse", color: "text-inverse" }} p={0}>
          {label}
        </PopoverBody>
      </PopoverContent>
    );

    return (
      <ChakraPopover trigger="hover" arrowSize={16} gutter={20} {...props}>
        <PopoverTrigger>{children}</PopoverTrigger>
        {renderInPortal ? <Portal>{popoverContent}</Portal> : popoverContent}
      </ChakraPopover>
    );
  }
);

export default Popover;
