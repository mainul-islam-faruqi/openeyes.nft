import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useWeb3React } from "@web3-react/core";
import { Flex, Box, Skeleton, Divider, VStack } from "@chakra-ui/react";
import { formatToSignificant, toDecimals } from "utils/format";
import { Text } from "uikit";
import { useCalculateAggregatorUserSharesValueInLOOKS } from "hooks/calls/useAggregatorUniswapV3";
import { useLooksBalance } from "hooks/useTokenBalance";
import { useCoinPrices } from "hooks/useCoinPrices";
import { useRewardsSubgraph } from "hooks/subgraphs/useLooksStaking";
import { SwitchButton } from "components/Buttons";
import { Collapsable } from "components/Collapsable";
import CollapseableLoadingPlaceholder from "components/Collapsable/CollapsableLoadingPlaceholder";
import { SectionRow } from "../SectionRow";
import ConnectWalletBox from "../ConnectWalletBox";
import { Stake } from "./Stake";
import { Unstake } from "./Unstake";

enum View {
  stake,
  unstake,
}

export const AggregatorSection = () => {
  const { t } = useTranslation();
  const { account } = useWeb3React();
  const [activeSwitchIndex, setActiveSwitchIndex] = useState(View.stake);

  const coinPricesQuery = useCoinPrices({ enabled: !!account });
  const looksBalanceQuery = useLooksBalance(account ?? "", { enabled: !!account });
  const userSharesInLOOKSQuery = useCalculateAggregatorUserSharesValueInLOOKS(account ?? "", { enabled: !!account });
  const userSubgraphQuery = useRewardsSubgraph(account ?? "", {
    enabled: !!account,
  });

  // Staked LOOKS USD calculation
  const looksPriceWeiUsd = coinPricesQuery.isSuccess && toDecimals(coinPricesQuery.data.looks.toString());
  const userSharesUsd =
    userSharesInLOOKSQuery.isSuccess &&
    looksPriceWeiUsd &&
    formatToSignificant(userSharesInLOOKSQuery.data.mul(looksPriceWeiUsd).div(toDecimals("1")), 2);

  // Earned LOOKS calculation
  const adjustedDepositWei = userSubgraphQuery.data?.aggregatorAdjustedDepositAmount
    ? toDecimals(userSubgraphQuery.data.aggregatorAdjustedDepositAmount)
    : undefined;
  const earningsCollected = userSubgraphQuery.data?.aggregatorTotalCollectedLOOKS
    ? toDecimals(userSubgraphQuery.data.aggregatorTotalCollectedLOOKS)
    : undefined;
  const earningsInPool =
    userSharesInLOOKSQuery.isSuccess && adjustedDepositWei && userSharesInLOOKSQuery.data.sub(adjustedDepositWei);
  const totalLooksEarnedWei = earningsCollected && earningsInPool && earningsInPool.add(earningsCollected);
  const totalLooksEarnedUsd =
    totalLooksEarnedWei &&
    looksPriceWeiUsd &&
    formatToSignificant(totalLooksEarnedWei.mul(looksPriceWeiUsd).div(toDecimals("1")), 2);

  // Format values for display
  const userAggregatorSharesLooksCommified = formatToSignificant(userSharesInLOOKSQuery.data || "0", 4);
  const userSharesLooksCommified = formatToSignificant(userSharesInLOOKSQuery.data || "0", 4);
  const looksBalanceCommified = formatToSignificant(looksBalanceQuery.data || "0", 4);
  const totalLooksEarnedCommified = formatToSignificant(totalLooksEarnedWei || "0", 4);

  return (
    <>
      <Box>
        {!account && (
          <Collapsable headerProps={{ width: "100%" }} bg="transparent" header={<Text bold>{t("Your Stake")}</Text>}>
            <ConnectWalletBox />
          </Collapsable>
        )}
        {account &&
          (userSharesInLOOKSQuery.isSuccess ? (
            <Collapsable
              bg="transparent"
              defaultIsOpen
              headerProps={{ width: "100%" }}
              header={
                <Flex width="100%" justifyContent="space-between">
                  <Text bold>{t("Your Stake")}</Text>

                  <Text bold mr={3}>
                    {userSharesLooksCommified} LOOKS
                  </Text>
                </Flex>
              }
            >
              <Box bg="ui-01" py={6} px={4}>
                <Flex display="inline-flex" width="50%" mb={8}>
                  <SwitchButton
                    size="xs"
                    onClick={() => setActiveSwitchIndex(View.stake)}
                    isActive={activeSwitchIndex === View.stake}
                  >
                    {t("Stake")}
                  </SwitchButton>
                  <SwitchButton
                    size="xs"
                    onClick={() => setActiveSwitchIndex(View.unstake)}
                    isActive={activeSwitchIndex === View.unstake}
                  >
                    {t("Unstake")}
                  </SwitchButton>
                </Flex>
                {activeSwitchIndex === View.stake ? <Stake /> : <Unstake />}
                <VStack spacing={2} alignItems="flex-start">
                  <SectionRow label={t("LOOKS in wallet")}>
                    {looksBalanceQuery.isLoading && <Skeleton width="60px" height="20px" />}
                    {looksBalanceQuery.isSuccess && looksBalanceCommified}
                  </SectionRow>
                  <SectionRow label={t("Your Stake (Compounding)")}>
                    {coinPricesQuery.isLoading && <Skeleton width="48px" height="20px" />}
                    {coinPricesQuery.isSuccess && (
                      <Flex alignItems="baseline">
                        {userAggregatorSharesLooksCommified}
                        <Text ml={1} color="text-03" textStyle="helper">
                          (${userSharesUsd})
                        </Text>
                      </Flex>
                    )}
                  </SectionRow>
                  <SectionRow label={t("Earned to date")}>
                    {(userSubgraphQuery.isLoading || userSharesInLOOKSQuery.isLoading) && (
                      <Skeleton width="48px" height="20px" />
                    )}
                    {userSubgraphQuery.isSuccess && userSharesInLOOKSQuery.isSuccess && (
                      <Flex alignItems="baseline">
                        {totalLooksEarnedCommified}
                        <Text ml={1} color="text-03" textStyle="helper">
                          (${totalLooksEarnedUsd})
                        </Text>
                      </Flex>
                    )}
                  </SectionRow>
                </VStack>
                <Divider my={6} />
                <Text color="text-03" textStyle="helper">
                  {t("WETH you earn is automatically converted to LOOKS, which is received over time.")}
                </Text>
                <Text color="text-03" textStyle="helper">
                  {t("LOOKS rewards are automatically compounded - no need to collect!")}
                </Text>
              </Box>
            </Collapsable>
          ) : (
            <CollapseableLoadingPlaceholder />
          ))}
      </Box>
    </>
  );
};
