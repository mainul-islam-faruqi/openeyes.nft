import React from "react";
import { Grid, GridProps } from "@chakra-ui/react";

interface CardGridProps extends GridProps {
  isFilterCollapsed?: boolean;
  isMultiselectCollapsed?: boolean;
}

const CardGrid: React.FC<CardGridProps> = ({ isFilterCollapsed, isMultiselectCollapsed = true, ...props }) => {
  const numCollapsedSidebars = [isFilterCollapsed, isMultiselectCollapsed].filter(Boolean).length;

  return (
    <Grid
      templateColumns={{
        // minmax(0, 1fr) is a fix so a card does not grow
        // mobile
        base: "repeat(2, minmax(0, 1fr))",
        // desktop, max 1 filter expanded
        md: numCollapsedSidebars > 1 ? "repeat(3, minmax(0, 1fr))" : "repeat(2, minmax(0, 1fr))",
        lg: numCollapsedSidebars > 1 ? "repeat(4, minmax(0, 1fr))" : "repeat(3, minmax(0, 1fr))",
        // desktop, max 2 filters expanded
        xl: `repeat(${3 + numCollapsedSidebars}, minmax(0, 1fr))`,
        xxl: `repeat(${4 + numCollapsedSidebars}, minmax(0, 1fr))`,
        "3x": `repeat(${5 + numCollapsedSidebars}, minmax(0, 1fr))`,
        "4x": `repeat(${7 + numCollapsedSidebars}, minmax(0, 1fr))`,
      }}
      justifyItems="center"
      data-id="card-grid"
      gridColumnGap={{ base: 3, sm: 4 }}
      gridRowGap={{ base: 3, sm: 4 }}
      {...props}
    />
  );
};

export default CardGrid;
