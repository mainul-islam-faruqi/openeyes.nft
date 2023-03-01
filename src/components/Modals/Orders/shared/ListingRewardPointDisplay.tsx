import { useMemo } from "react";
import { Flex } from "@chakra-ui/react";
import { BigNumber, constants } from "ethers";
import { DAILY_FLOOR_THRESHOLD } from "config/constants";
import { useCurrentListingReward } from "hooks/graphql/currentListingReward";
import { HelpIcon, LogoPolygonIcon, Popover, Text, WarningFilledIcon } from "uikit";
import { formatNumberToLocale, toDecimals } from "utils/format";
import { ListingRewardDetailTooltipText } from "components/TooltipText/ListingRewardDetailTooltipText";

interface ListingRewardPointDisplayProps {
  points: number | null;
  globalFloor: BigNumber;
  priceInEth: string;
}

export const ListingRewardPointDisplay = ({ points, globalFloor, priceInEth }: ListingRewardPointDisplayProps) => {
  const currentListingRewardQuery = useCurrentListingReward({ enabled: !!points && points > 0 });
  const totalPoints = currentListingRewardQuery.isSuccess ? currentListingRewardQuery.data.totalPoints : 0;
  const count = currentListingRewardQuery.isSuccess ? currentListingRewardQuery.data.count : 0;

  const priceInWei = useMemo(() => {
    try {
      return toDecimals(priceInEth);
    } catch {
      return constants.Zero;
    }
  }, [priceInEth]);
  const multiplyerBn = toDecimals(DAILY_FLOOR_THRESHOLD.toString(), 4);
  const maxQualifyingFloor = globalFloor.mul(multiplyerBn).div(10000);
  const hasReachedThreshold = priceInWei.gt(maxQualifyingFloor);

  if (!points) {
    return null;
  }

  return (
    <Popover
      placement="right"
      label={
        <ListingRewardDetailTooltipText
          points={points}
          totalPoints={totalPoints}
          count={count}
          hasReachedThreshold={hasReachedThreshold}
          maxQualifyingFloor={maxQualifyingFloor}
          isLoading={currentListingRewardQuery.isLoading}
        />
      }
    >
      <Flex alignItems="center">
        <LogoPolygonIcon color="purple.400" boxSize={4} />
        <Text textStyle="helper" color="text-01" bold mx={1}>
          {formatNumberToLocale(points || 0, 0, 0)}
        </Text>
        {hasReachedThreshold ? (
          <WarningFilledIcon boxSize={4} color="support-warning-inverse" flexShrink={0} />
        ) : (
          <HelpIcon boxSize={4} color="text-03" />
        )}
      </Flex>
    </Popover>
  );
};
