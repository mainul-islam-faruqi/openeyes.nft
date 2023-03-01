import { Flex, Box, Skeleton } from "@chakra-ui/react";

const NftOfferCardLoadingSkeleton: React.FC = () => {
  return (
    <Flex p={4} alignItems="center" bg="ui-01">
      <Flex alignItems="center">
        <Box position="relative" mr={4}>
          <Skeleton height="64px" width="64px" />
        </Box>
        <Flex flexDirection="column" justifyContent="center">
          <Skeleton height="20px" width="124px" mb={4} />
          <Skeleton height="20px" width="96px" />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default NftOfferCardLoadingSkeleton;
