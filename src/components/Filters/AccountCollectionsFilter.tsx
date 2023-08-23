// import { useState } from "react";
// import { useTranslation } from "react-i18next";
// import { useDisclosure, Fade, Box, Collapse, Spinner, Flex } from "@chakra-ui/react";
// import uniqueId from "lodash/uniqueId";
// import flatten from "lodash/flatten";
// import { ChevronDown, ChevronUp, ListIcon, CloseIcon, Button } from "uikit";
// import { COLLECTIONS_PAGINATION_FIRST } from "hooks/graphql/collections";
// import { useRelativeCollectionsSortLabels } from "hooks/useRelativeCollectionsSortLabels";
// import { useInfiniteUserRelativeCollections } from "hooks/graphql/user";
// import { CollectionFilterItem } from "types/graphql";
// import { formatToSignificant } from "utils/format";
// import { useFilterLayout } from "components/Layout/FilterLayout/hooks";
// import {
//   CollectionPropertyButton,
//   CollectionPropertyButtonLoadingPlaceholder,
//   PropertyGroupHeader,
// } from "components/Property";
// import { DropdownMenu } from "components/DropdownMenu";
// import { AttributesFilterList, useTokenFilter } from ".";
// import { isAddressEqual } from "utils/guards";





import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDisclosure, Fade, Box, Collapse, Spinner, Flex } from "@chakra-ui/react";
import uniqueId from "lodash/uniqueId";
import flatten from "lodash/flatten";
import ChevronDown from "uikit/Icons/components/ChevronDown";
import ChevronUp from "uikit/Icons/components/ChevronUp";
import { ListIcon, CloseIcon } from "uikit";
import { Button } from "uikit/Button/Button";
import { COLLECTIONS_PAGINATION_FIRST } from "hooks/graphql/collections";
import { useRelativeCollectionsSortLabels } from "hooks/useRelativeCollectionsSortLabels";
import { useInfiniteUserRelativeCollections } from "hooks/graphql/user";
import { CollectionFilterItem } from "types/graphql";
import { formatToSignificant } from "utils/format";
import { useFilterLayout } from "../Layout/FilterLayout/hooks";
import { CollectionPropertyButton } from "../Property/PropertyButtons";
import { CollectionPropertyButtonLoadingPlaceholder } from "../Property/PropertyButtonLoadingPlaceholders";
import { PropertyGroupHeader } from "../Property/PropertyGroupHeader";
import { DropdownMenu } from "../DropdownMenu/DropdownMenu";
import { AttributesFilterList } from "./AttributesFilterList";
import { useTokenFilter } from "./hooks/useTokenFilter";
import { isAddressEqual } from "utils/guards";








interface AccountCollectionsFilterProps {
  account: string;
  handleSetCollectionAddress: (value: string) => void;
  handleClearCollectionAddress: () => void;
  isMobileLayout?: boolean;
}

