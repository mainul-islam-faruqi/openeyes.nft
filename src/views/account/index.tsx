import { useCallback, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { Box, Flex, useBreakpointValue, useDisclosure } from "@chakra-ui/react";
import { isAddressEqual } from "utils/guards";
import { useGetWindowHash } from "hooks/useGetWindowHash";
import { useEagerConnect } from "hooks/useEagerConnect";
import usePreviousValue from "hooks/usePreviousValue";
import { User } from "types/graphql";
import useIntersectionObserver from "hooks/useIntersectionObserver";
import { useOnStateChangeCallback } from "hooks/useOnStateChangeCallback";
import { MultiselectContextProvider } from "components/Multiselect/context/multiselectContext";
import {
  ActivityFilterProvider,
  TokenFilterProvider,
  useActivityFilter,
  useTokenFilter,
  useTokenFilterQuery,
} from "components/Filters";
import {
  FilterLayoutContent,
  FilterLayoutProvider,
  FilterLayoutSidebar,
  FILTER_LAYOUT_CONTENT_PADDING,
  useFilterLayout,
} from "components/Layout/FilterLayout";
import AccountNftsPanel from "components/NftsPanel/AccountNftsPanel";
import { FilterButton } from "components/Buttons";
import MobileFilterModal from "components/Modals/MobileFilterModal";
import AccountNftsFilters from "components/NftsPanel/AccountNftsFilters";
import { MultiselectSidebar } from "components/Multiselect/MultiselectSidebar";
import { useMultiselect } from "components/Multiselect/hooks/useMultiselect";
import { ActivityFilters, MobileActivityFilters } from "components/Activity";
import { MultiselectItems } from "components/Multiselect/MultiselectItems";
import { MultiselectFilterButton } from "components/Buttons/MultiselectFilterButton";
import MobileMultiselectModal from "components/Modals/MobileMultiselectModal";
import { handleScrollIntoView } from "components/Filters/utils/handleScrollIntoView";
import { useAddressFromQuery } from "./hooks/useAddressFromQuery";
import Header from "./components/Header";
import { AccountPage } from "./components/AccountPage";
import StaleOrdersActionBar from "./components/StaleOrdersActionBar";
import { AccountViewTabs } from "./components/AccountViewTabs";
import { OffersFilterPanel } from "./OffersFilterPanel";
import { CollectionsPanel } from "./CollectionsPanel";
import { AccountActivityPanel } from "./AccountActivityPanel";
import { BulkListingView } from "./BulkListingView";

interface Props {
  user?: User;
  isLoading: boolean;
}

const Account: React.FC<Props> = ({ user, isLoading }) => {
  const { account } = useWeb3React();
  const hash = useGetWindowHash();
  const address = useAddressFromQuery();
  const isConnectedAccountPage = isAddressEqual(account, address);

  // Totals
  const collectionsCount = user?.countCollections ?? 0;

  const tabIndex = (() => {
    switch (hash) {
      case "#activity":
        return 1;
      case "#offers":
        return 2;
      case "#collections":
        return 3;
      case "#sell":
        return 4;
      case "#owned":
      default:
        return 0;
    }
  })();

  // @NOTE not really a tab index, but consistent with our url routing for this view
  const isBulkListingView = tabIndex === 4;

  // do not show filters for offers yet
  const showFilterButton = tabIndex !== 2;
  const showFilterSidebar = [0, 1].indexOf(tabIndex) >= 0;

  const { isOpen: isFilterModalOpen, onOpen: onFilterModalOpen, onClose: onFilterModalClose } = useDisclosure();
  const {
    isOpen: isMultiselectModalOpen,
    onOpen: onMultiselectModalOpen,
    onClose: onMultiselectModalClose,
  } = useDisclosure();
  const { isIntersecting: isScrollContainerIntersecting, observerRef: scrollTargetRef } = useIntersectionObserver();
  const { filter: tokenFilters, clearAllFilters } = useTokenFilter();
  const { filters: activityFilters, resetFilters: resetActivityFilters } = useActivityFilter();
  const {
    isMultiselectActive,
    isCollapsed: isMultiselectCollapsed,
    onToggle: onToggleMultiselect,
    selectedItems,
  } = useMultiselect();
  const { isCollapsed: isFilterCollapsed, onToggle: onToggleFilter } = useFilterLayout();
  const previousIsFilterCollapsed = usePreviousValue(isFilterCollapsed);
  const maxOnePanelOpen = useBreakpointValue({ base: true, xl: false });

  // Scroll to top behaviour on filter change
  const onFilterChangeCallback = useCallback(() => {
    if (isScrollContainerIntersecting) {
      return;
    }
    handleScrollIntoView(scrollTargetRef.current);
  }, [isScrollContainerIntersecting, scrollTargetRef]);
  useOnStateChangeCallback(tokenFilters, onFilterChangeCallback);
  useOnStateChangeCallback(activityFilters, onFilterChangeCallback);

  useEffect(() => {
    // if user navigates directly to bulk listing /me#sell, redirect to /me#owned
    if (isBulkListingView) {
      if (typeof window !== "undefined") {
        window.location.href = "#owned";
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // when smaller than xl, only one panel should be open
  useEffect(() => {
    if (maxOnePanelOpen && isMultiselectActive && !isMultiselectCollapsed && !isFilterCollapsed) {
      if (previousIsFilterCollapsed) {
        onToggleMultiselect();
      } else {
        onToggleFilter();
      }
    }
  }, [
    maxOnePanelOpen,
    isMultiselectActive,
    isMultiselectCollapsed,
    isFilterCollapsed,
    previousIsFilterCollapsed,
    onToggleMultiselect,
    onToggleFilter,
  ]);

  return (
    <AccountPage>
      {isBulkListingView ? (
        <BulkListingView />
      ) : (
        <>
          {account && isConnectedAccountPage && <StaleOrdersActionBar account={account} />}
          <Header user={user} address={address!} />
          <div ref={scrollTargetRef} />
          <Flex>
            {/* Filter & Tab Layout */}
            <Box>
              {/* Mobile Filters / Modal */}
              <Box display={{ base: "block", md: "none" }}>
                {isMultiselectActive && tabIndex === 0 ? (
                  <MultiselectFilterButton
                    showFilterButton={showFilterButton}
                    onClickFilter={onFilterModalOpen}
                    selectionCount={selectedItems.length}
                    onClickViewSelection={onMultiselectModalOpen}
                  />
                ) : (
                  <FilterButton onClick={onFilterModalOpen} showFilterButton={showFilterButton} />
                )}
              </Box>
              {tabIndex === 0 && (
                <Box display={{ base: "block", md: "none" }}>
                  <MobileFilterModal
                    isOpen={isFilterModalOpen}
                    onClose={onFilterModalClose}
                    onResetAll={clearAllFilters}
                  >
                    <AccountNftsFilters isMobileLayout account={address!} />
                  </MobileFilterModal>
                </Box>
              )}
              {tabIndex === 1 && (
                <MobileActivityFilters
                  onFilterModalOpen={onFilterModalOpen}
                  isFilterModalOpen={isFilterModalOpen}
                  onFilterModalClose={onFilterModalClose}
                  resetFilters={resetActivityFilters}
                  display={{ base: "block", md: "none" }}
                />
              )}
              <Box display={{ base: "block", md: "none" }}>
                <MobileMultiselectModal
                  isOpen={isMultiselectModalOpen}
                  onClose={onMultiselectModalClose}
                  selectedItems={selectedItems}
                >
                  <MultiselectItems isMobileLayout onCloseModal={onMultiselectModalClose} />
                </MobileMultiselectModal>
              </Box>
              {/* Add offer filters / tabIndex === 2 when they are ready */}

              {/* Desktop Filters / Sidebar */}
              {showFilterSidebar && (
                <FilterLayoutSidebar display={{ base: "none", md: "block" }}>
                  {tabIndex === 0 && <AccountNftsFilters account={address!} />}
                  {tabIndex === 1 && <ActivityFilters />}
                  {/* Add offer filters tabIndex 2 when ready */}
                </FilterLayoutSidebar>
              )}
            </Box>

            {/* Tabs & Panel Content */}
            <FilterLayoutContent>
              <AccountViewTabs collectionsCount={collectionsCount} tabIndex={tabIndex} isLoading={isLoading} />
              <Box position="relative" {...FILTER_LAYOUT_CONTENT_PADDING}>
                {tabIndex === 0 && <AccountNftsPanel address={address!} />}
                {tabIndex === 1 && <AccountActivityPanel address={address!} />}
                {tabIndex === 2 && <OffersFilterPanel address={address!} />}
                {tabIndex === 3 && <CollectionsPanel />}
              </Box>
            </FilterLayoutContent>
            {isMultiselectActive && (
              <MultiselectSidebar>
                <MultiselectItems />
              </MultiselectSidebar>
            )}
          </Flex>
        </>
      )}
    </AccountPage>
  );
};

const AccountProviders = (props: Props) => {
  const address = useAddressFromQuery();
  const tokenFilterQuery = useTokenFilterQuery();
  const hasTriedConnection = useEagerConnect();

  const defaultFilters = { owner: address };
  const initialFilters = { ...defaultFilters, ...tokenFilterQuery, ...{ account: address } };

  if (!hasTriedConnection) {
    return null;
  }

  return (
    <TokenFilterProvider
      defaultFilters={defaultFilters}
      initialFilters={initialFilters}
      account={address}
      tokenFilterType="account"
      excludeUrlFilterKeys={["owner"]}
    >
      <ActivityFilterProvider>
        <MultiselectContextProvider>
          <FilterLayoutProvider>
            <Account {...props} />
          </FilterLayoutProvider>
        </MultiselectContextProvider>
      </ActivityFilterProvider>
    </TokenFilterProvider>
  );
};

export default AccountProviders;
