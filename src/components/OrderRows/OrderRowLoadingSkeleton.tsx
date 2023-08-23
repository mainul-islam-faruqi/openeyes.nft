import React from "react";
import { Flex, Skeleton, Grid, GridItem } from "@chakra-ui/react";

interface Props {
  isFullWidth?: boolean;
}

export const OrderRowLoadingSkeleton: React.FC<Props> = ({ isFullWidth }) => {
  return (
    <Grid
      p={4}
      pl={isFullWidth ? 4 : { base: 4, sm: 24 }}
      backgroundColor="ui-bg"
      templateColumns="140px repeat(2, auto)"
      gridColumnGap={4}
      gridRowGap={4}
      borderBottom="1px solid"
      borderColor="border-01"
    >
      <GridItem colSpan={2}>
        <Flex alignItems="center">
          <Skeleton height="24px" width="132px" />
        </Flex>
      </GridItem>
      <GridItem rowSpan={2}>
        <Flex height="100%" alignItems="center" justifyContent="flex-end">
          <Skeleton height="48px" width="85px" />
        </Flex>
      </GridItem>
      <GridItem colSpan={{ base: 2, md: 1 }}>
        <Skeleton height="20px" width="110px" />
      </GridItem>
      <GridItem colSpan={{ base: 3, md: 1 }}>
        <Skeleton height="20px" width="80px" />
      </GridItem>
    </Grid>
  );
};