export const AccountCollectionsFilter: React.FC<AccountCollectionsFilterProps> = ({
  account,
  handleSetCollectionAddress,
  handleClearCollectionAddress,
  isMobileLayout,
}) => {
  const { t } = useTranslation();
  const { isCollapsed, onToggle } = useFilterLayout();
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: !isMobileLayout });
  const { clearAttributes, filter } = useTokenFilter();

  const [selectedCollection, setSelectedCollection] = useState<CollectionFilterItem | undefined>();

  // Sort dropdown
  const { labels, getRelativeCollectionsSortFromLabel, defaultSortState } = useRelativeCollectionsSortLabels();
  const [sortState, setSortState] = useState(defaultSortState);
  const handleDropdownSelect = (relativeCollectionsSortLabel: string) => {
    const value = getRelativeCollectionsSortFromLabel(relativeCollectionsSortLabel);
    return setSortState(value ? { label: relativeCollectionsSortLabel, value } : defaultSortState);
  };

  // Collections query
  const relativeCollectionsQuery = useInfiniteUserRelativeCollections(
    {
      address: account,
      sort: sortState.value,
    },
    {
      // Set initial selected collection on first successful load
      onSuccess: (results) => {
        const flattedResults = flatten(results.pages);
        const initialCollection = flattedResults.find((collection) =>
          isAddressEqual(collection.address, filter.collection)
        );

        if (initialCollection) {
          setSelectedCollection(initialCollection);
          onClose();
        }
      },
    }
  );
  const flattenedCollectionsResults = relativeCollectionsQuery.data && flatten(relativeCollectionsQuery.data.pages);

  const handleCollectionClick = (collection: CollectionFilterItem) => {
    setSelectedCollection(collection);
    handleSetCollectionAddress(collection.address);
    onClose();
  };

  const getRightIcon = () => {
    if (selectedCollection) {
      return <CloseIcon color="text-03" />;
    }
    if (isOpen) {
      return <ChevronUp color="text-03" />;
    }
    return <ChevronDown color="text-03" />;
  };

  const handleGroupHeaderClick = () => {
    if (isCollapsed) {
      onToggle();
    } else if (selectedCollection) {
      // Close selected collection
      setSelectedCollection(undefined);
      clearAttributes();
      handleClearCollectionAddress();
      onOpen();
    } else if (isOpen) {
      onClose();
    } else {
      onOpen();
    }
  };

  return (
    <Box borderBottom="1px solid" borderBottomColor="border-01">
      <PropertyGroupHeader
        width="100%"
        label={selectedCollection ? selectedCollection.name : t("Collection")}
        color={selectedCollection ? "interactive-01" : "interactive-03"}
        leftIcon={selectedCollection ? undefined : <ListIcon />}
        rightIcon={getRightIcon()}
        onClick={() => handleGroupHeaderClick()}
        isCollapsed={isMobileLayout ? false : isCollapsed}
      />
      <Fade unmountOnExit in={!isCollapsed}>
        <Collapse unmountOnExit in={isOpen}>
          <Box px={4} pt={4} pb={2} bg="ui-bg">
            {/* COLLECTIONS */}
            {!selectedCollection && (
              <DropdownMenu
                width="100%"
                mb={4}
                labels={labels}
                selectedLabel={sortState.label}
                handleSelect={handleDropdownSelect}
                renderInPortal={false}
              />
            )}
            {relativeCollectionsQuery.isSuccess ? (
              <>
                {flattenedCollectionsResults &&
                  flattenedCollectionsResults.map((collection) => (
                    <CollectionPropertyButton
                      key={collection.address}
                      name={collection.name}
                      logo={collection.logo}
                      address={collection.address}
                      last24hrVolume={
                        collection.volume.volume24h ? formatToSignificant(collection.volume.volume24h, 2) : "-"
                      }
                      floorPrice={
                        collection.floorOrder?.price ? formatToSignificant(collection.floorOrder.price, 4) : "-"
                      }
                      onClick={() => handleCollectionClick(collection)}
                      count={collection.owned}
                      isVerified={collection.isVerified}
                      isListingRewardsEligible={collection.points ? collection.points > 0 : false}
                      mb={2}
                    />
                  ))}
                {relativeCollectionsQuery?.isFetching && (
                  <>
                    {[...Array(COLLECTIONS_PAGINATION_FIRST)].map(() => (
                      <CollectionPropertyButtonLoadingPlaceholder key={uniqueId()} mb={2} />
                    ))}
                  </>
                )}
                {relativeCollectionsQuery?.hasNextPage && (
                  <Flex justifyContent="center" py={2}>
                    <Button
                      isLoading={relativeCollectionsQuery?.isFetching}
                      disabled={relativeCollectionsQuery?.isFetching}
                      onClick={() => relativeCollectionsQuery?.fetchNextPage()}
                    >
                      {t("Load More")}
                    </Button>
                  </Flex>
                )}
              </>
            ) : (
              <Flex py={8} alignItems="center" justifyContent="center">
                <Spinner />
              </Flex>
            )}
          </Box>
        </Collapse>
        {selectedCollection && (
          <AttributesFilterList
            collectionAddress={selectedCollection.address}
            collectionTotalSupply={selectedCollection.totalSupply}
            isMobileLayout={isMobileLayout}
          />
        )}
      </Fade>
    </Box>
  );
};
