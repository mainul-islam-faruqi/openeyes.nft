import { ReactElement } from "react";
import { Box, Flex, FlexProps } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { Button, ButtonProps } from "uikit";

export interface CollectTokenProps extends FlexProps {
  leftIcon: ReactElement;
  onCollect: () => void;
  isLoading?: boolean;
  isDisabled?: boolean;
  buttonProps?: ButtonProps;
  collectText?: string;
}

export const CollectToken: React.FC<CollectTokenProps> = ({
  leftIcon,
  onCollect,
  isLoading = false,
  isDisabled = false,
  children,
  buttonProps,
  collectText,
  ...props
}) => {
  const { t } = useTranslation();

  return (
    <Flex
      border="1px solid"
      borderColor="border-01"
      alignItems="center"
      flexDirection={{ base: "column", sm: "row" }}
      {...props}
    >
      <Flex alignItems="center" px={2} py={{ base: 4, sm: 0 }} flex={1} width="100%">
        <Box flexShrink={0} mr={2}>
          {leftIcon}
        </Box>
        {children}
      </Flex>
      <Button
        {...buttonProps}
        width={{ base: "100%", sm: "auto" }}
        isLoading={isLoading}
        onClick={onCollect}
        disabled={isDisabled}
        square
      >
        {collectText || t("Collect")}
      </Button>
    </Flex>
  );
};
