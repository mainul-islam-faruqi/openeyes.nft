import { useCallback, useEffect } from "react";
import { Box, Flex, useDisclosure } from "@chakra-ui/react";
import { useAccount } from "wagmi";
import { shallow } from "zustand/shallow";
import { CollectionStaticData } from "types/graphql";
import { useOnStateChangeCallback } from "hooks/useOnStateChangeCallback";
import useIntersectionObserver from "hooks/useIntersectionObserver";
import usePreviousValue from "hooks/usePreviousValue";
import { useBreakpointValueSsr } from "hooks/useBreakpointValueSsr";
import { CollectionTopbar } from "views/collections/components/CollectionTopbar";
import {
  FilterLayoutContent,
  FilterLayoutSidebar,
  FILTER_LAYOUT_CONTENT_PADDING,
  useFilterLayout,
} from "components/Layout/FilterLayout";
import SingleCollectionNftsFilters from "components/NftsPanel/SingleCollectionNftsFilters";
import CollectionNftsPanel from "components/NftsPanel/CollectionNftsPanel";
import { useRecentlyRefreshedTokens } from "components/Multiselect/hooks/useRecentlyRefreshedTokens";
import { FilterButton, MultiselectFilterButton } from "components/Buttons";
import MobileFilterModal from "components/Modals/MobileFilterModal";
import { useTokensQueryArgs } from "components/Filters";
import { useMultiselectStore } from "components/Multiselect/hooks/useMultiselectStore";
import { MultiselectItems } from "components/Multiselect/MultiselectItems";
import MobileMultiselectModal from "components/Modals/MobileMultiselectModal";
import { handleScrollIntoView } from "components/Filters/utils/handleScrollIntoView";
import { useMultiselectLayout } from "components/Multiselect/hooks/useMultiselectLayout";
import { LayoutStickyBar } from "components/Layout/FilterLayout/FilterLayoutStickyTabs";

const collectionFilterLayoutContentPadding = { ...FILTER_LAYOUT_CONTENT_PADDING, pt: 2 };

interface CollectionItemsPanelProps {
  collection: CollectionStaticData;
}

export const CollectionItemsPanel = ({ collection }: CollectionItemsPanelProps) => {
  const { address } = useAccount();
  const { totalSupply } = collection;
  const { filter } = useTokensQueryArgs();
  const { onRefreshSuccess, recentlyRefreshed } = useRecentlyRefreshedTokens();
  const { isIntersecting, observerRef } = useIntersectionObserver();
  //Only from top to avoid triggering before scrolling down
  const { isIntersecting: isSticky, observerRef: stickyRef } = useIntersectionObserver("-80px 0px 0px 0px");

  const isLtLgBreakpoint = useBreakpointValueSsr({ base: true, lg: false });
  const maxOnePanelOpen = useBreakpointValueSsr({ base: true, xl: false });
  const [isMultiselectActive] = useMultiselectStore((state) => [state.isMultiselectActive], shallow);
  const { isCollapsed: isFilterCollapsed, onToggle: onToggleFilter } = useFilterLayout();
  const previousIsFilterCollapsed = usePreviousValue(isFilterCollapsed);
  const { isCollapsed: isMultiselectCollapsed, onToggle: onToggleMultiselect } = useMultiselectLayout();
  const { clearAllFilters } = useTokensQueryArgs();

  const {
    isOpen: isMobileFilterModalOpen,
    onOpen: onMobileFilterModalOpen,
    onClose: onMobileFilterModalClose,
  } = useDisclosure();
  const {
    isOpen: isMobileMultiselectModalOpen,
    onOpen: onMobileMultiselectModalOpen,
    onClose: onMobileMultiselectModalClose,
  } = useDisclosure();

  // Scroll to top behaviour on filter change
  const onFilterChangeCallback = useCallback(() => {
    if (isIntersecting) {
      return;
    }
    handleScrollIntoView(observerRef.current);
  }, [isIntersecting, observerRef]);

  useOnStateChangeCallback(filter, onFilterChangeCallback);

  // when smaller than xl, only one panel should be open
  const shouldRestrictToOneOpenPanel =
    maxOnePanelOpen && isMultiselectActive && !isMultiselectCollapsed && !isFilterCollapsed;

  useEffect(() => {
    if (shouldRestrictToOneOpenPanel) {
      previousIsFilterCollapsed ? onToggleMultiselect() : onToggleFilter();
    }
  }, [shouldRestrictToOneOpenPanel, previousIsFilterCollapsed, onToggleMultiselect, onToggleFilter]);

  return (
    <>
      <div ref={stickyRef} />
      <LayoutStickyBar overflow="visible">
        <CollectionTopbar collection={collection} showHeader={!isSticky && !isLtLgBreakpoint} />
      </LayoutStickyBar>
      <Flex px={{ base: 0, md: 4, "3xl": 8 }} pt={2}>
        <Flex flexDirection="column" width="100%">
          <div ref={observerRef} />
          <Flex>
            {isLtLgBreakpoint ? (
              <Box>
                {isMultiselectActive ? (
                  <MultiselectFilterButton
                    showFilterButton
                    onClickFilter={onMobileFilterModalOpen}
                    onClickViewSelection={onMobileMultiselectModalOpen}
                  />
                ) : (
                  <FilterButton onClick={onMobileFilterModalOpen} showFilterButton />
                )}
                <MobileFilterModal
                  isOpen={isMobileFilterModalOpen}
                  onClose={onMobileFilterModalClose}
                  onResetAll={() => clearAllFilters({ collection: collection.address })}
                >
                  <SingleCollectionNftsFilters
                    account={address}
                    address={collection.address}
                    totalSupply={totalSupply}
                    isMobileLayout
                    collectionHasRarity={!!collection.maxRarity}
                  />
                </MobileFilterModal>
                <Box>
                  {isMultiselectActive && (
                    <MobileMultiselectModal
                      isOpen={isMobileMultiselectModalOpen}
                      onClose={onMobileMultiselectModalClose}
                    >
                      <MultiselectItems
                        isMobileLayout
                        onCloseModal={onMobileMultiselectModalClose}
                        onRefreshSuccess={onRefreshSuccess}
                      />
                    </MobileMultiselectModal>
                  )}
                </Box>
              </Box>
            ) : (
              <FilterLayoutSidebar>
                <SingleCollectionNftsFilters
                  account={address}
                  address={collection.address}
                  totalSupply={totalSupply}
                  collectionHasRarity={!!collection.maxRarity}
                />
              </FilterLayoutSidebar>
            )}
            <FilterLayoutContent>
              <Box position="relative" {...collectionFilterLayoutContentPadding}>
                <CollectionNftsPanel
                  recentlyRefreshedTokenMap={recentlyRefreshed}
                  collection={collection}
                  onRefreshSuccess={onRefreshSuccess}
                />
              </Box>
            </FilterLayoutContent>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};
