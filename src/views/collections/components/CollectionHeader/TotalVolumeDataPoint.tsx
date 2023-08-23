import { useTranslation } from "next-i18next";
import { constants } from "ethers";
import { useCollectionStats } from "hooks/graphql/collections";
import {
  DataPointAmountWei,
  DataPointLabel,
  DataPointMeta,
  DataPointWrapper,
  DisplayAlignment,
} from "components/DataPoint";

interface TotalVolumeDataPointProps {
  collectionAddress: string;
  isFixedSize?: boolean;
  align?: DisplayAlignment;
}

export const TotalVolumeDataPoint = ({
  collectionAddress,
  isFixedSize = false,
  align = "left",
}: TotalVolumeDataPointProps) => {
  const { t } = useTranslation();
  const collectionStatsQuery = useCollectionStats(collectionAddress);
  const volumeAll = collectionStatsQuery.data?.volume.volumeAll || constants.Zero;

  return (
    <DataPointWrapper align={align}>
      <DataPointAmountWei
        totalWei={volumeAll}
        currencyIcon="eth"
        isLoading={collectionStatsQuery.isLoading}
        isFixedSize={isFixedSize}
      />
      <DataPointMeta>
        <DataPointLabel isFixedSize={isFixedSize}>{t("Total Vol")}</DataPointLabel>
      </DataPointMeta>
    </DataPointWrapper>
  );
};
