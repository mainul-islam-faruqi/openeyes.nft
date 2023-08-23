import { GridItem, GridProps, Skeleton, SkeletonCircle } from "@chakra-ui/react";
import { PropertyButtonWrapper } from "./PropertyButtons";

export const CollectionPropertyButtonLoadingPlaceholder: React.FC<GridProps> = (props) => {
  return (
    <PropertyButtonWrapper gridTemplateColumns="32px 1fr 1fr" gridTemplateRows="1fr 1fr" columnGap={2} {...props}>
      <GridItem rowSpan={2} colSpan={1}>
        <SkeletonCircle width="32px" height="32px" />
      </GridItem>
      <GridItem colSpan={2}>
        <Skeleton width="86px" height="16px" my="2px" />
      </GridItem>
      <GridItem>
        <Skeleton width="72px" height="12px" my="1px" />
      </GridItem>
      <GridItem>
        <Skeleton width="72px" height="12px" my="1px" />
      </GridItem>
    </PropertyButtonWrapper>
  );
};
