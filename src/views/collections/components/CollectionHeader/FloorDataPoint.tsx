import { useTranslation } from "next-i18next";
import { Popover } from "uikit";
import { useCollectionStats } from "hooks/graphql/collections";
import { useRealtimeCollectionGlobalFloor } from "hooks/realtime/collections";
import { FloorTooltipText } from "components/TooltipText";
import { formatToSignificant } from "utils/format";
import {
  DataPointAmount,
  DataPointLabel,
  DataPointMeta,
  DataPointPercentChangeLabel,
  DataPointWrapper,
  DisplayAlignment,
} from "components/DataPoint";

interface FloorDataPointProps {
  collectionAddress: string;
  isFixedSize?: boolean;
  align?: DisplayAlignment;
}

export const FloorDataPoint = ({ collectionAddress, isFixedSize = false, align = "left" }: FloorDataPointProps) => {
  const { t } = useTranslation();
  const collectionStatsQuery = useCollectionStats(collectionAddress);
  const floor = collectionStatsQuery.data?.floor;
  const percentChange = floor?.floorChange24h || 0;

  const liveGlobalFloor = useRealtimeCollectionGlobalFloor(collectionAddress);
  const globalFloor = liveGlobalFloor !== undefined ? liveGlobalFloor : floor?.floorPriceGlobal;

  return (
    <Popover
      label={<FloorTooltipText amountLr={floor?.floorPriceLooksRare} amountGlobal={floor?.floorPriceGlobal} />}
      placement="auto"
    >
      <span>
        <DataPointWrapper align={align}>
          <DataPointAmount currencyIcon="eth" isLoading={collectionStatsQuery.isLoading} isFixedSize={isFixedSize}>
            {globalFloor ? formatToSignificant(globalFloor, 4) : "-"}
          </DataPointAmount>
          <DataPointMeta>
            <DataPointLabel isFixedSize={isFixedSize}>{t("Floor")}</DataPointLabel>
            <DataPointPercentChangeLabel value={percentChange} />
          </DataPointMeta>
        </DataPointWrapper>
      </span>
    </Popover>
  );
};
