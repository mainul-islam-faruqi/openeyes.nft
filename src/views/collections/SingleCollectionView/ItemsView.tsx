import { Box } from "@chakra-ui/react";
import { CollectionStaticData } from "types/graphql";
import { useGetWindowHash } from "hooks/useGetWindowHash";
import { useOnPathnameChange } from "hooks/useOnPathnameChange";
import { MultiselectLayoutContextProvider } from "components/Multiselect/context/multiselectLayoutContext";
import { TokensQueryArgsProvider, useTokensFilterFromQueryString } from "components/Filters";
import { ActivityFilterProvider } from "components/Filters";
import { FilterLayoutProvider } from "components/Layout/FilterLayout";
import { useMultiselectStore } from "components/Multiselect/hooks/useMultiselectStore";
import { RealtimeDataStatusProvider } from "components/RealtimeData/context";
import { CollectionTabs, CollectionTabsIndexes } from "components/NftsPanel/CollectionTabs";
import { useCollectionSearchStore } from "../shared";
import { BulkListingView } from "../../account/BulkListingView";
import { CollectionHeader } from "../components/CollectionHeader";
import { CollectionItemsPanel } from "./CollectionItemsPanel";

enum Views {
  items,
  sell,
  conditionalListing,
}

const ItemsView = ({ collection }: { collection: CollectionStaticData }) => {
  const hash = useGetWindowHash();
  const clearMultiselectStore = useMultiselectStore((state) => state.clearMultiselectStore);
  const clearSearch = useCollectionSearchStore((state) => state.clearTerm);
  const tabIndex = (() => {
    switch (hash) {
      case "#oco":
        return Views.conditionalListing;
      case "#sell":
        return Views.sell;
      case "#items":
      default:
        return Views.items;
    }
  })();

  const isConditionalListing = tabIndex === Views.conditionalListing;
  const isBulkListingView = tabIndex === Views.sell || isConditionalListing;

  useOnPathnameChange(clearSearch);

  return isBulkListingView ? (
    <BulkListingView clearMultiselectStore={clearMultiselectStore} isConditionalListing={isConditionalListing} />
  ) : (
    <>
      <CollectionHeader collection={collection}>
        <CollectionTabs tabIndex={CollectionTabsIndexes.Items} collectionAddress={collection.address} />
      </CollectionHeader>
      <CollectionItemsPanel collection={collection} />
    </>
  );
};

interface CollectionViewWithProvidersProps {
  collection: CollectionStaticData;
}
/**
 * Wrap ItemsView in the Context Providers so we can use context in this View component
 */
const CollectionItemsViewWithProviders = ({ collection }: CollectionViewWithProvidersProps) => {
  const tokenFilterQuery = useTokensFilterFromQueryString();

  return (
    <Box key={collection.address}>
      <TokensQueryArgsProvider
        initialFilters={{ collection: collection.address, ...tokenFilterQuery }}
        defaultFilters={{ collection: collection.address }}
        excludeUrlFilterKeys={["collection"]}
        tokensPageType="collection"
      >
        <ActivityFilterProvider defaultFilters={{ collection: collection.address }}>
          <MultiselectLayoutContextProvider>
            <FilterLayoutProvider>
              <RealtimeDataStatusProvider>
                <ItemsView collection={collection} />
              </RealtimeDataStatusProvider>
            </FilterLayoutProvider>
          </MultiselectLayoutContextProvider>
        </ActivityFilterProvider>
      </TokensQueryArgsProvider>
    </Box>
  );
};

export default CollectionItemsViewWithProviders;
