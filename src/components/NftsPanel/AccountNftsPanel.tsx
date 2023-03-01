import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { Box, Flex } from "@chakra-ui/layout";
import flatten from "lodash/flatten";
import { TokensSort } from "types/graphql";
import { getTokenOwnerFilter } from "utils/tokens";
import { useTokensSortLabels } from "hooks/useTokensSortLabels";
import { FilterLayoutTopbar } from "components/Layout/FilterLayout";
import { AttributesFilterTags } from "components/Filters";
import { useTokenFilter, useResetFilterOnAccountChange } from "components/Filters";
import { DropdownMenu } from "components/DropdownMenu";
import { useMultiselect } from "components/Multiselect/hooks/useMultiselect";
import { useInfiniteUserTokens } from "hooks/graphql/tokens";
import useIntersectionObserver from "hooks/useIntersectionObserver";
import { useEagerConnect } from "hooks/useEagerConnect";
import PanelCardGrid from "./PanelCardGrid";

interface NftsPanelProps {
  address: string;
}

const AccountNftsPanel: React.FC<NftsPanelProps> = ({ address }) => {
  const { account } = useWeb3React();
  const hasTriedConnection = useEagerConnect();
  const { observerRef, isIntersecting } = useIntersectionObserver("800px");

  const { filter } = useTokenFilter();

  const { labels, getTokensSortFromLabel, tokensSortMap } = useTokensSortLabels();
  const defaultSortState = { label: tokensSortMap.PRICE_ASC, value: TokensSort.PRICE_ASC };
  const [sortState, setSortState] = useState(defaultSortState);

  const { isCollapsed } = useMultiselect();

  const handleSelect = (orderSortLabel: string) => {
    const value = getTokensSortFromLabel(orderSortLabel);
    return setSortState(value ? { label: orderSortLabel, value } : defaultSortState);
  };

  // if both "Listed" and "Unlisted" filters are selected, unset both for the query
  const modifiedFilter = (() => {
    const filterClone = { ...filter };
    if (filterClone.withAskOnly && filterClone.withoutAskOnly) {
      filterClone.withAskOnly = undefined;
      filterClone.withoutAskOnly = undefined;
    }
    return filterClone;
  })();

  const {
    data: nftsRes,
    isFetching,
    isSuccess,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteUserTokens(
    {
      address,
      filter: modifiedFilter,
      sort: modifiedFilter.withoutAskOnly ? TokensSort.LAST_RECEIVED : sortState.value, // Prevent sorting by price when only returning tokens without ask
      ownerFilter: getTokenOwnerFilter({ connectedAccount: account, address }),
    },
    { enabled: hasTriedConnection }
  );
  const flattenedNftResults = nftsRes && flatten(nftsRes.pages);
  const shouldFetchNextPage = hasNextPage && isIntersecting && !isFetching;
  const showLoader = !isSuccess || (hasNextPage && isFetching);

  useResetFilterOnAccountChange();

  useEffect(() => {
    if (shouldFetchNextPage) {
      fetchNextPage();
    }
  }, [shouldFetchNextPage, fetchNextPage]);

  return (
    <Box position="relative">
      <FilterLayoutTopbar>
        <Flex flexDirection={{ base: "column", lg: "row-reverse" }} justifyContent="space-between">
          <DropdownMenu
            labels={labels}
            selectedLabel={filter.withoutAskOnly ? tokensSortMap.LAST_RECEIVED : sortState.label}
            disabled={filter.withoutAskOnly} // Price sorts do not work with withoutAskOnly filter so sort dropdown can be disabled
            handleSelect={handleSelect}
            mb={{ base: 6, lg: 0 }}
          />
          {filter.attributes && <AttributesFilterTags />}
        </Flex>
      </FilterLayoutTopbar>
      <Box bg="ui-bg">
        <PanelCardGrid
          nfts={flattenedNftResults}
          hasNextPage={hasNextPage}
          isSuccess={isSuccess}
          isAccountPage
          showLoader={showLoader}
          isMultiselectCollapsed={isCollapsed}
          isMultiselectGrid
        />
        <div ref={observerRef} />
      </Box>
    </Box>
  );
};

export default AccountNftsPanel;
