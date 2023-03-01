import { Box, Flex, Grid, GridItem, GridProps, Skeleton } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { DAILY_LOOKS_DISTRIBUTED } from "config";
import { useUserPoints } from "hooks/graphql/user";
import { Trans, useTranslation } from "next-i18next";
import { HelpIcon, LogoRoundIcon, Popover, Text, TooltipText } from "uikit";
import LogoPolygon from "uikit/Icons/components/LogoPolygon";
import { timeAgo } from "utils/date";
import { formatNumberToLocale } from "utils/format";
import { getEstimatedLooksPerListing } from "utils/getEstimatedLooksPerListing";
import { getDurationUntilNextDistribution } from "utils/getDurationUntilNextDistribution";

type ListingRewardStatsProps = GridProps;

export const ListingRewardStats = (props: ListingRewardStatsProps) => {
  const { t } = useTranslation();
  const { account } = useWeb3React();
  const { timeUntilDistribution } = getDurationUntilNextDistribution(true);
  const userPointsQuery = useUserPoints(account!, {
    enabled: !!account,
  });

  const userPoints = (() => {
    if (!account) {
      return <Text color="text-disabled">-</Text>;
    }

    if (userPointsQuery.isFetching) {
      return (
        <Flex>
          <Skeleton height={6} width={6} mr={2} borderRadius="50%" />
          <Skeleton height={6} width="50px" mr={2} />
        </Flex>
      );
    }

    if (userPointsQuery.isSuccess) {
      const totalPoints = userPointsQuery.data.listingReward24h ? userPointsQuery.data.listingReward24h.totalPoints : 0;
      const totalPointsDisplay = formatNumberToLocale(totalPoints, 0, 0);

      const points = userPointsQuery.data.listingReward24h ? userPointsQuery.data.listingReward24h.points : 0;

      return (
        <Popover
          label={
            <TooltipText>
              <Trans i18nKey="totalPointsInCycleExplanation">
                Total points distributed so far this cycle:{" "}
                <Text as="span" bold color="currentcolor">
                  {{ totalPointsDisplay }}
                </Text>
              </Trans>
            </TooltipText>
          }
        >
          <Flex height={6} alignItems="center">
            <LogoPolygon color="purple.400" />
            <Text bold mx={2}>
              {formatNumberToLocale(points, 0, 0)}
            </Text>
            <HelpIcon color="text-03" boxSize={4} />
          </Flex>
        </Popover>
      );
    }
  })();

  const userEstimatedRewards = (() => {
    if (!account) {
      return <Text color="text-disabled">-</Text>;
    }

    if (userPointsQuery.isFetching) {
      return (
        <Flex>
          <Skeleton height={6} width={6} mr={2} borderRadius="50%" />
          <Skeleton height={6} width="50px" mr={2} />
        </Flex>
      );
    }

    if (userPointsQuery.isSuccess) {
      const totalPoints = userPointsQuery.data.listingReward24h ? userPointsQuery.data.listingReward24h.totalPoints : 0;
      const totalPointsDisplay = formatNumberToLocale(totalPoints, 0, 0);

      const points = userPointsQuery.data.listingReward24h?.points ? userPointsQuery.data.listingReward24h.points : 0;
      const pointsDisplay = formatNumberToLocale(points, 0, 0);
      const estimatedListingRewards = getEstimatedLooksPerListing(points, totalPoints);
      const totalDailyDisplay = formatNumberToLocale(DAILY_LOOKS_DISTRIBUTED, 0, 0);
      const percentageOfTotal =
        points && totalPoints ? `${formatNumberToLocale((points / totalPoints) * 100, 0, 3)}%` : "0%";

      return (
        <Popover
          label={
            <TooltipText>
              <Trans i18nKey="estimatedRewardExplanation">
                Your current points (
                <TooltipText as="span" bold textStyle="detail">
                  {{ pointsDisplay }}
                </TooltipText>
                ) / total points distributed (
                <TooltipText as="span" bold textStyle="detail">
                  {{ totalPointsDisplay }}
                </TooltipText>
                ) * daily LOOKS rewards (
                <TooltipText as="span" bold textStyle="detail">
                  {{ totalDailyDisplay }} LOOKS
                </TooltipText>
                )
                <TooltipText textStyle="detail" mt={4}>
                  This estimation is based on data up to the most recent snapshot, where your points are{" "}
                  <TooltipText as="span" bold textStyle="detail">
                    {{ percentageOfTotal }}
                  </TooltipText>
                  of the current total points. Actual rewards at the end of the day may vary.
                </TooltipText>
              </Trans>
            </TooltipText>
          }
        >
          <Flex alignItems="center">
            <LogoRoundIcon color="purple.400" />
            <Text mx={2} bold>
              {formatNumberToLocale(estimatedListingRewards, 0, 2)}
            </Text>
            <HelpIcon color="text-03" boxSize={4} />
          </Flex>
        </Popover>
      );
    }
  })();

  const updatedAt = (() => {
    if (userPointsQuery.isSuccess && userPointsQuery.data.listingReward24h) {
      return <Text bold>{timeAgo(new Date(userPointsQuery.data.listingReward24h.updatedAt))}</Text>;
    }

    if (userPointsQuery.isFetching) {
      return <Skeleton height={6} width={8} />;
    }

    return <Text color="text-disabled">-</Text>;
  })();

  const nextDistribution = (() => {
    return <Text bold>{timeUntilDistribution}</Text>;
  })();

  return (
    <Grid
      alignItems="center"
      border="1px solid"
      borderRadius="lg"
      borderColor="border-01"
      gridTemplateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }}
      {...props}
    >
      <GridItem p={4} borderRight="1px solid" borderRightColor="border-01">
        <Text color="text-03" textStyle="helper" mb={2}>
          {t("Your Points")}
        </Text>
        {userPoints}
      </GridItem>
      <GridItem p={4} borderRight={{ base: "none", md: "1px solid" }} borderRightColor={{ md: "border-01" }}>
        <Text color="text-03" textStyle="helper" mb={2}>
          {t("Est. Listing Rewards")}
        </Text>
        <Box minHeight={6}>{userEstimatedRewards}</Box>
      </GridItem>
      <GridItem
        p={4}
        borderRight="1px solid"
        borderRightColor="border-01"
        borderTop={{ base: "1px solid", md: "none" }}
        borderTopColor={{ base: "border-01" }}
      >
        <Text color="text-03" textStyle="helper" mb={2}>
          {t("Last Updated")}
        </Text>
        {updatedAt}
      </GridItem>
      <GridItem p={4} borderTop={{ base: "1px solid", md: "none" }} borderTopColor={{ base: "border-01" }}>
        <Text color="text-03" textStyle="helper" mb={2}>
          {t("Next Distribution")}
        </Text>
        {nextDistribution}
      </GridItem>
    </Grid>
  );
};
