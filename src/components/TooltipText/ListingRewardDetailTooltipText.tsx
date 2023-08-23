import { Divider, Flex, Skeleton } from "@chakra-ui/react";
import { BigNumber } from "ethers";
import { Trans, useTranslation } from "next-i18next";
import { DAILY_FLOOR_THRESHOLD, DAILY_LISTING_REWARD_INTERVAL } from "config/constants";
import { TooltipText, LogoPolygonIcon, LogoRoundIcon, WarningFilledIcon } from "uikit";
import { formatNumberToLocale, formatToSignificant } from "utils/format";
import { getEstimatedLooksPerListing } from "utils/getEstimatedLooksPerListing";
import { TooltipTextText } from "./shared";

interface ListingRewardDetailTooltipTextProps {
  count: number;
  points: number | null;
  totalPoints: number;
  hasReachedThreshold: boolean;
  maxQualifyingFloor: BigNumber;
  isLoading?: boolean;
}

export const ListingRewardDetailTooltipText = ({
  count,
  points,
  totalPoints,
  hasReachedThreshold,
  maxQualifyingFloor,
  isLoading = false,
}: ListingRewardDetailTooltipTextProps) => {
  const { t } = useTranslation();
  const estimatedLooks = getEstimatedLooksPerListing(points, totalPoints, count);
  const maxQualifyingFloorDisplay = formatToSignificant(maxQualifyingFloor, 4);

  return (
    <TooltipText>
      <Flex>
        {hasReachedThreshold ? (
          <WarningFilledIcon color="support-warning-inverse" flexShrink={0} />
        ) : (
          <LogoPolygonIcon color="purple.400" flexShrink={0} />
        )}
        <TooltipTextText textStyle="helper" as="p" ml={2}>
          {hasReachedThreshold ? (
            <Trans i18nKey="globabFloorThresholdReached">
              Price is more than {{ DAILY_FLOOR_THRESHOLD }}x higher than the current global floor. Lower price to{" "}
              <TooltipTextText as="span" textStyle="helper" bold>
                {{ maxQualifyingFloorDisplay }} ETH
              </TooltipTextText>{" "}
              to start accumulating points.
            </Trans>
          ) : (
            <Trans i18nKey="globalFloorThresholdGenericMessage">
              Earn LOOKS by listing this NFT for{" "}
              <TooltipTextText as="span" textStyle="helper" bold>
                {{ maxQualifyingFloorDisplay }} ETH
              </TooltipTextText>{" "}
              or less. Check the Rewards page for more info.
            </Trans>
          )}
        </TooltipTextText>
      </Flex>
      {points && (
        <>
          <Divider my={4} />
          <Flex alignItems="center" justifyContent="space-between" mb={2}>
            <TooltipTextText textStyle="helper">
              {t("Points per listing (every {{interval}}m)", { interval: DAILY_LISTING_REWARD_INTERVAL })}
            </TooltipTextText>
            <Flex alignItems="center">
              <TooltipTextText textStyle="detail" bold>
                {formatNumberToLocale(points, 0, 0)}
              </TooltipTextText>
              <LogoPolygonIcon boxSize={5} color="purple.500" ml={1} />
            </Flex>
          </Flex>
          <Flex alignItems="center" justifyContent="space-between">
            <TooltipTextText textStyle="helper">{t("Est. 24h rewards per listing")}</TooltipTextText>
            <Flex alignItems="center">
              {isLoading ? (
                <Skeleton height={4} width={5} />
              ) : (
                <TooltipTextText textStyle="detail" bold>
                  {formatNumberToLocale(estimatedLooks, 0, 2)}
                </TooltipTextText>
              )}
              <LogoRoundIcon boxSize={5} ml={1} />
            </Flex>
          </Flex>
        </>
      )}
    </TooltipText>
  );
};
