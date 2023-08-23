import { useCallback } from "react";
import {
  Box,
  useToast as useToastChakra,
  UseToastOptions,
  useMediaQuery,
  AlertTitle,
  AlertDescription,
  CloseButton,
} from "@chakra-ui/react";
import { Alert } from "uikit";

/**
 * A Toast will autoclose after 5s (chakra-ui default)
 */
export const useToast = () => {
  const toast = useToastChakra();
  const [isMobile] = useMediaQuery("(max-width: 30rem)");

  return useCallback(
    ({ status = "success", variant = "left-accent", title, description, ...rest }: UseToastOptions) =>
      toast({
        isClosable: true,
        status,
        variant,
        position: isMobile ? "bottom" : "top-right",
        render: ({ onClose }) => {
          return (
            <Alert status={status} variant={variant}>
              <Box>
                <AlertTitle>{title}</AlertTitle>
                {description && <AlertDescription>{description}</AlertDescription>}
              </Box>
              <CloseButton onClick={onClose} size="xs" position="absolute" right="8px" top="8px" />
            </Alert>
          );
        },
        ...rest,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isMobile]
  );
};
