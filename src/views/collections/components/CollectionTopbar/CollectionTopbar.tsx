import { FlexProps, Flex, HStack, Box, Divider } from "@chakra-ui/react";
import { CollectionStaticData } from "types/graphql";
import { containerPadding } from "components/Layout/Container";
import { RealtimeDataPlayPauseButton } from "components/RealtimeData/RealtimeDataPlayPauseButton";
import { useCollectionStats } from "hooks/graphql/collections";
import {
  DailyFloorDataPoint,
  FloorDataPoint,
  MarketCapDataPoint,
  OwnersDataPoint,
  TotalVolumeDataPoint,
  WeeklyFloorDataPoint,
} from "../CollectionHeader";
import { HighestBidForCollectionDataPoint } from "../CollectionHeader/HighestBidForCollectionPoint";
import { Sort } from "./Sort";
import { CollectionSearch } from "./CollectionSearch";
import { FilterToggle } from "./FilterToggle";
import { SearchAndTitleToggle } from "./SearchAndTitleToggle";
import { ViewModeSelector } from "./ViewModeSelector";

interface CollectionTopbarProps extends FlexProps {
  collection: CollectionStaticData;
  showHeader?: boolean;
}

const showOnGreaterThan2xl = { base: "none", "2xl": "flex" };
const showOnGreaterThanXl = { base: "none", xl: "flex" };

export const CollectionTopbar = ({ collection, showHeader = false, ...props }: CollectionTopbarProps) => {
  const { address, name, logo, isVerified, isEligible, totalSupply, type, maxRarity } = collection;

  const collectionStatsQuery = useCollectionStats(address);
  const { floor } = collectionStatsQuery.data || {};

  const isErc1155 = type === "ERC1155";

  return (
    <Flex
      px={containerPadding}
      bg="ui-bg"
      alignItems="center"
      width="100%"
      height={18}
      borderTop="1px solid"
      borderTopColor={showHeader ? "border-01" : "ui-bg"}
      {...props}
    >
      {showHeader ? (
        <>
          <HStack spacing={3} flex="1">
            <FilterToggle />
            <RealtimeDataPlayPauseButton variant="icon" />
            <Box flex={1}>
              <SearchAndTitleToggle
                address={address}
                logo={logo}
                name={name}
                isVerified={isVerified}
                isEligible={isEligible}
              />
            </Box>
          </HStack>
          <HStack spacing={6} display={showOnGreaterThanXl}>
            <FloorDataPoint collectionAddress={address} isFixedSize align="right" />
            <DailyFloorDataPoint collectionAddress={address} isFixedSize align="right" />
            <WeeklyFloorDataPoint collectionAddress={address} isFixedSize align="right" />
            <TotalVolumeDataPoint collectionAddress={address} isFixedSize align="right" />
          </HStack>
          <HStack spacing={6} display={showOnGreaterThan2xl} ml={6}>
            <Box height={12}>
              <Divider orientation="vertical" />
            </Box>
            <HighestBidForCollectionDataPoint collectionAddress={address} isFixedSize align="right" />
            <OwnersDataPoint
              address={address}
              totalSupply={totalSupply}
              isErc1155={isErc1155}
              isFixedSize
              align="right"
            />
            <MarketCapDataPoint
              collectionAddress={address}
              isFixedSize
              totalSupply={totalSupply}
              globalFloor={floor?.floorPriceGlobal}
              align="right"
            />
          </HStack>
          <HStack spacing={3} ml={6}>
            <ViewModeSelector />
          </HStack>
        </>
      ) : (
        <HStack spacing={3} flex={1}>
          <Box display={{ base: "none", lg: "block" }}>
            <FilterToggle />
          </Box>
          <CollectionSearch />
          <Sort minWidth="max-content" collectionHasRarity={!!maxRarity} />
          <ViewModeSelector />
        </HStack>
      )}
    </Flex>
  );
};
