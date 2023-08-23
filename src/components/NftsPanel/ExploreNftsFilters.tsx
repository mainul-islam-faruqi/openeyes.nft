import { Box, Divider, Stack } from "@chakra-ui/react";
import { fromDecimals } from "utils/format";
import { PriceRangeFilter } from "components/Filters/PriceRangeFilter";
import { useTokenFilter } from "components/Filters/hooks/useTokenFilter"
import ListedItemsSwitch from "components/Filters/ListedItemsSwitch";
import { BasicFilter } from "components/Filters/BasicFilter";
import { ExploreCollectionsFilter } from "../Filters/ExploreCollectionsFilter";

interface ExploreCollectionNftsFiltersProps {
  isMobileLayout?: boolean;
}

const ExploreNftsFilters: React.FC<ExploreCollectionNftsFiltersProps> = ({ isMobileLayout }) => {
  const { handleMaxPriceChange, handleMinPriceChange, toggleWithAskOnly, setCollection, filter } = useTokenFilter();

  const initialMin = filter.order?.price?.min ? fromDecimals(filter.order?.price?.min) : "";
  const initialMax = filter.order?.price?.max ? fromDecimals(filter.order?.price?.max) : "";

  return (
    <Stack divider={<Divider />} spacing={0}>
      <BasicFilter bg="ui-01">
        <Box>
          <ListedItemsSwitch isChecked={filter.withAskOnly} handleOnChange={toggleWithAskOnly} />
        </Box>
      </BasicFilter>
      <PriceRangeFilter
        onMaxPriceChange={handleMaxPriceChange}
        onMinPriceChange={handleMinPriceChange}
        initialMin={initialMin}
        initialMax={initialMax}
      />
      <ExploreCollectionsFilter
        handleSetCollectionAddress={(collectionAddress) => setCollection(collectionAddress)}
        handleClearCollectionAddress={() => setCollection()}
        isMobileLayout={isMobileLayout}
      />
    </Stack>
  );
};

export default ExploreNftsFilters;
