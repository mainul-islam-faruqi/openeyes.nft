import { Box, Divider, Flex, Skeleton, VStack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { Popover, TooltipText } from "uikit";

interface AprProps {
  looksApr?: string;
  wethApr?: string;
}

export const LooksWethAprPopover: React.FC<AprProps> = ({ looksApr, wethApr, children }) => {
  const { t } = useTranslation();

  return (
    <Popover
      label={
        <Flex flexDirection="column" minWidth="280px">
          <TooltipText textStyle="detail" mb={4}>
            {t("This calculation includes both LOOKS and WETH earned through staking LOOKS.")}
          </TooltipText>
          <Divider bg="border-01" />
          <Flex justifyContent="space-between" my={4}>
            <TooltipText textStyle="detail">{t("Current {{token}} APR", { token: "LOOKS" })}</TooltipText>
            {looksApr ? (
              <TooltipText textStyle="detail" bold>
                {looksApr}%
              </TooltipText>
            ) : (
              <Skeleton height="16px" width="60px" />
            )}
          </Flex>
          <Divider bg="border-01" />
          <Flex justifyContent="space-between" my={4}>
            <TooltipText textStyle="detail">{t("Current {{token}} APR", { token: "WETH" })}</TooltipText>
            {wethApr ? (
              <TooltipText textStyle="detail" bold>
                {wethApr}%
              </TooltipText>
            ) : (
              <Skeleton height="16px" width="60px" />
            )}
          </Flex>
          <TooltipText textStyle="helper" mb={4}>
            {t(
              "The rates shown on this page are only provided for your reference: The actual rates will fluctuate according to many different factors, including token prices, trading volume, liquidity, amount staked, and more."
            )}
          </TooltipText>
          <TooltipText textStyle="helper">
            {t(
              "Trading fees collected by the protocol are distributed to LOOKS stakers as rewards. Reward rates are adjusted roughly every 24 hours, based on the past 24 hours’ trading activity."
            )}
          </TooltipText>
        </Flex>
      }
    >
      {children}
    </Popover>
  );
};

interface ApyProps extends AprProps {
  dailyCompounds?: number;
  wethApy?: string;
}

export const LooksAggregatorApyPopover: React.FC<ApyProps> = ({
  looksApr,
  wethApr,
  wethApy,
  dailyCompounds,
  children,
}) => {
  const { t } = useTranslation();

  return (
    <Popover
      label={
        <Box>
          <VStack alignItems="flex-start" spacing={2}>
            <Flex justifyContent="space-between" width="100%">
              <TooltipText textStyle="helper">{t("LOOKS APR")}</TooltipText>
              {looksApr ? (
                <TooltipText textStyle="helper" bold>
                  {looksApr}%
                </TooltipText>
              ) : (
                <Skeleton height="16px" width="60px" />
              )}
            </Flex>
            <Flex justifyContent="space-between" width="100%">
              <TooltipText textStyle="helper">{t("WETH (Fee Sharing) APR")}</TooltipText>
              {wethApr ? (
                <TooltipText textStyle="helper" bold>
                  {wethApr}%
                </TooltipText>
              ) : (
                <Skeleton height="16px" width="60px" />
              )}
            </Flex>
            <Flex justifyContent="space-between" width="100%">
              <TooltipText textStyle="helper">{t("WETH (Fee Sharing) APY")}</TooltipText>
              {wethApy ? (
                <TooltipText textStyle="helper" bold>
                  {wethApy}%
                </TooltipText>
              ) : (
                <Skeleton height="16px" width="60px" />
              )}
            </Flex>
            <Flex justifyContent="space-between" width="100%">
              <TooltipText textStyle="helper">{t("Daily estimated compounds")}</TooltipText>
              {dailyCompounds ? (
                <TooltipText textStyle="helper" bold>
                  {dailyCompounds}
                </TooltipText>
              ) : (
                <Skeleton height="16px" width="60px" />
              )}
            </Flex>
          </VStack>
          <VStack alignItems="flex-start" mt={4} spacing={4}>
            <Divider bg="border-01" />
            <TooltipText textStyle="helper" bold>
              {t("APY = (1 + WETH APY) * (1 + LOOKS APR) - 1")}
            </TooltipText>
            <TooltipText textStyle="caption">
              {t(
                "Rates shown are estimates, and fluctuate according to many different factors, including token prices, trading volume, liquidity, amount staked, and more."
              )}
            </TooltipText>
            <TooltipText textStyle="caption">
              {t(
                "Trading fees collected by the protocol are distributed to LOOKS stakers as rewards. Reward rates are adjusted roughly every 24 hours, based on the past 24 hours’ trading activity."
              )}
            </TooltipText>
          </VStack>
        </Box>
      }
    >
      {children}
    </Popover>
  );
};
