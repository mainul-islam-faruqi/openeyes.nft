import { Box, BoxProps } from "@chakra-ui/react";
import { Text } from "uikit";

const LooksMarqueeBanner: React.FC<BoxProps> = (props) => {
  return (
    <Box color="text-02" maxWidth="100%" overflow="hidden" pt={2} pb={1} borderY="1px solid" {...props}>
      <Box
        whiteSpace="nowrap"
        overflow="hidden"
        display="inline-block"
        animation="marquee 60s linear infinite"
        sx={{
          "@keyframes marquee": {
            "0%": {
              transform: "translateX(0%)",
            },
            "100%": {
              transform: "translateX(-50%)",
            },
          },
        }}
      >
        <Text bold display="inline">
          LOOKSRARE LOOKSRARE LOOKSRARE LOOKSRARE LOOKSRARE LOOKSRARE LOOKSRARE LOOKSRARE LOOKSRARE LOOKSRARE LOOKSRARE
          LOOKSRARE LOOKSRARE LOOKSRARE LOOKSRARE LOOKSRARE LOOKSRARE LOOKSRARE LOOKSRARE LOOKSRARE LOOKSRARE LOOKSRARE
          LOOKSRARE LOOKSRARE LOOKSRARE LOOKSRARE LOOKSRARE LOOKSRARE LOOKSRARE LOOKSRARE LOOKSRARE LOOKSRARE LOOKSRARE{" "}
        </Text>
        <Text bold display="inline">
          LOOKSRARE LOOKSRARE LOOKSRARE LOOKSRARE LOOKSRARE LOOKSRARE LOOKSRARE LOOKSRARE LOOKSRARE LOOKSRARE LOOKSRARE
          LOOKSRARE LOOKSRARE LOOKSRARE LOOKSRARE LOOKSRARE LOOKSRARE LOOKSRARE LOOKSRARE LOOKSRARE LOOKSRARE LOOKSRARE
          LOOKSRARE LOOKSRARE LOOKSRARE LOOKSRARE LOOKSRARE LOOKSRARE LOOKSRARE LOOKSRARE LOOKSRARE LOOKSRARE LOOKSRARE{" "}
        </Text>
      </Box>
    </Box>
  );
};

export default LooksMarqueeBanner;
