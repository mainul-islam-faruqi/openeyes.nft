import { Box, Flex, FlexProps } from "@chakra-ui/react";
import React from "react";
import { EthHalfIcon, IconProps, Text, TextProps } from "uikit";

export const TooltipTextText: React.FC<TextProps> = (props) => <Text color="currentcolor" {...props} />;

interface PlatformLabelProps extends FlexProps {
  icon: (props: IconProps) => JSX.Element;
}

export const PlatformLabel: React.FC<PlatformLabelProps> = ({ icon: Icon, children, ...props }) => (
  <Flex alignItems="center" {...props}>
    <Icon boxSize={4} mr={1} flexShrink={0} />
    <Box flex={1}>{children}</Box>
  </Flex>
);

interface PlatformRowProps extends FlexProps {
  amount: string;
  currencyIcon?: (props: IconProps) => JSX.Element;
}

export const PlatformRow: React.FC<PlatformRowProps> = ({
  amount,
  children,
  currencyIcon: Icon = EthHalfIcon,
  ...props
}) => (
  <Flex alignItems="center" justifyContent="space-between" {...props}>
    <Box>{children}</Box>
    <TooltipTextText display="flex" alignItems="center" textStyle="detail" justifyContent="end" bold ml={4}>
      <Icon boxSize={14} height={4} width={2} mr={1} flexShrink={0} />
      {amount}
    </TooltipTextText>
  </Flex>
);
