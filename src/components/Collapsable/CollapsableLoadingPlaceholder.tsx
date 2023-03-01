import { Flex, Skeleton } from "@chakra-ui/react";

const CollapseableLoadingPlaceholder = () => {
  return (
    <Flex p={4} alignItems="center" justifyContent="space-between">
      <Skeleton height="24px" width="128px" />
      <Skeleton height="24px" width="64px" />
    </Flex>
  );
};

export default CollapseableLoadingPlaceholder;
