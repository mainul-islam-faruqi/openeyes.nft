import { Box, Flex, Grid, GridItem, Skeleton } from "@chakra-ui/react";
import { Trans, useTranslation } from "react-i18next";
import { HelpIcon, Link, Text } from "uikit";
import { addresses, SWAP_URL } from "config";
import { useFeeSharingWethRewardsApy } from "hooks/useFeeSharingWethRewardsApy";
import { useLooksStakingApr } from "hooks/useLooksStakingApr";
import { formatNumberToLocale, formatToSignificant } from "utils/format";
import { getAggregatorApy } from "utils/apr";
import { useAggregatorLOOKSTvl } from "hooks/useStakingTvl";
import { LooksAggregatorApyPopover } from "./Popovers";
import { StakingPanelCard } from "./StakingPanelCard";
import CompounderIcon from "./CompounderIcon";
import { AggregatorSection } from "./AggregatorSection";

export const AggregatorPanel = () => {
  const { t } = useTranslation();
  const { apr: looksApr } = useLooksStakingApr();
  const { apr: wethApr, apy: wethApy, dailyCompounds } = useFeeSharingWethRewardsApy();
  const { tvlInLOOKS, tvlInUSD } = useAggregatorLOOKSTvl();

  const annualApyToLocale = looksApr && wethApy ? formatNumberToLocale(getAggregatorApy(wethApy, looksApr)) : undefined;
  const looksAprToLocale = looksApr ? formatNumberToLocale(looksApr) : undefined;
  const wethAprToLocale = wethApr ? formatNumberToLocale(wethApr) : undefined;
  const wethApyToLocale = wethApy ? formatNumberToLocale(wethApy) : undefined;

  return (
    <Grid gridTemplateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} gridGap={4}>
      <GridItem>
        <StakingPanelCard leftIcon={<CompounderIcon boxSize={12} color="black" />} mb={8}>
          <Text as="h4" bold>
            {t("LOOKS Compounder")}
          </Text>

          <Box mb={4}>
            <Trans i18nKey="transStakeLink">
              <Text as="span" textStyle="helper" color="text-02" mr={1}>
                {t("Stake")}
              </Text>
              <Link
                isExternal
                fontSize="xs"
                color="link-01"
                href={`${SWAP_URL}?outputCurrency=${addresses.LOOKS}`}
                rel="nofollow noreferrer"
                fontWeight="bold"
              >
                LOOKS
              </Link>
            </Trans>
            <Text as="span" mx={2} textStyle="helper" color="text-02">
              |
            </Text>
            <Text as="span" textStyle="helper" color="text-02">
              {t("Earn LOOKS")}
            </Text>
            <Text textStyle="helper" color="text-02">
              {t("WETH rewards auto compound into more LOOKS!")}
            </Text>
            <Box display="inline">
              <Text textStyle="helper" color="text-03" display="inline">
                {t("Total LOOKS staked: ")}
              </Text>
              {tvlInLOOKS && tvlInUSD ? (
                <>
                  <Text textStyle="helper" color="text-03" display="inline">
                    {formatToSignificant(tvlInLOOKS, 0)}{" "}
                  </Text>
                  <Text textStyle="helper" color="text-03" display="inline">
                    (${formatToSignificant(tvlInUSD, 0)})
                  </Text>
                </>
              ) : (
                <Flex display="inline-flex">
                  <Skeleton width="64px" height="15px" mr={2} /> <Skeleton width="72px" height="15px" />
                </Flex>
              )}
            </Box>
          </Box>
          {annualApyToLocale ? (
            <LooksAggregatorApyPopover
              looksApr={looksAprToLocale}
              wethApr={wethAprToLocale}
              wethApy={wethApyToLocale}
              dailyCompounds={dailyCompounds}
            >
              <Flex alignItems="center" display="inline-flex">
                <Text as="h3" textStyle="heading-04" bold mr={2}>
                  {`${annualApyToLocale}% APY`}
                </Text>
                <Flex display="inline-flex">
                  <HelpIcon color="text-03" />
                </Flex>
              </Flex>
            </LooksAggregatorApyPopover>
          ) : (
            <Skeleton height="32px" width="124px" />
          )}
        </StakingPanelCard>
      </GridItem>
      <GridItem>
        <AggregatorSection />
      </GridItem>
    </Grid>
  );
};
