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

interface WeeklyFloorDataPointProps {
  collectionAddress: string;
  isFixedSize?: boolean;
  align?: DisplayAlignment;
}

export const WeeklyFloorDataPoint = ({
  collectionAddress,
  isFixedSize = false,
  align = "left",
}: WeeklyFloorDataPointProps) => {
  const { t } = useTranslation();
  const collectionStatsQuery = useCollectionStats(collectionAddress);
  const volume7d = collectionStatsQuery.data?.volume.volume7d || constants.Zero;
  const volume7dChange = collectionStatsQuery.data?.volume.change7d || 0;

  return (
    <DataPointWrapper align={align}>
      <DataPointAmountWei
        totalWei={volume7d}
        currencyIcon="eth"
        isLoading={collectionStatsQuery.isLoading}
        isFixedSize={isFixedSize}
      />
      <DataPointMeta>
        <DataPointLabel isFixedSize={isFixedSize}>{t("7d Vol")}</DataPointLabel>
        <DataPointPercentChangeLabel value={volume7dChange} />
      </DataPointMeta>
    </DataPointWrapper>
  );
};
