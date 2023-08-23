import { useTranslation } from "next-i18next";
import { constants } from "ethers";
import { useCollectionStats } from "hooks/graphql/collections";
import {
  DataPointAmountWei,
  DataPointLabel,
  DataPointMeta,
  DataPointPercentChangeLabel,
  DataPointWrapper,
  DisplayAlignment,
} from "components/DataPoint";

interface DailyFloorDataPointProps {
  collectionAddress: string;
  isFixedSize?: boolean;
  align?: DisplayAlignment;
}

export const DailyFloorDataPoint = ({
  collectionAddress,
  isFixedSize = false,
  align = "left",
}: DailyFloorDataPointProps) => {
  const { t } = useTranslation();
  const collectionStatsQuery = useCollectionStats(collectionAddress);
  const volume24h = collectionStatsQuery.data?.volume.volume24h || constants.Zero;
  const volume24hChange = collectionStatsQuery.data?.volume.change24h || 0;

  return (
    <DataPointWrapper align={align}>
      <DataPointAmountWei
        totalWei={volume24h}
        currencyIcon="eth"
        isLoading={collectionStatsQuery.isLoading}
        isFixedSize={isFixedSize}
      />
      <DataPointMeta>
        <DataPointLabel isFixedSize={isFixedSize}>{t("24h Vol")}</DataPointLabel>
        <DataPointPercentChangeLabel value={volume24hChange} />
      </DataPointMeta>
    </DataPointWrapper>
  );
};
