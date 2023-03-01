import { Box, Skeleton } from "@chakra-ui/react";
import { Trans, useTranslation } from "react-i18next";
import { Button, ExternalLink, HelpIcon, RainbowText, Text } from "uikit";
import { addresses, SWAP_URL } from "config";
import { formatNumberToLocale } from "utils/format";
import { getAggregatorApy } from "utils/apr";
import { useLooksStakingApr } from "hooks/useLooksStakingApr";
import { useFeeSharingWethRewardsApy } from "hooks/useFeeSharingWethRewardsApy";
import { useIsMetaMaskish } from "hooks/useIsMetaMaskish";
import { AddLooksToWalletButton } from "components/Buttons";
import { LooksAggregatorApyPopover } from "./Popovers";

export const LooksApyCallout = () => {
  const { t } = useTranslation();
  const isMetaMaskIsh = useIsMetaMaskish();

  const { apr: looksApr } = useLooksStakingApr();
  const { apr: wethApr, apy: wethApy, dailyCompounds } = useFeeSharingWethRewardsApy();

  const annualApyToLocale = looksApr && wethApy ? formatNumberToLocale(getAggregatorApy(wethApy, looksApr)) : undefined;
  const looksAprToLocale = looksApr ? formatNumberToLocale(looksApr) : undefined;
  const wethAprToLocale = wethApr ? formatNumberToLocale(wethApr) : undefined;
  const wethApyToLocale = wethApy ? formatNumberToLocale(wethApy) : undefined;

  return (
    <>
      <Box mb={8}>
        <Trans i18nKey="transStakingViewHeadlineApy">
          <Text as="h1" textStyle="heading-03" color="text-02" bold mb={8}>
            Stake LOOKS, earn up to
          </Text>
          {annualApyToLocale ? (
            <RainbowText
              as="h2"
              animate
              bg="base.linearGradient"
              textStyle="display-01"
              display="inline-block"
              mr={2}
              bold
            >
              {{ annualApyToLocale }}% APY
            </RainbowText>
          ) : (
            <Skeleton height="72px" width="280px" display="inline-block" mr={2} />
          )}
        </Trans>
        <LooksAggregatorApyPopover
          looksApr={looksAprToLocale}
          wethApr={wethAprToLocale}
          wethApy={wethApyToLocale}
          dailyCompounds={dailyCompounds}
        >
          <span>
            <HelpIcon color="text-03" />
          </span>
        </LooksAggregatorApyPopover>
      </Box>
      <Button
        id="rewards-view-buy-looks"
        as={ExternalLink}
        variant="outline"
        href={`${SWAP_URL}?outputCurrency=${addresses.LOOKS}`}
      >
        {t("Buy {{token}}", { token: "LOOKS" })}
      </Button>
      {isMetaMaskIsh && (
        <AddLooksToWalletButton id="rewards-view-add-to-wallet" isRightIcon ml={6}>
          {t("Add to Wallet")}
        </AddLooksToWalletButton>
      )}
    </>
  );
};
