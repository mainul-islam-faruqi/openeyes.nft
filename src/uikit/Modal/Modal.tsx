import { ReactElement } from "react";
import {
  forwardRef,
  Modal as ChakraModal,
  ModalProps as ChakraModalProps,
  ModalOverlay,
  ModalContent,
  ModalContentProps,
} from "@chakra-ui/react";
import ModalHeader from "./ModalHeader";

export interface ModalProps extends ChakraModalProps {
  title?: string;
  label?: string;
  showCloseButton?: boolean;
  showBackButton?: boolean;
  onBack?: () => void;
  leftIcon?: ReactElement;
  rightIcon?: ReactElement;
  hideHeader?: boolean;
  modalContentProps?: ModalContentProps;
}

const Modal = forwardRef<ModalProps, "div">(
  (
    {
      size = "md",
      title,
      label,
      initialFocusRef,
      showCloseButton = true,
      showBackButton,
      isOpen,
      onBack,
      onClose,
      leftIcon,
      rightIcon,
      hideHeader,
      modalContentProps,
      children,
      ...props
    },
    ref
  ) => (
    <ChakraModal size={size} initialFocusRef={initialFocusRef} isOpen={isOpen} onClose={onClose} {...props}>
      <ModalOverlay />
      <ModalContent size={size} ref={ref} {...modalContentProps}>
        {!hideHeader && (
          <ModalHeader
            size={size}
            title={title}
            label={label}
            showCloseButton={showCloseButton}
            showBackButton={showBackButton}
            onBack={onBack}
            onClose={onClose}
            leftIcon={leftIcon}
            rightIcon={rightIcon}
          />
        )}
        {children}
      </ModalContent>
    </ChakraModal>
  )
);

export default Modal;
