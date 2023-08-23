import { Flex, FlexProps } from "@chakra-ui/react";
import { LogoMonoIcon } from "uikit";
import { IconProps } from "uikit/Icons/Icon";


export interface SectionPlaceholderProps extends FlexProps {
  logoProps?: IconProps;
}

export const SectionPlaceholder: React.FC<SectionPlaceholderProps> = ({ children, logoProps, ...props }) => (
  <Flex flexDirection="column" justifyContent="center" alignItems="center" {...props}>
    <LogoMonoIcon opacity={0.1} color="white" mb={6} boxSize={137} {...logoProps} />
    {children}
  </Flex>
);
