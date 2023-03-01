import { Box, Flex, Grid, GridItem, Skeleton } from "@chakra-ui/react";
import { Trans, useTranslation } from "react-i18next";
import { HelpIcon, Link, LogoRoundIcon, Text } from "uikit";
import { addresses, SWAP_URL } from "config";
import { formatNumberToLocale, formatToSignificant } from "utils/format";
import { useFeeSharingLOOKSTvl } from "hooks/useStakingTvl";
import { useLooksStakingApr } from "hooks/useLooksStakingApr";
import { useFeeSharingWethRewardsApy } from "hooks/useFeeSharingWethRewardsApy";
import { WethRewardCollectionSection } from "./WethRewardCollectionSection";
import { StakeSection } from "./StakeSection";
import { StakingPanelCard } from "./StakingPanelCard";
import { LooksWethAprPopover } from "./Popovers";

export const StakingPanel = () => {
  const { t } = useTranslation();
  const { apr: looksApr, isSuccess: isLooksAprSuccess } = useLooksStakingApr();
  const { apr: wethApr, isSuccess: isWethAprSuccess } = useFeeSharingWethRewardsApy();
  const { tvlInLOOKS, tvlInUSD } = useFeeSharingLOOKSTvl();

  const annualAprToLocale =
    isLooksAprSuccess && isWethAprSuccess && formatNumberToLocale((looksApr || 0) + (wethApr || 0));
  const looksAprToLocale = looksApr ? formatNumberToLocale(looksApr) : undefined;
  const wethAprToLocale = wethApr ? formatNumberToLocale(wethApr) : undefined;

  return (
    <Grid gridTemplateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} gridGap={4}>
      <GridItem>
        <StakingPanelCard leftIcon={<LogoRoundIcon boxSize={12} />} mb={8}>
          <Text as="h4" bold>
            {t("LOOKS Staking")}
          </Text>
          <Box mb={4}>
            <Trans i18nKey="transStakeLink">
              <Text as="span" textStyle="helper" color="text-02" mr={1}>
                {t("Stake")}
              </Text>
              <Link
                fontSize="xs"
                color="link-01"
                href={`${SWAP_URL}?outputCurrency=${addresses.LOOKS}`}
                target="_blank"
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
              {t("Earn LOOKS & WETH")}
            </Text>
            <Box>
              <Box display="inline">
                <Text textStyle="helper" color="text-03" display="inline">
                  {t("Total LOOKS staked")}:
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
          </Box>
          {annualAprToLocale ? (
            <LooksWethAprPopover looksApr={looksAprToLocale} wethApr={wethAprToLocale}>
              <Flex alignItems="center" display="inline-flex">
                <Text as="h3" textStyle="heading-04" bold mr={2}>
                  {`${annualAprToLocale}% APR`}
                </Text>
                <Flex display="inline-flex">
                  <HelpIcon color="text-03" />
                </Flex>
              </Flex>
            </LooksWethAprPopover>
          ) : (
            <Skeleton height="32px" width="124px" />
          )}
        </StakingPanelCard>
      </GridItem>
      <GridItem>
        <StakeSection />
        <WethRewardCollectionSection />
      </GridItem>
    </Grid>
  );
};
