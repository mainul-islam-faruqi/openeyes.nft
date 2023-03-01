import { Box, Divider, Flex, useDisclosure } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { useGetTradingListingRewards } from "hooks/useGetTradingListingRewards";
import { useTranslation } from "next-i18next";
import { ChevronDown, ChevronUp, Text } from "uikit";
import { getDurationUntilNextDistribution } from "utils/getDurationUntilNextDistribution";
import { SectionRow } from "../SectionRow";
import { ListingRewardCollect } from "./ListingRewardCollect";
import { TokenWithPriceDisplay } from "./shared";

export const ListingRewardCollectionPane = () => {
  const { t } = useTranslation();
  const disclosure = useDisclosure({ defaultIsOpen: true });
  const { account } = useWeb3React();
  const userRewardQuery = useGetTradingListingRewards(account!, { enabled: !!account });
  const { nextDistribution, nextPause, timeUntilDistribution, timeUntilPause } = getDurationUntilNextDistribution();

  return (
    <Box bg="ui-01" borderBottomLeftRadius="lg" borderBottomRightRadius="lg">
      {userRewardQuery.isSuccess && (
        <ListingRewardCollect userRewardPayload={userRewardQuery.data} isLoading={userRewardQuery.isLoading} />
      )}
      <Flex
        alignItems="center"
        p={4}
        cursor="pointer"
        onClick={disclosure.onToggle}
        userSelect="none"
        sx={{ _hover: { bg: "hover-ui", _active: { bg: "onclick-ui" } } }}
        borderBottomLeftRadius={disclosure.isOpen ? "0" : "lg"}
        borderBottomRightRadius={disclosure.isOpen ? "0" : "lg"}
      >
        <Text textStyle="helper" color="text-03" flex={1}>
          {t("Details")}
        </Text>
        {disclosure.isOpen ? <ChevronUp /> : <ChevronDown />}
      </Flex>
      {disclosure.isOpen && (
        <Box p={4}>
          <Text color="text-03" textStyle="helper" mb={6}>
            {t(
              "You can collect rewards in the 22 hours between {{nextDistribution}} and {{nextPause}} every day. Don't worry, your rewards won't disappear: they're just unavailable for those two hours.",
              {
                nextPause: nextPause.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                nextDistribution: nextDistribution.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              }
            )}
          </Text>
          <SectionRow label={t("Listing Rewards to collect")} mb={2}>
            <TokenWithPriceDisplay amount={userRewardQuery.data?.listingRewards.pending} />
          </SectionRow>
          <SectionRow label={t("Trading Rewards to collect")}>
            <TokenWithPriceDisplay amount={userRewardQuery.data?.tradingRewards.pending} />
          </SectionRow>
          <Divider my={2} />
          <SectionRow label={t("Next distribution")} mb={2}>
            {timeUntilDistribution}
          </SectionRow>
          <SectionRow label={t("Next Pause")} mb={2}>
            {timeUntilPause}
          </SectionRow>
        </Box>
      )}
    </Box>
  );
};
