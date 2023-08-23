import { useTranslation, Trans } from "react-i18next";
import Link from "next/link";
import { Flex, Grid, GridItem, Box, useColorModeValue, Skeleton } from "@chakra-ui/react";
import { Text, Button, RainbowText, HelpIcon, BigLooksIcon, BigLooksLightIcon } from "uikit";
import { formatNumberToLocale } from "utils/format";
import { getAggregatorApy } from "utils/apr";
import { useLooksStakingApr } from "hooks/useLooksStakingApr";
import { useFeeSharingWethRewardsApy } from "hooks/useFeeSharingWethRewardsApy";
import { LooksAggregatorApyPopover } from "views/rewards/components/Popovers";

const Earn: React.FC = () => {
  const { t } = useTranslation();

  const { apr: looksApr } = useLooksStakingApr();
  const { apy: wethApy, apr: wethApr, dailyCompounds } = useFeeSharingWethRewardsApy();

  const annualApyToLocale = looksApr && wethApy ? formatNumberToLocale(getAggregatorApy(wethApy, looksApr)) : undefined;
  const looksAprToLocale = looksApr ? formatNumberToLocale(looksApr) : undefined;
  const wethAprToLocale = wethApr ? formatNumberToLocale(wethApr) : undefined;
  const wethApyToLocale = wethApy ? formatNumberToLocale(wethApy) : undefined;

  const bigLooksIcon = useColorModeValue(
    <BigLooksLightIcon boxSize={1} width={{ base: "75%", xs: "50%", md: "100%" }} height="100%" />,
    <BigLooksIcon boxSize={1} width={{ base: "75%", xs: "50%", md: "100%" }} height="100%" />
  );

  return (
    <>
      <Grid
        columnGap={12}
        gridTemplateAreas={{
          base: "'b' 'a'",
          md: "'a b'",
        }}
        gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }}
      >
        <GridItem gridArea="a" height="100%">
          <Flex height="100%" justifyContent="center" flexDirection="column">
            <Trans i18nKey="transEarnUpToAggregatorApyWithLooks">
              <Text maxWidth="480px" pb={8} bold textStyle="display-03">
                Earn up to{" "}
                {annualApyToLocale ? (
                  <RainbowText animate bg="base.linearGradient" textStyle="display-04" display="inline" bold>
                    {{ annualApyToLocale }}% APY
                  </RainbowText>
                ) : (
                  <Skeleton height="42px" width="180px" display="inline-block" mr={2} />
                )}{" "}
                with LOOKS
              </Text>
            </Trans>

            <Trans i18nKey="transStakeLooksToEarnAShareOfDailyTradingFees">
              <Box display="inline" mb={8}>
                <Text color="text-02" display="inline">
                  Stake LOOKS tokens to{" "}
                </Text>
                <Text bold color="text-02" display="inline">
                  earn a share of daily trading fees{" "}
                </Text>
                <Text color="text-02" display="inline">
                  in WETH, in addition to even more LOOKS.
                </Text>
              </Box>
            </Trans>

            <Flex alignItems="center">
              <Link href="/rewards" passHref>
                <Button id="earn-start-earning" mr={2}>
                  {t("Start Earning")}
                </Button>
              </Link>
              <LooksAggregatorApyPopover
                looksApr={looksAprToLocale}
                wethApr={wethAprToLocale}
                wethApy={wethApyToLocale}
                dailyCompounds={dailyCompounds}
              >
                <Flex display="inline-flex">
                  <HelpIcon color="text-03" />
                </Flex>
              </LooksAggregatorApyPopover>
            </Flex>
          </Flex>
        </GridItem>
        <GridItem gridArea="b">
          <Flex justifyContent="flex-end">{bigLooksIcon}</Flex>
        </GridItem>
      </Grid>
    </>
  );
};

export default Earn;
