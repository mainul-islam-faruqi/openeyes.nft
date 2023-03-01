import { useQueryClient } from "react-query";
import { useTranslation } from "react-i18next";
import { Box, Divider, Flex, Skeleton, useDisclosure } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { HelpIcon, LogoRoundIcon, Popover, Text, TooltipText, WethIcon } from "uikit";
import { harvest } from "utils/calls/feeSharingSystem";
import {
  formatNumberToLocale,
  formatTimestampAsDateString,
  formatToSignificant,
  formatUsd,
  toDecimals,
} from "utils/format";
import { getErrorMessage } from "utils/errors";
import {
  BASE_FEE_SHARING_KEY,
  useCalculatePendingUserRewards,
  useCalculateUserSharesValueInLOOKS,
} from "hooks/calls/useFeeSharingSystem";
import { useToast } from "hooks/useToast";
import { BASE_TOKEN_BALANCE_KEY } from "hooks/useTokenBalance";
import { useSubmitTransaction } from "hooks/useSubmitTransaction";
import { useCoinPrices } from "hooks/useCoinPrices";
import { BASE_REWARDS_SUBGRAPH_KEY, useRewardsSubgraph } from "hooks/subgraphs/useLooksStaking";
import { ConfirmInWalletModal } from "components/Modals/ConfirmInWalletModal";
import { Collapsable } from "components/Collapsable";
import CollapseableLoadingPlaceholder from "components/Collapsable/CollapsableLoadingPlaceholder";
import { CollectToken } from "./CollectToken";
import { WethTokenLabel } from "./TokenLabel";
import { SectionRow } from "./SectionRow";
import ConnectWalletBox from "./ConnectWalletBox";

