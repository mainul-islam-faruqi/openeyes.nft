import { useMemo, useState } from "react";
import times from "lodash/times";
import chunk from "lodash/chunk";
import { Box, Flex, Grid, GridItem } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { useWeb3React } from "@web3-react/core";
import { Button, SectionPlaceholder, Switch, Text } from "uikit";
import { COLLECTION_LEADERBOARD_TO_FETCH, DAILY_FLOOR_THRESHOLD, DAILY_LISTING_REWARD_INTERVAL } from "config";
import { useCollectionLeaderboard } from "hooks/graphql/collections";
import { useEagerConnect } from "hooks/useEagerConnect";
import { useUserRelativeCollections } from "hooks/graphql/user";
import { ListingRewardLeaderRowSkeleton } from "./shared";
import { ListingRewardLeaderRow } from "./ListingRewardLeaderRow";

const COLLECTIONS_TO_SHOW = 25;

export const ListingRewardLeaderboardTable = () => {
  const { t } = useTranslation();
  const { account } = useWeb3React();
  const hasTriedConnection = useEagerConnect();

  const [showUserCollection, setShowUserCollections] = useState(false);
  const { data, isSuccess, isLoading } = useCollectionLeaderboard();
  const {
    data: ownedCollectionAddresses,
    isSuccess: isRelativeSuccess,
    isFetching: isRelativeFetching,
  } = useUserRelativeCollections(account!, { enabled: !!account && isSuccess && hasTriedConnection });
  const toggleShowUserCollection = () => setShowUserCollections(!showUserCollection);

  const userCollectionCount = useMemo(() => {
    if (isSuccess && isRelativeSuccess) {
      return data.filter((collection) => ownedCollectionAddresses.includes(collection.address)).length;
    }
    return 0;
  }, [isSuccess, isRelativeSuccess, data, ownedCollectionAddresses]);

  if (isLoading) {
    return (
      <>
        {times(COLLECTION_LEADERBOARD_TO_FETCH).map((n) => (
          <ListingRewardLeaderRowSkeleton key={n} />
        ))}
      </>
    );
  }

  if (!data) {
    return null;
  }

  // If the user toggles only their collections show the entire data set
  const [eligible, almost] = showUserCollection ? [data] : chunk(data, COLLECTIONS_TO_SHOW);
  const showAlmost = !showUserCollection && data.length > COLLECTIONS_TO_SHOW;

  return (
    <>
      <Text as="h2" bold textStyle="heading-03" mb={4}>
        {t("Listing Points Leaderboard")}
      </Text>
      <Grid gridTemplateColumns={{ base: "1fr", md: "minmax(auto, 672px) 1fr" }} mb={8}>
        <Text as="p" color="text-03">
          {t(
            "Listings from the top 25 collections with over 0% royalties earn points every {{interval}} minutes. Set a price within {{threshold}}x of the global floor price to start accumulating points!",
            { interval: DAILY_LISTING_REWARD_INTERVAL, threshold: DAILY_FLOOR_THRESHOLD }
          )}
        </Text>
        <GridItem justifySelf="end">
          <Flex alignItems="center">
            <Text
              textStyle="helper"
              color="text-02"
              mr={4}
              onClick={account ? toggleShowUserCollection : undefined}
              cursor={account ? "pointer" : "not-allowed"}
              userSelect="none"
            >
              {t("Show my collections only")}
            </Text>
            <Switch isChecked={showUserCollection} isDisabled={!account} onChange={() => toggleShowUserCollection()} />
          </Flex>
        </GridItem>
      </Grid>
      {showUserCollection && userCollectionCount === 0 && account && (
        <SectionPlaceholder pt={16}>
          <Text bold color="text-02">
            {t("None of the collections you own are in the top 25")}
          </Text>
        </SectionPlaceholder>
      )}
      <Box mb={16}>
        {eligible.map((collectionLeaderboard, index) => {
          const hasTokenInCollection = isRelativeSuccess
            ? ownedCollectionAddresses.includes(collectionLeaderboard.address)
            : false;

          return (
            <ListingRewardLeaderRow
              key={collectionLeaderboard.address}
              rank={index + 1}
              collection={collectionLeaderboard}
              display={showUserCollection && !hasTokenInCollection ? "none" : undefined}
              hasTokenInCollection={hasTokenInCollection}
              isFetchingRelativeCollections={isRelativeFetching}
            />
          );
        })}
      </Box>
      {showAlmost && (
        <Box>
          <Text as="h3" bold textStyle="heading-03" mb={4}>
            {t("Closing In!")}
          </Text>
          {almost.map((collectionLeaderboard, index) => {
            const hasTokenInCollection = isRelativeSuccess
              ? ownedCollectionAddresses.includes(collectionLeaderboard.address)
              : false;

            return (
              <ListingRewardLeaderRow
                key={collectionLeaderboard.address}
                rank={index + eligible.length + 1}
                collection={collectionLeaderboard}
                display={showUserCollection && !hasTokenInCollection ? "none" : undefined}
                hasTokenInCollection={hasTokenInCollection}
                isFetchingRelativeCollections={isRelativeFetching}
              />
            );
          })}
        </Box>
      )}
      <Box textAlign="center" py={4}>
        {showUserCollection && (
          <Button onClick={toggleShowUserCollection} size="sm">
            {t("Show all Collections")}
          </Button>
        )}
      </Box>
    </>
  );
};
