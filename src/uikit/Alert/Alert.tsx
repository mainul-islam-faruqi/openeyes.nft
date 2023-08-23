import {
  forwardRef,
  Alert as ChakraAlert,
  AlertProps as ChakraAlertProps,
  AlertStatus,
  AlertIcon,
  Box,
  Flex,
  AlertIconProps,
} from "@chakra-ui/react";
import { Container } from "components/Layout/Container";
import WarningFilledIcon from "../Icons/components/WarningFilled";
import CheckmarkFilledIcon from "../Icons/components/CheckmarkFilled";
import InformationFilledIcon from "../Icons/components/InformationFilled";
import ErrorFilledIcon from "../Icons/components/ErrorFilled";

interface Props extends ChakraAlertProps {
  constrain?: boolean;
  alertIconProps?: AlertIconProps;
}

const icons: Record<AlertStatus, React.FC> = {
  info: InformationFilledIcon,
  warning: WarningFilledIcon,
  success: CheckmarkFilledIcon,
  error: ErrorFilledIcon,
};

export const Alert = forwardRef<Props, "div">(
  ({ children, constrain = false, status = "info", alertIconProps, ...props }, ref) => {
    const Icon = icons[status];

    return (
      <ChakraAlert ref={ref} status={status} {...props}>
        {constrain ? (
          <Box width="100%">
            <Flex as={Container}>
              <AlertIcon as={Icon} {...alertIconProps} />
              {children}
            </Flex>
          </Box>
        ) : (
          <>
            <AlertIcon as={Icon} {...alertIconProps} />
            {children}
          </>
        )}
      </ChakraAlert>
    );
  }
);
