import { ReactElement } from "react";
import {
  forwardRef,
  ModalHeaderProps as ChakraModalHeaderProps,
  ModalHeader as ChakraModalHeader,
} from "@chakra-ui/react";
import { ThemingProps } from "@chakra-ui/system";
import { Box, IconButton } from "@chakra-ui/react";
import { ModalHeading, Text } from "uikit";
import ArrowLeftIcon from "../Icons/components/ArrowLeft";
import CloseIcon from "../Icons/components/Close";

export interface ModalHeaderProps extends ChakraModalHeaderProps, ThemingProps {
  title?: string;
  label?: string;
  showCloseButton?: boolean;
  showBackButton?: boolean;
  onBack?: () => void;
  onClose?: () => void;
  leftIcon?: ReactElement;
  rightIcon?: ReactElement;
}

const ModalHeader = forwardRef<ModalHeaderProps, "div">(
  (
    { leftIcon, rightIcon, size = "md", title, label, showCloseButton, showBackButton, onBack, onClose, ...props },
    ref
  ) => (
    <ChakraModalHeader
      position="relative"
      size={size}
      textAlign={showBackButton ? "center" : "left"}
      ref={ref}
      {...props}
    >
      {showBackButton && (
        <Box position="absolute" left={size === "md" ? 2 : 0} top="50%" transform="translate(0, -50%)">
          <IconButton
            tabIndex={100}
            variant="ghost"
            colorScheme="gray"
            aria-label="Go back"
            onClick={onBack}
            icon={leftIcon || <ArrowLeftIcon boxSize={6} fill="text-01" />}
          />
        </Box>
      )}
      <Box px={showBackButton ? "48px" : 0}>
        {label && <Text textStyle="helper">{label}</Text>}
        {title && <ModalHeading as="h2">{title}</ModalHeading>}
      </Box>
      {showCloseButton && (
        <Box position="absolute" right={size === "md" ? 2 : 0} top="50%" transform="translate(0, -50%)">
          <IconButton
            tabIndex={101}
            variant="ghost"
            colorScheme="gray"
            aria-label="Close modal"
            onClick={onClose}
            icon={rightIcon || <CloseIcon boxSize={6} fill="text-01" />}
          />
        </Box>
      )}
    </ChakraModalHeader>
  )
);

export default ModalHeader;
