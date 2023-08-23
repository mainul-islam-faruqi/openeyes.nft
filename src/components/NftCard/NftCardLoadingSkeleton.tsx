import React from "react";
import { Grid, AspectRatio, Skeleton, Box, Divider } from "@chakra-ui/react";

export const NftCardLoadingSkeleton: React.FC = () => {
  return (
    <Grid height="fit-content" templateRows="auto 1fr auto auto" width="100%" p={3}>
      <Box mb={3}>
        <Skeleton>
          <AspectRatio ratio={1}>
            <Box />
          </AspectRatio>
        </Skeleton>
      </Box>
      <Box mb={3}>
        <Skeleton height="16px" width="70%" mb={3} />
        <Skeleton height="20px" width="30%" />
      </Box>
      <Divider mb={3} />
      <Box>
        <Skeleton height="16px" width="60%" mb={2} />
      </Box>
    </Grid>
  );
};
