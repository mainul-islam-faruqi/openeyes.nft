import { Box } from "@chakra-ui/react";
import { BigNumber, BigNumberish, constants } from "ethers";
import { commify } from "ethers/lib/utils.js";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { Popover, Text, TooltipText } from "uikit";
import { Collection } from "types/graphql";
import { formatCompactNumber, formatNumberToLocale, formatToSignificant } from "utils/format";
import { useCollectionMetrics } from "hooks/api/nftgo";
import {
  ContentRow,
  DataPointAmount,
  DataPointLabel,
  DataPointMeta,
  DataPointWrapper,
  DisplayAlignment,
  EthDataPointValue,
} from "components/DataPoint";

interface MarketCapDataPointProps {
  collectionAddress: string;
  totalSupply: Collection["totalSupply"];
  globalFloor?: BigNumberish | null;
  isFixedSize?: boolean;
  align?: DisplayAlignment;
}

export const MarketCapDataPoint = ({
  collectionAddress,
  totalSupply,
  globalFloor,
  isFixedSize = false,
  align = "left",
}: MarketCapDataPointProps) => {
  const { t } = useTranslation();
  const { locale = "en" } = useRouter();
  const collectionMetricsQuery = useCollectionMetrics(collectionAddress);

  const marketCap = collectionMetricsQuery.data?.marketCap || 0;
  const globalFloorBigNumber = BigNumber.from(globalFloor ?? constants.Zero);
  const floorFormatted = globalFloorBigNumber.isZero() ? undefined : formatToSignificant(globalFloorBigNumber, 4);

  if (collectionMetricsQuery.isError) {
    return null;
  }

  return (
    <Popover
      renderInPortal
      label={
        <Box>
          <Box mb={4}>
            {!!totalSupply && (
              <ContentRow label={t("Circulating Supply")} pb={1}>
                <Text textStyle="detail" color="text-inverse" bold>
                  {commify(totalSupply.toString())}
                </Text>
              </ContentRow>
            )}
            {!!floorFormatted && (
              <ContentRow label={t("Floor")} py={1}>
                <EthDataPointValue>{floorFormatted}</EthDataPointValue>
              </ContentRow>
            )}
            <ContentRow label={t("Market Cap")} borderTop="1px solid" borderTopColor="border-01" py={1}>
              <EthDataPointValue> {formatNumberToLocale(marketCap, 0, 2)}</EthDataPointValue>
            </ContentRow>
          </Box>
          <TooltipText textStyle="helper" color="text-inverse-03">
            {t(
              "Market Cap = the sum of each NFT, valued at the greater of: 1) its last traded price or 2) the floor price of the collection. Excludes suspected inauthentic trades. Data provided by NFTGo."
            )}
          </TooltipText>
        </Box>
      }
    >
      <span>
        <DataPointWrapper align={align}>
          <DataPointAmount currencyIcon="eth" isLoading={collectionMetricsQuery.isLoading} isFixedSize={isFixedSize}>
            {formatCompactNumber(marketCap, locale, 4)}
          </DataPointAmount>
          <DataPointMeta>
            <DataPointLabel isFixedSize={isFixedSize}>{t("M. Cap")}</DataPointLabel>
          </DataPointMeta>
        </DataPointWrapper>
      </span>
    </Popover>
  );
};
