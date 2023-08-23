import React from "react";
import { Box, BoxProps } from "@chakra-ui/react";

export const InputErrorGroup: React.FC<BoxProps> = ({ children, ...props }) => (
  <Box my={2} minHeight={6} {...props}>
    {children}
  </Box>
);
