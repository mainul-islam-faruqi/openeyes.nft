import { Box, BoxProps } from "@chakra-ui/layout";
import { useFilterLayout } from "./hooks";

export const FilterLayoutContent: React.FC<BoxProps> = ({ children, ...props }) => {
  const { transitionDur } = useFilterLayout();

  return (
    <Box
      transition="margin-left"
      transitionDuration={transitionDur}
      transitionTimingFunction="ease"
      flex={1}
      width="100%"
      {...props}
    >
      {children}
    </Box>
  );
};
