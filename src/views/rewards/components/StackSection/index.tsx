import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useWeb3React } from "@web3-react/core";
import { Flex, Box, Skeleton, Divider } from "@chakra-ui/react";
import { formatToSignificant, toDecimals } from "utils/format";
import { Text } from "uikit";
import { useCalculateUserSharesValueInLOOKS } from "hooks/calls/useFeeSharingSystem";
import { useLooksBalance } from "hooks/useTokenBalance";
import { useCoinPrices } from "hooks/useCoinPrices";
import { SwitchButton } from "components/Buttons";
import { Collapsable } from "components/Collapsable";
import CollapseableLoadingPlaceholder from "components/Collapsable/CollapsableLoadingPlaceholder";
import { SectionRow } from "../SectionRow";
import ConnectWalletBox from "../ConnectWalletBox";
import { Stake } from "./Stake";
import { CollectWethRewardsRow } from "./CollectWethRewardsRow";
import { Unstake } from "./Unstake";

enum View {
  stake,
  unstake,
}

export const StakeSection = () => {
  const { t } = useTranslation();
  const { account } = useWeb3React();
  const [activeSwitchIndex, setActiveSwitchIndex] = useState(View.stake);
  const [shouldClaimRewardToken, setShouldClaimRewardToken] = useState(false);

  const looksBalanceQuery = useLooksBalance(account ?? "", { enabled: !!account });
  const userSharesQuery = useCalculateUserSharesValueInLOOKS(account ?? "", { enabled: !!account });
  const coinPricesQuery = useCoinPrices({ enabled: !!account });

  const userSharesLooksCommified = formatToSignificant(userSharesQuery.data || "0", 4);
  const looksBalanceCommified = formatToSignificant(looksBalanceQuery.data || "0", 4);

  const looksPriceWeiUsd = coinPricesQuery.isSuccess && toDecimals(coinPricesQuery.data.looks.toString());
  const userSharesUsd =
    userSharesQuery.isSuccess &&
    looksPriceWeiUsd &&
    formatToSignificant(userSharesQuery.data.mul(looksPriceWeiUsd).div(toDecimals("1")), 2);

  return (
    <>
      <Box>
        {!account && (
          <Collapsable headerProps={{ width: "100%" }} bg="transparent" header={<Text bold>{t("Your Stake")}</Text>}>
            <ConnectWalletBox />
          </Collapsable>
        )}
        {account &&
          (userSharesQuery.isSuccess ? (
            <Collapsable
              bg="transparent"
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
                {activeSwitchIndex === View.stake ? (
                  <Stake shouldClaimRewardToken={shouldClaimRewardToken} />
                ) : (
                  <Unstake shouldClaimRewardToken={shouldClaimRewardToken} />
                )}
                <SectionRow label={t("LOOKS in wallet")} mb={2}>
                  {looksBalanceQuery.isLoading && <Skeleton width="60px" height="20px" />}
                  {looksBalanceQuery.isSuccess && looksBalanceCommified}
                </SectionRow>
                <SectionRow label={t("Your Stake (Compounding)")}>
                  {coinPricesQuery.isLoading && <Skeleton width="48px" height="20px" />}
                  {coinPricesQuery.isSuccess && (
                    <Flex alignItems="baseline">
                      {userSharesLooksCommified}
                      <Text ml={1} color="text-03" textStyle="helper">
                        (${userSharesUsd})
                      </Text>
                    </Flex>
                  )}
                </SectionRow>
                <Divider pt={8} />
                <CollectWethRewardsRow onChange={(shouldClaim: boolean) => setShouldClaimRewardToken(shouldClaim)} />
              </Box>
            </Collapsable>
          ) : (
            <CollapseableLoadingPlaceholder />
          ))}
      </Box>
    </>
  );
};
