import { useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { BigNumber } from "ethers";
import last from "lodash/last";
import { Box } from "@chakra-ui/react";
import throttle from "lodash/throttle";
import { CollectionStaticData, NFTCard } from "types/graphql";
import useIntersectionObserver from "hooks/useIntersectionObserver";
import { SelectedTokenMap, useMultiselectStore } from "components/Multiselect/hooks/useMultiselectStore";
import { FilterTags, useTokensQueryArgs } from "components/Filters";
import { useRealTimeDataStatus, useRefetchMissedWhilePaused } from "components/RealtimeData/context";
import { useInfiniteTokens } from "hooks/graphql/tokens";
import { useAreMultipleTokenIdsOsSupported } from "hooks/useIsOsSupported";
import { useDebouncedValue } from "hooks/useDebouncedValue";
import { useLocalStorage } from "hooks/useLocalStorage";
import { useRealtimeCollectionBestBid, useRealtimeTokenFloorOrders } from "hooks/realtime/collections";
import { useDelayedNftCards } from "hooks/realtime/useDelayedNftCards";
import { useCollectionSearchStore } from "views/collections/shared";
import { fromTokenKey, getTokenOwnerFilter } from "utils/tokens";
import { LOCAL_STORAGE_PREFERENCES_OS_WARNINGS_ENABLED } from "config";
import { MultiselectBar } from "views/collections/components/MultiselectBar";
import usePreviousValue from "hooks/usePreviousValue";
import PanelCardGrid from "./PanelCardGrid";

interface CollectionNftsPanelProps {
  recentlyRefreshedTokenMap: SelectedTokenMap;
  collection: CollectionStaticData;
  onRefreshSuccess?: (nfts: NFTCard[]) => void;
}

const throttledFunction = throttle((fn) => fn(), 2500);

const CollectionNftsPanel: React.FC<React.PropsWithChildren<CollectionNftsPanelProps>> = ({
  recentlyRefreshedTokenMap,
  collection,
  onRefreshSuccess,
}) => {
  const { address, isConnecting } = useAccount();
  const { filter, sort } = useTokensQueryArgs();
  const searchTerm = useCollectionSearchStore((state) => state.term);

  const debouncedSearchTerm = useDebouncedValue(searchTerm);

  const queryParams = useMemo(
    () => ({
      filter,
      sort,
      ownerFilter: getTokenOwnerFilter({ connectedAccount: address, collectionType: collection.type }),
      search: searchTerm
        ? {
            term: debouncedSearchTerm,
          }
        : undefined,
    }),
    [filter, sort, address, collection.type, searchTerm, debouncedSearchTerm]
  );

  const {
    data: nftsRes,
    isFetching,
    isSuccess,
    isLoading,
    hasNextPage,
    refetch: _refetch,
    fetchNextPage,
  } = useInfiniteTokens(queryParams, { enabled: !isConnecting });

  const [shouldAnimateNewTokens, setShouldAnimateNewTokens] = useState(false);

  const throttledAnimateAndRefetch = () =>
    throttledFunction(() => {
      setShouldAnimateNewTokens(true);
      _refetch();
    });

  const latestResults = useMemo(() => nftsRes?.pages?.flat() || [], [nftsRes?.pages]);

  // Sort IDs for OS flag query to share a react query key and vercel cache response regardless of the order in which IDs are passed
  const latestTokenIds = useMemo(() => {
    const latestIds = last(nftsRes?.pages)?.map((token) => token.tokenId);
    const sortedIds =
      latestIds && latestIds.length > 0
        ? latestIds.sort((idA, idB) => (BigNumber.from(idA).gt(BigNumber.from(idB)) ? 0 : 1))
        : undefined;
    return sortedIds;
  }, [nftsRes?.pages]);

  const { value: userWantsOSWarnings } = useLocalStorage<boolean>(LOCAL_STORAGE_PREFERENCES_OS_WARNINGS_ENABLED);

  useAreMultipleTokenIdsOsSupported(filter.collection!, latestTokenIds!, {
    // Hook only enabled if all arguments are truthy
    enabled: !!filter.collection && !!latestTokenIds && !!userWantsOSWarnings,
  });

  const {
    nftCardsToDisplay,
    addedTokenKeys,
    removedTokenKeys,
    isPending: isPendingUIUpdate,
    setNftCardsToDisplay,
  } = useDelayedNftCards(latestResults, !shouldAnimateNewTokens);

  // Remove sold tokens from multiselect store and cart
  useEffect(() => {
    removedTokenKeys.forEach((tokenKey) => {
      const { collectionAddress, tokenId } = fromTokenKey(tokenKey);

      const multiselectState = useMultiselectStore.getState();
      if (multiselectState.tokensSelectionMap[collectionAddress]?.[tokenId]) {
        multiselectState.removeFromMultiselectStore(collectionAddress, tokenId);
      }
    });
  }, [removedTokenKeys]);

  const { observerRef: loadMoreObserverRef, isIntersecting } = useIntersectionObserver("800px");
  const shouldFetchNextPage =
    nftCardsToDisplay.length > 0 &&
    hasNextPage &&
    isIntersecting &&
    !isFetching &&
    latestResults.length === nftCardsToDisplay.length;

  // Load more if intersection observer is triggered
  useEffect(() => {
    if (shouldFetchNextPage) {
      setShouldAnimateNewTokens(false);
      fetchNextPage();
    }
  }, [shouldFetchNextPage, fetchNextPage]);

  // On first load or when the underlying query changes, do not delay the results
  const prevIsLoading = usePreviousValue(isLoading);
  const prevQueryParams = usePreviousValue(queryParams);
  const shouldNotDelayResults = !isLoading && (prevIsLoading || prevQueryParams !== queryParams);
  useEffect(() => {
    if (shouldNotDelayResults) {
      setNftCardsToDisplay(latestResults);
    }
  }, [latestResults, shouldNotDelayResults, setNftCardsToDisplay]);

  const { isPaused, notifyMissedData } = useRealTimeDataStatus();

  // Refetch when any floor order change, as tokens not currently displayed might have become relevant
  useRealtimeTokenFloorOrders(collection.address, undefined, {
    onNewData: isPaused ? notifyMissedData : throttledAnimateAndRefetch,
  });

  useRealtimeCollectionBestBid(collection.address, {
    onNewData: isPaused ? notifyMissedData : throttledAnimateAndRefetch,
  });

  // Refetch when unpausing if there were missed updates
  useRefetchMissedWhilePaused(throttledAnimateAndRefetch);

  useEffect(() => {
    if (isPaused) {
      throttledFunction.cancel();
    }
  }, [isPaused]);

  const showLoader = !isSuccess || (hasNextPage && (isFetching || isIntersecting || isPendingUIUpdate));

  const animationKey = useMemo(
    () => nftCardsToDisplay.map((card) => card.collection.address + card.tokenId).join(";"),
    [nftCardsToDisplay]
  );

  return (
    <Box>
      <FilterTags />
      <PanelCardGrid
        nfts={nftCardsToDisplay}
        hasNextPage={hasNextPage}
        isSuccess={isSuccess}
        showLoader={showLoader}
        showCollectionName={false}
        recentlyRefreshedTokenMap={recentlyRefreshedTokenMap}
        isErc721={collection.type === "ERC721"}
        newlyListedTokenKeys={shouldAnimateNewTokens ? addedTokenKeys : undefined}
        newlyDelistedTokenKeys={shouldAnimateNewTokens ? removedTokenKeys : undefined}
        animationKey={shouldAnimateNewTokens ? animationKey : undefined}
      />
      <MultiselectBar collection={collection} items={latestResults || []} onRefreshSuccess={onRefreshSuccess} />
      <div ref={loadMoreObserverRef} />
    </Box>
  );
};

export default CollectionNftsPanel;
