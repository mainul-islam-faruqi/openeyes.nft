import { Box, Flex, FlexProps, Spinner, SpinnerProps } from "@chakra-ui/react";

export interface SectionLoaderProps extends FlexProps {
  spinnerProps?: SpinnerProps;
}

export const SectionLoader: React.FC<SectionLoaderProps> = ({ children, spinnerProps, ...props }) => (
  <Flex alignItems="center" justifyContent="center" flexDirection="column" {...props}>
    <Spinner color="interactive-01" size="xl" speed="0.8s" label="Loading..." {...spinnerProps} />
    {children && <Box mt={6}>{children}</Box>}
  </Flex>
);
