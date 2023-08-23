import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { Box, Flex } from "@chakra-ui/layout";
import flatten from "lodash/flatten";
import isEqual from "lodash/isEqual";
import { useInfiniteTokens } from "hooks/graphql/tokens";
import { useTokensSortLabels } from "hooks/useTokensSortLabels";
import useIntersectionObserver from "hooks/useIntersectionObserver";
import { useEagerConnect } from "hooks/useEagerConnect";
import { getTokenOwnerFilter } from "utils/tokens";
import { NFTCard, TokensSort } from "types/graphql";
import { FilterLayoutTopbar } from "components/Layout/FilterLayout/FilterLayoutTopbar";
import { DropdownMenu } from "components/DropdownMenu/DropdownMenu";
import { useTokenFilter } from "components/Filters/hooks/useTokenFilter";
import { AttributesFilterTags } from "components/Filters/AttributesFilterTags"
import PanelCardGrid from "./PanelCardGrid";

interface ExploreNftsPanelProps {
  initialTokens: NFTCard[];
}

const ExploreNftsPanel: React.FC<ExploreNftsPanelProps> = ({ initialTokens }) => {
  const { account } = useWeb3React();
  const hasTriedConnection = useEagerConnect();
  const { filter, initialFilters } = useTokenFilter();

  const { labels, getTokensSortFromLabel, tokensSortMap } = useTokensSortLabels();
  const defaultSortState = { label: tokensSortMap.LAST_RECEIVED, value: TokensSort.LAST_RECEIVED };
  const [sortState, setSortState] = useState(defaultSortState);

  const shouldUseInitialData = isEqual(filter, initialFilters) && sortState.value === defaultSortState.value;
  const {
    data: nftsRes,
    isFetching,
    isSuccess,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteTokens(
    { filter, sort: sortState.value, ownerFilter: getTokenOwnerFilter({ connectedAccount: account }) },
    {
      enabled: hasTriedConnection,
      initialData: shouldUseInitialData
        ? {
            pages: [initialTokens],
            pageParams: [undefined],
          }
        : undefined,
    }
  );
  const { observerRef, isIntersecting } = useIntersectionObserver("800px");

  const shouldFetchNextPage = hasNextPage && isIntersecting && !isFetching;
  const showLoader = !isSuccess || (hasNextPage && (isFetching || isIntersecting));
  const flattenedNftResults = nftsRes && flatten(nftsRes.pages);

  const handleSelect = (orderSortLabel: string) => {
    const value = getTokensSortFromLabel(orderSortLabel);
    return setSortState(value ? { label: orderSortLabel, value } : defaultSortState);
  };

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
            selectedLabel={sortState.label}
            handleSelect={handleSelect}
            mb={{ base: 6, lg: 0 }}
          />
          {filter.attributes && <AttributesFilterTags />}
        </Flex>
      </FilterLayoutTopbar>

      {/* Panel Content */}
      <Box bg="ui-bg">
        <PanelCardGrid
          nfts={flattenedNftResults}
          hasNextPage={hasNextPage}
          isSuccess={isSuccess}
          showLoader={showLoader}
        />
        <div ref={observerRef} />
      </Box>
    </Box>
  );
};

export default ExploreNftsPanel;