export const WethRewardCollectionSection = () => {
  const client = useQueryClient();
  const { account, library } = useWeb3React();
  const { t } = useTranslation();
  const toast = useToast();
  const coinPricesQuery = useCoinPrices();
  const pendingWethRewardsQuery = useCalculatePendingUserRewards(account ?? "", { enabled: !!account });
  const userSubgraphQuery = useRewardsSubgraph(account ?? "", {
    enabled: !!account,
  });
  const userSharesInLooksQuery = useCalculateUserSharesValueInLOOKS(account ?? "", { enabled: !!account });

  // avoid race conditions, wait for both requests to display derived data
  const allDataForCalculationsLoaded = userSharesInLooksQuery.isSuccess && userSubgraphQuery.isSuccess;

  const lastWethCollectionTimestamp =
    userSubgraphQuery.data?.feeSharingLastHarvestDate && userSubgraphQuery.data?.feeSharingLastHarvestDate !== "0"
      ? formatTimestampAsDateString(parseInt(userSubgraphQuery.data.feeSharingLastHarvestDate, 10) * 1000)
      : "-";

  const feeSharingWethCollectedFloat = parseFloat(userSubgraphQuery.data?.feeSharingTotalCollectedWETH || "0");
  const wethCollectedUsd =
    coinPricesQuery.isSuccess && formatUsd(feeSharingWethCollectedFloat * coinPricesQuery.data.eth);

  const feeSharingAdjustedDepositWei = toDecimals(userSubgraphQuery.data?.feeSharingAdjustedDepositAmount || "0");
  const collectedLooksEarned = toDecimals(userSubgraphQuery.data?.feeSharingTotalCollectedLOOKS || "0");
  const stakingPoolLooksEarned = userSharesInLooksQuery.data?.sub(feeSharingAdjustedDepositWei);
  const looksEarnedToDateWei = stakingPoolLooksEarned && collectedLooksEarned.add(stakingPoolLooksEarned);

  const looksPriceWeiUsd = coinPricesQuery.isSuccess && toDecimals(coinPricesQuery.data.looks.toString());
  const looksEarnedToDateUsd =
    looksEarnedToDateWei &&
    looksPriceWeiUsd &&
    formatToSignificant(looksEarnedToDateWei.mul(looksPriceWeiUsd).div(toDecimals("1")), 2);

  const { isOpen: isConfirmModalOpen, onOpen: onOpenConfirmModal, onClose: onCloseConfirmModal } = useDisclosure();

  const onSuccess = () => {
    toast({ title: "Collected!", description: "Your WETH is now in your wallet.", status: "success" });
    client.invalidateQueries(BASE_FEE_SHARING_KEY);
    client.invalidateQueries(BASE_TOKEN_BALANCE_KEY);
    client.invalidateQueries([BASE_REWARDS_SUBGRAPH_KEY]);
    onCloseConfirmModal();
  };

  const onError = (error: any) => {
    toast({ title: "Error", description: getErrorMessage(error), status: "error" });
  };

  const { submitTransaction, isTxConfirmed, isTxSending, isTxWaiting, isTxError } = useSubmitTransaction({
    onSend: () => harvest(library, account!),
    onSuccess,
    onError,
  });

  const handleCollect = () => {
    submitTransaction();
    onOpenConfirmModal();
  };

  return (
    <>
      <ConfirmInWalletModal
        isOpen={isConfirmModalOpen}
        onClose={onCloseConfirmModal}
        isTxConfirmed={isTxConfirmed}
        isTxSending={isTxSending}
        isTxWaiting={isTxWaiting}
        isTxError={isTxError}
      />
      <Box>
        {!account && (
          <Collapsable
            headerProps={{ width: "100%" }}
            bg="transparent"
            header={<Text bold>{t("Rewards to Collect")}</Text>}
          >
            <ConnectWalletBox />
          </Collapsable>
        )}
        {account &&
          (pendingWethRewardsQuery.isSuccess ? (
            <Collapsable
              headerProps={{ width: "100%" }}
              defaultIsOpen={pendingWethRewardsQuery.data.gt(0)}
              bg="transparent"
              header={
                <Flex width="100%" justifyContent="space-between">
                  <Text bold>{t("Rewards to Collect")}</Text>
                  <Text bold mr={3}>
                    {formatToSignificant(pendingWethRewardsQuery.data || 0, 4)}
                  </Text>
                </Flex>
              }
            >
              <Box bg="ui-01" py={6} px={4}>
                <Flex alignItems="center" justifyContent="space-between">
                  <Text color="text-03" textStyle="helper" mb={6}>
                    {t("WETH rewards from the pool are distributed every block.")}
                  </Text>
                  <Popover
                    label={
                      <TooltipText>
                        {t(
                          "Trading fees collected by the protocol are distributed to LOOKS stakers as rewards. Reward rates are adjusted roughly every 24 hours, based on the past 24 hours’ trading activity."
                        )}
                      </TooltipText>
                    }
                  >
                    <Flex display="inline-flex" mb={6}>
                      <Text color="text-disabled" mr={2} bold>
                        {t("What's this")}
                      </Text>
                      <HelpIcon color="text-03" />
                    </Flex>
                  </Popover>
                </Flex>
                <CollectToken
                  onCollect={handleCollect}
                  leftIcon={<WethIcon />}
                  isDisabled={!account || pendingWethRewardsQuery.data.isZero()}
                  isLoading={isConfirmModalOpen}
                >
                  <WethTokenLabel amount={pendingWethRewardsQuery.data} />
                </CollectToken>
                <SectionRow label={t("Last collected")} mt={6} mb={2}>
                  {!allDataForCalculationsLoaded ? (
                    <Skeleton width="60px" height="20px" />
                  ) : (
                    lastWethCollectionTimestamp
                  )}
                </SectionRow>
                <SectionRow label={t("Collected to date")}>
                  {!allDataForCalculationsLoaded ? (
                    <Skeleton width="60px" height="20px" />
                  ) : (
                    <Flex alignItems="baseline">
                      {formatNumberToLocale(feeSharingWethCollectedFloat, 1, 4)}
                      <Text ml={1} color="text-03" textStyle="helper">
                        ({wethCollectedUsd})
                      </Text>
                    </Flex>
                  )}
                </SectionRow>
                <Divider my={6} bg="ui-02" />
                <Text color="text-03" textStyle="helper" mb={6}>
                  {t("LOOKS rewards are automatically compounded - no need to collect!")}
                </Text>
                <Flex justifyContent="space-between" mb={6}>
                  <Flex>
                    <LogoRoundIcon mr={2} />
                    <Text color="text-01" bold>
                      LOOKS
                    </Text>
                  </Flex>
                  <Popover
                    label={
                      <TooltipText>
                        {t("When you stake LOOKS, you also earn extra LOOKS as a bonus reward.")}
                      </TooltipText>
                    }
                  >
                    <Flex display="inline-flex">
                      <Text color="text-disabled" bold mr={2}>
                        {t("Compounding")}
                      </Text>
                      <HelpIcon color="text-03" />
                    </Flex>
                  </Popover>
                </Flex>
                <SectionRow label={t("Earned to date")}>
                  {!allDataForCalculationsLoaded ? (
                    <Skeleton width="60px" height="20px" />
                  ) : looksEarnedToDateWei ? (
                    <Flex alignItems="baseline">
                      {formatToSignificant(looksEarnedToDateWei, 4)}
                      <Text ml={1} color="text-03" textStyle="helper">
                        (${looksEarnedToDateUsd})
                      </Text>
                    </Flex>
                  ) : (
                    "0.0"
                  )}
                </SectionRow>
              </Box>
            </Collapsable>
          ) : (
            <CollapseableLoadingPlaceholder />
          ))}
      </Box>
    </>
  );
};
