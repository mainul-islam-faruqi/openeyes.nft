// import { Box, Fade, BoxProps } from "@chakra-ui/react";
// import { useFilterLayout } from "components/Layout/FilterLayout";



import { Box, Fade, BoxProps } from "@chakra-ui/react";
import { useFilterLayout } from "../Layout/FilterLayout/hooks";




export const BasicFilter: React.FC<BoxProps> = ({ children, ...props }) => {
  const { isCollapsed } = useFilterLayout();
  return (
    <Box width="100%" px={4} py={2} {...props}>
      <Fade in={!isCollapsed}>{children}</Fade>
    </Box>
  );
};
