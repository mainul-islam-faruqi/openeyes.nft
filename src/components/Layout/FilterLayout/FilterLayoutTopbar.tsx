import { Box, BoxProps } from "@chakra-ui/layout";

export const FilterLayoutTopbar: React.FC<BoxProps> = ({ children, ...props }) => {
  return (
    <Box width="100%" bg="ui-bg" mb={8} {...props}>
      {children}
    </Box>
  );
};
