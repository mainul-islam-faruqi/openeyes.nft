// import { useState } from "react";
// import { useTranslation } from "react-i18next";
// import { useDisclosure, Fade, Box, GridItem, Collapse, Grid, Spinner, Flex } from "@chakra-ui/react";
// import uniqueId from "lodash/uniqueId";
// import flatten from "lodash/flatten";
// import { ChevronDown, ChevronUp, ListIcon, CloseIcon, Button } from "uikit";
// import { COLLECTIONS_PAGINATION_FIRST, useInfiniteCollectionsFilters } from "hooks/graphql/collections";
// import { CollectionFilterItem, CollectionsSort } from "types/graphql";
// import { formatToSignificant } from "utils/format";
// import { useFilterLayout } from "components/Layout/FilterLayout/hooks";
// import {
//   CollectionPropertyButton,
//   CollectionPropertyButtonLoadingPlaceholder,
//   PropertyGroupHeader,
// } from "components/Property";
// import { PropertyHeader } from "components/Property";
// import { AttributesFilterList } from "./AttributesFilterList";
// import { useTokenFilter } from ".";







import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDisclosure, Fade, Box, GridItem, Collapse, Grid, Spinner, Flex } from "@chakra-ui/react";
import uniqueId from "lodash/uniqueId";
import flatten from "lodash/flatten";
// import { ChevronDown, ChevronUp, ListIcon, CloseIcon, Button } from "uikit";
import ChevronDown from "uikit/Icons/components/ChevronDown";
import ChevronUp from "uikit/Icons/components/ChevronUp";
import { ListIcon, CloseIcon } from "uikit";
import { Button } from "uikit/Button/Button";
import { COLLECTIONS_PAGINATION_FIRST, useInfiniteCollectionsFilters } from "hooks/graphql/collections";
import { CollectionFilterItem, CollectionsSort } from "types/graphql";
import { formatToSignificant } from "utils/format";
import { useFilterLayout } from "../Layout/FilterLayout/hooks";
import { CollectionPropertyButton } from "../Property/PropertyButtons";
import { CollectionPropertyButtonLoadingPlaceholder } from "../Property/PropertyButtonLoadingPlaceholders";
import { PropertyGroupHeader } from "../Property/PropertyGroupHeader";
import { PropertyHeader } from "../Property/styles";
import { AttributesFilterList } from "./AttributesFilterList";
import { useTokenFilter } from "./hooks/useTokenFilter";





interface CollectionsFilterProps {
  handleSetCollectionAddress: (value: string) => void;
  handleClearCollectionAddress: () => void;
  isMobileLayout?: boolean;
}

export const ExploreCollectionsFilter: React.FC<CollectionsFilterProps> = ({
  handleSetCollectionAddress,
  handleClearCollectionAddress,
  isMobileLayout,
}) => {
  const { t } = useTranslation();
  const { isCollapsed, onToggle } = useFilterLayout();
  const { clearAttributes, filter } = useTokenFilter();

  const collectionFiltersQuery = useInfiniteCollectionsFilters({ sort: CollectionsSort.HIGHEST_24H });
  const collectionFilters = collectionFiltersQuery.isSuccess && flatten(collectionFiltersQuery.data.pages);

  const initialCollection =
    filter.collection && collectionFilters
      ? collectionFilters.find((collection) => collection.address === filter.collection)
      : undefined;
  const [selectedCollection, setSelectedCollection] = useState<CollectionFilterItem | undefined>(initialCollection);

  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: isMobileLayout ? false : !initialCollection });

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
        color={selectedCollection ? "link-01" : "text-01"}
        leftIcon={selectedCollection ? undefined : <ListIcon />}
        rightIcon={getRightIcon()}
        onClick={() => handleGroupHeaderClick()}
        isCollapsed={isMobileLayout ? false : isCollapsed}
      />
      <Fade unmountOnExit in={!isCollapsed}>
        <Collapse unmountOnExit in={isOpen}>
          <Box px={4} pt={4} pb={2} bg="ui-bg">
            {collectionFiltersQuery.isSuccess ? (
              <>
                <Grid gridTemplateColumns="repeat(3, 1fr)" pb={2}>
                  <GridItem>
                    <PropertyHeader>{t("Name")}</PropertyHeader>
                  </GridItem>
                  <GridItem textAlign="right">
                    <PropertyHeader>{t("24h Vol")}</PropertyHeader>
                  </GridItem>
                  <GridItem textAlign="right">
                    <PropertyHeader>{t("Floor")}</PropertyHeader>
                  </GridItem>
                </Grid>
                {collectionFilters &&
                  collectionFilters.map((collection) => (
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
                      isVerified={collection.isVerified}
                      isListingRewardsEligible={collection.points ? collection.points > 0 : false}
                      mb={2}
                    />
                  ))}
                {collectionFiltersQuery?.isFetching && (
                  <>
                    {[...Array(COLLECTIONS_PAGINATION_FIRST)].map(() => (
                      <CollectionPropertyButtonLoadingPlaceholder key={uniqueId()} mb={2} />
                    ))}
                  </>
                )}
                {collectionFiltersQuery?.hasNextPage && (
                  <Flex justifyContent="center" py={2}>
                    <Button
                      isLoading={collectionFiltersQuery?.isFetching}
                      disabled={collectionFiltersQuery?.isFetching}
                      onClick={() => collectionFiltersQuery?.fetchNextPage()}
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
