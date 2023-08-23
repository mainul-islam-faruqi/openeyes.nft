import { Box, Stack, StackDivider, useTheme } from "@chakra-ui/react";
import { fromDecimals } from "utils/format";
import { MyItemsOnlySwitch, PriceRangeFilter, useTokensQueryArgs } from "components/Filters";
import ListedItemsSwitch from "components/Filters/ListedItemsSwitch";
import { AttributesFilterList } from "components/Filters/AttributesFilterList";
import { BasicFilter } from "components/Filters/BasicFilter";
import { CollectionBase } from "types/graphql";
import { RarityRangeFilter } from "components/Filters/RarityRangeFilter";
import { MarketplaceFilter } from "components/Filters/MarketplaceFilter";

interface SingleCollectionNftsFiltersProps {
  account?: string | null;
  address: string;
  collectionHasRarity?: boolean;
  totalSupply: CollectionBase["totalSupply"];
  isMobileLayout?: boolean;
}

const SingleCollectionNftsFilters: React.FC<React.PropsWithChildren<SingleCollectionNftsFiltersProps>> = ({
  account,
  address,
  totalSupply,
  isMobileLayout,
  collectionHasRarity,
}) => {
  const {
    handleMaxPriceChange,
    handleMinPriceChange,
    handleMinRarityChange,
    handleMaxRarityChange,
    toggleWithAskOnly,
    toggleMyItemsOnly,
    filter,
    addMarketplaceFilter,
    removeMarketplaceFilter,
    availableMarketplaces,
  } = useTokensQueryArgs();
  const { space } = useTheme();

  const initialMinPrice = filter.order?.price?.min ? fromDecimals(filter.order?.price?.min) : "";
  const initialMaxPrice = filter.order?.price?.max ? fromDecimals(filter.order?.price?.max) : "";

  const initialMinRarity = filter.rarity?.min || "";
  const initialMaxRarity = filter.rarity?.max || "";

  const isMyItemsOnly = !!filter.owner;

  return (
    <Stack
      divider={
        <StackDivider
          borderColor="border-01"
          style={{
            marginInline: space["4"],
            marginBlock: space["2"],
          }}
        />
      }
      spacing={0}
    >
      <BasicFilter isMobileLayout={isMobileLayout}>
        <Stack spacing={4}>
          <Box>
            <ListedItemsSwitch isChecked={filter.withAskOnly} handleOnChange={toggleWithAskOnly} />
          </Box>
          {!!account && (
            <Box>
              <MyItemsOnlySwitch isChecked={isMyItemsOnly} handleOnChange={toggleMyItemsOnly} />
            </Box>
          )}
        </Stack>
      </BasicFilter>
      <PriceRangeFilter
        onMinPriceChange={handleMinPriceChange}
        onMaxPriceChange={handleMaxPriceChange}
        initialMin={initialMinPrice}
        initialMax={initialMaxPrice}
        isMobileLayout={isMobileLayout}
      />
      <MarketplaceFilter
        addMarketplaceFilter={addMarketplaceFilter}
        removeMarketplaceFilter={removeMarketplaceFilter}
        availableMarketplaces={availableMarketplaces}
        selectedMarketplaces={filter.context}
        isMobileLayout={isMobileLayout}
        defaultIsOpen={filter.context && filter.context?.length > 0}
      />
      {collectionHasRarity && (
        <RarityRangeFilter
          onMinRarityChange={handleMinRarityChange}
          onMaxRarityChange={handleMaxRarityChange}
          initialMin={initialMinRarity}
          initialMax={initialMaxRarity}
          totalSupply={totalSupply}
          isMobileLayout={isMobileLayout}
        />
      )}
      <AttributesFilterList
        collectionAddress={address}
        collectionTotalSupply={totalSupply}
        isMobileLayout={isMobileLayout}
      />
    </Stack>
  );
};

export default SingleCollectionNftsFilters;
