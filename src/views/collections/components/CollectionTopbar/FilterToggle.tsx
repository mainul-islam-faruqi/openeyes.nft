import { IconButton } from "@chakra-ui/react";
import { FilterIcon } from "uikit";
import { useFilterLayout } from "components/Layout/FilterLayout";

export const FilterToggle = () => {
  const { onToggle } = useFilterLayout();
  return (
    <IconButton variant="outline" colorScheme="gray" onClick={onToggle} aria-label="toggle filter">
      <FilterIcon />
    </IconButton>
  );
};
