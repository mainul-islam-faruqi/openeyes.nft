import { ReactElement } from "react";
import { Box, Flex, FlexProps } from "@chakra-ui/react";

export interface StakingPanelCardProps extends FlexProps {
  leftIcon: ReactElement;
}

export const StakingPanelCard: React.FC<StakingPanelCardProps> = ({ leftIcon, children, ...props }) => {
  return (
    <Flex {...props}>
      <Box flexShrink={0} order={{ base: 2, lg: 1 }} mr={{ base: 0, lg: 8 }} ml={{ base: 8, lg: 0 }}>
        {leftIcon}
      </Box>
      <Box flex={1} order={{ base: 1, lg: 2 }}>
        {children}
      </Box>
    </Flex>
  );
};
