import { useCallback, useRef } from "react";
import { Box, Flex, useDisclosure } from "@chakra-ui/react";
import { NFTCard, TokenFilter, TokenFlag } from "types/graphql";
import { useOnStateChangeCallback } from "hooks/useOnStateChangeCallback";
import { ActivityFilterProvider, TokenFilterProvider, useActivityFilter, useTokenFilter } from "components/Filters";
import ExploreNftsPanel from "components/NftsPanel/ExploreNftsPanel";
import {
  FilterLayoutContent,
  FilterLayoutProvider,
  FilterLayoutSidebar,
  FILTER_LAYOUT_CONTENT_PADDING,
} from "components/Layout/FilterLayout";
import { FilterButton } from "components/Buttons";
import MobileFilterModal from "components/Modals/MobileFilterModal";
import ExploreNftsFilters from "components/NftsPanel/ExploreNftsFilters";
import { ActivityFilters, ActivityPanel, MobileActivityFilters } from "components/Activity";
import { handleScrollIntoView } from "components/Filters/utils/handleScrollIntoView";
import { ExploreHeader } from "./components/ExploreHeader";

interface ExploreViewProps {
  tabIndex: number;
  initialTokens: NFTCard[];
}
const ExploreView = ({ tabIndex, initialTokens }: ExploreViewProps) => {
  const { isOpen: isFilterModalOpen, onOpen: onFilterModalOpen, onClose: onFilterModalClose } = useDisclosure();
  const { filter: tokenFilters, clearAllFilters: clearAllTokenFilters } = useTokenFilter();
  const { filters: activityFilters, resetFilters: resetActivityFilters } = useActivityFilter();
  const scrollTargetRef = useRef<null | HTMLDivElement>(null);

  // Scroll to top behaviour on filter change
  const onFilterChangeCallback = useCallback(() => handleScrollIntoView(scrollTargetRef.current), [scrollTargetRef]);
  useOnStateChangeCallback(tokenFilters, onFilterChangeCallback);
  useOnStateChangeCallback(activityFilters, onFilterChangeCallback);

  return (
    <>
      {/* Filter & Tab Layout */}
      <Flex>
        <Box>
          <div ref={scrollTargetRef} />
          {/* Mobile Filters / Modal */}
          <Box display={{ base: "block", sm: "none" }}>
            <FilterButton onClick={onFilterModalOpen} />
          </Box>
          {tabIndex === 0 && (
            <Box display={{ base: "block", sm: "none" }}>
              <MobileFilterModal
                isOpen={isFilterModalOpen}
                onClose={onFilterModalClose}
                onResetAll={clearAllTokenFilters}
              >
                <ExploreNftsFilters isMobileLayout />
              </MobileFilterModal>
            </Box>
          )}
          {tabIndex === 1 && (
            <MobileActivityFilters
              onFilterModalOpen={onFilterModalOpen}
              isFilterModalOpen={isFilterModalOpen}
              onFilterModalClose={onFilterModalClose}
              resetFilters={resetActivityFilters}
            />
          )}

          {/* Desktop Filters / Sidebar */}
          <FilterLayoutSidebar>
            {tabIndex === 0 && <ExploreNftsFilters />}
            {tabIndex === 1 && <ActivityFilters />}
          </FilterLayoutSidebar>
        </Box>

        {/* Tabs & Panel Content */}
        <FilterLayoutContent>
          <ExploreHeader tabIndex={tabIndex} />
          <Box position="relative" {...FILTER_LAYOUT_CONTENT_PADDING}>
            {tabIndex === 0 && <ExploreNftsPanel initialTokens={initialTokens} />}
            {tabIndex === 1 && <ActivityPanel filters={activityFilters} />}
          </Box>
        </FilterLayoutContent>
      </Flex>
    </>
  );
};

interface ExploreViewContextProviderProps extends ExploreViewProps {
  initialTokenFilter: TokenFilter;
}
/**
 * Wrap ExploreView in the Context Providers so we can use context in this View component
 */
const ExploreViewContextProvider = ({
  tabIndex,
  initialTokenFilter,
  initialTokens,
}: ExploreViewContextProviderProps) => {
  const defaultFilters = { flag: [TokenFlag.NONE, TokenFlag.TRIAGE] };
  const initialFilters = { ...defaultFilters, ...initialTokenFilter };

  return (
    <TokenFilterProvider
      defaultFilters={defaultFilters}
      initialFilters={initialFilters}
      excludeUrlFilterKeys={["flag"]}
      tokenFilterType="explore"
    >
      <ActivityFilterProvider>
        <FilterLayoutProvider>
          <ExploreView tabIndex={tabIndex} initialTokens={initialTokens} />
        </FilterLayoutProvider>
      </ActivityFilterProvider>
    </TokenFilterProvider>
  );
};

export default ExploreViewContextProvider;
