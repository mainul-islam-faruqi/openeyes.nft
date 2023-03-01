import { memo } from "react";
import { Grid, GridItem, GridProps } from "@chakra-ui/react";
import { BigNumber, constants } from "ethers";
import { useTranslation } from "next-i18next";
import { Popover, Text } from "uikit";
import { ListFromCollectionButton } from "./ListFromCollectionButton";
import { formatToSignificant } from "utils/format";
import { CollectionLeaderboard } from "utils/graphql";
import { getGlobalFloor } from "utils/floorPricePercentHelpers";
import { FloorTooltipText, GlobalTooltipText } from "components/TooltipText";
import { CollectionAmountDisplay, CollectionAvatar } from "./shared";

interface ListingRewardLeaderRowProps extends GridProps {
  rank: number;
  collection: CollectionLeaderboard;
  hasTokenInCollection: boolean;
  isFetchingRelativeCollections: boolean;
}

export const ListingRewardLeaderRow = memo(
  ({
    rank,
    collection,
    hasTokenInCollection,
    isFetchingRelativeCollections,
    ...props
  }: ListingRewardLeaderRowProps) => {
    const { t } = useTranslation();
    const { volume, floor } = collection;

    // Volume && floor counts
    const volumeLr = volume.volume24h ? BigNumber.from(volume.volume24h) : constants.Zero;
    const volumeOs = volume.volume24hOS ? BigNumber.from(volume.volume24hOS) : constants.Zero;
    const totalVolume = volumeLr.add(volumeOs);

    const { globalFloor, floorPrice, floorPriceOs } = getGlobalFloor(floor);

    return (
      <Grid
        as="a"
        alignItems={{ base: "start", md: "center" }}
        gridTemplateColumns={{ base: "24px 1fr 1fr auto", md: "24px 2fr 1fr 1fr 96px" }}
        gridTemplateAreas={{ base: "'a b b e' '. c d e'", md: "'a b c d e'" }}
        gridColumnGap={4}
        gridRowGap={4}
        py={6}
        borderBottom="1px solid"
        borderBottomColor="border-01"
        {...props}
      >
        <GridItem gridArea="a">
          <Text display="flex" alignItems="center" height={10} bold>{`#${rank}`}</Text>
        </GridItem>
        <GridItem gridArea="b">
          <CollectionAvatar collection={collection} />
        </GridItem>
        <GridItem gridArea="c">
          <Popover
            label={
              <GlobalTooltipText
                titleText={t("Cross-marketplace volume within the current daily cycle")}
                textLr={t("Vol. on {{platform}}", { platform: "LooksRare" })}
                amountLr={formatToSignificant(volumeLr, 4)}
                textOs={t("Vol. on {{platform}}", { platform: "OpenSea" })}
                amountOs={formatToSignificant(volumeOs, 4)}
              />
            }
          >
            <span>
              <CollectionAmountDisplay label={t("Global 24h Vol.")} total={formatToSignificant(totalVolume, 2)} />
            </span>
          </Popover>
        </GridItem>
        <GridItem gridArea="d">
          <Popover label={<FloorTooltipText amountLr={floorPrice} amountOs={floorPriceOs} />}>
            <span>
              <CollectionAmountDisplay label={t("Global Floor")} total={formatToSignificant(globalFloor, 2)} />
            </span>
          </Popover>
        </GridItem>
        <GridItem gridArea="e">
          <ListFromCollectionButton
            collectionAddress={collection.address}
            hasTokenInCollection={hasTokenInCollection}
            isLoading={isFetchingRelativeCollections}
          />
        </GridItem>
      </Grid>
    );
  }
);

ListingRewardLeaderRow.displayName = "ListingRewardLeaderRow";
