import { Box, Flex, Skeleton } from "@chakra-ui/react";
import { EVENTS_PER_PAGE } from "config/constants";
import times from "lodash/times";
import uniqueId from "lodash/uniqueId";

export const ActivityLoadingSkeleton = () => (
  <Flex mb="1px" p={4}>
    <Skeleton width={12} height={12} mr={4} />
    <Box flex={1}>
      <Skeleton width="20%" height={5} mb={1} />
      <Skeleton width="25%" height={5} />
    </Box>
  </Flex>
);

export const ActivityLoadingPlaceholder = () => (
  <>
    {times(EVENTS_PER_PAGE).map(() => (
      <ActivityLoadingSkeleton key={uniqueId()} />
    ))}
  </>
);
