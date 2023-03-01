import { Box, Flex, Grid, GridItem, useDisclosure } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { BigNumber } from "ethers";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { LISTING_REWARDS_TREE_ID, TRADING_REWARDS_TREE_ID } from "config";
import { useToast } from "hooks/useToast";
import { useSubmitTransaction } from "hooks/useSubmitTransaction";
import { useCoinPrices } from "hooks/useCoinPrices";
import { useInvalidateTradingListingRewards, UserRewardPayload } from "hooks/useGetTradingListingRewards";
import { Button, LogoRoundIcon, Text } from "uikit";
import { getErrorMessage } from "utils/errors";
import { claim } from "utils/calls/multiRewardsDistributor";
import { formatNumberToLocale, formatToSignificant, fromDecimals } from "utils/format";
import { ConfirmInWalletModal } from "components/Modals/ConfirmInWalletModal";
import { getDurationUntilNextDistribution } from "utils/getDurationUntilNextDistribution";

interface ClaimData {
  treeIds: number[];
  values: BigNumber[];
  proofs: Array<string[]>;
}

interface BodyMetaProps {
  totalListing: BigNumber;
  totalTrading: BigNumber;
}

const BodyMeta = ({ totalListing, totalTrading }: BodyMetaProps) => {
  const { t } = useTranslation();
  return (
    <Box p={4} bg="ui-bg">
      <Text as="p" textStyle="detail" color="text-03" mb={6}>
        {t("Collecting these pending rewards together, with no extra transaction fees!")}
      </Text>
      <Flex alignItems="center" justifyContent="space-between" mb={2}>
        <Text textStyle="detail" color="text-03">
          {t("Listing Rewards")}
        </Text>
        <Text textStyle="detail" bold color="text-02">
          {t("{{amount}} {{token}}", { amount: formatToSignificant(totalListing, 8), token: "LOOKS" })}
        </Text>
      </Flex>
      <Flex alignItems="center" justifyContent="space-between">
        <Text textStyle="detail" color="text-03">
          {t("Trading Rewards")}
        </Text>
        <Text textStyle="detail" bold color="text-02">
          {t("{{amount}} {{token}}", { amount: formatToSignificant(totalTrading, 8), token: "LOOKS" })}
        </Text>
      </Flex>
    </Box>
  );
};

const prepareClaimData = (data: UserRewardPayload): ClaimData => {
  const payload: ClaimData = {
    treeIds: [],
    values: [],
    proofs: [],
  };

  // Trading Rewards
  if (data.tradingRewards.proof && data.tradingRewards.pending.gt(0)) {
    payload.treeIds.push(TRADING_REWARDS_TREE_ID);
    payload.values.push(data.tradingRewards.total);
    payload.proofs.push(data.tradingRewards.proof);
  }

  // Listing Rewards
  if (data.listingRewards.proof && data.listingRewards.pending.gt(0)) {
    payload.treeIds.push(LISTING_REWARDS_TREE_ID);
    payload.values.push(data.listingRewards.total);
    payload.proofs.push(data.listingRewards.proof);
  }

  return payload;
};

interface ListingRewardCollectProps {
  userRewardPayload: UserRewardPayload;
  isLoading: boolean;
}

export const ListingRewardCollect = ({ userRewardPayload, isLoading }: ListingRewardCollectProps) => {
  const { t } = useTranslation();
  const { library, account } = useWeb3React();
  const toast = useToast();
  const collectDisclosure = useDisclosure();
  const router = useRouter();
  const { isPaused } = getDurationUntilNextDistribution();
  const tokenPriceQuery = useCoinPrices();
  const invalidateTradingListingRewards = useInvalidateTradingListingRewards();

  const { listingRewards, tradingRewards } = userRewardPayload;

  const totalPendingToCollect = listingRewards.pending.add(tradingRewards.pending);
  const totalPendingToCollectAsFloat = parseFloat(fromDecimals(totalPendingToCollect));
  const totalPendingValue = tokenPriceQuery.isSuccess ? totalPendingToCollectAsFloat * tokenPriceQuery.data.looks : 0;

  const { submitTransaction, isTxConfirmed, isTxSending, isTxWaiting, isTxError } = useSubmitTransaction({
    onSend: () => {
      const { treeIds, values, proofs } = prepareClaimData(userRewardPayload);
      return claim(library, account!, treeIds, values, proofs);
    },
    onSuccess: () => {
      toast({
        status: "success",
        title: t("Collected!"),
        description: t("Stake your rewards in the LOOKS compounder to earn more LOOKS!"),
      });
      invalidateTradingListingRewards(account!);
      collectDisclosure.onClose();
    },
    onError: (error) => {
      toast({ title: t("Error"), description: getErrorMessage(error), status: "error" });
    },
  });

  const handleClick = () => {
    submitTransaction();
    collectDisclosure.onOpen();
  };

  const actionHandler = () => {
    router.push("/rewards");
  };

  return (
    <>
      <Grid
        alignItems="center"
        gridTemplateColumns="1fr auto"
        gridGap={2}
        p={4}
        borderBottom="1px solid"
        borderColor="border-01"
      >
        <GridItem>
          <Text textStyle="helper" color="text-03" mb={2}>
            {t("Rewards")}
          </Text>
          <Flex alignItems="center">
            <LogoRoundIcon boxSize={5} />
            <Text bold textStyle="detail" mx={2}>
              {formatToSignificant(totalPendingToCollect, 8)}
            </Text>
            <Text textStyle="helper" color="text-03">
              {`($${formatNumberToLocale(totalPendingValue)})`}
            </Text>
          </Flex>
        </GridItem>
        <GridItem>
          <Button isDisabled={isPaused || totalPendingToCollect.isZero()} isLoading={isLoading} onClick={handleClick}>
            {isPaused ? t("Calculating") : t("Collect")}
          </Button>
        </GridItem>
      </Grid>
      <ConfirmInWalletModal
        isOpen={collectDisclosure.isOpen}
        onClose={collectDisclosure.onClose}
        onRetry={submitTransaction}
        bodyMetaComponent={<BodyMeta totalListing={listingRewards.pending} totalTrading={tradingRewards.pending} />}
        txConfirmedTitle={t("Collected")}
        txConfirmedText={t("Stake your rewards in the LOOKS compounder to earn more LOOKS")}
        actionText={t("Stake Now")}
        actionHandler={actionHandler}
        isTxConfirmed={isTxConfirmed}
        isTxSending={isTxSending}
        isTxWaiting={isTxWaiting}
        isTxError={isTxError}
      />
    </>
  );
};
