import { Skeleton } from "@chakra-ui/react";
import { useRarityItem } from "hooks/useRarityItem";
import { useTranslation } from "next-i18next";
import { Badge, Popover, TooltipText } from "uikit";
import { formatNumberToLocale } from "utils/format";

interface NftCardRarityRankProps {
  collectionAddress: string;
  tokenId: string;
  enableSingleRarityFetch: boolean;
  totalSupply: number;
}

export const NftCardRarityRank = ({
  collectionAddress,
  tokenId,
  enableSingleRarityFetch,
  totalSupply,
}: NftCardRarityRankProps) => {
  const { t } = useTranslation();
  const rarityQuery = useRarityItem(collectionAddress, tokenId, { enabled: enableSingleRarityFetch });

  if (rarityQuery.isFetching) {
    return <Skeleton height="21px" width="60px" borderRadius="md" />;
  }

  if (rarityQuery.data) {
    const rank = formatNumberToLocale(rarityQuery.data?.rank, 0, 0);
    return (
      <Popover
        placement="top"
        label={
          <>
            <TooltipText>
              {t("Rank {{rank}} / {{total}}", { rank, total: formatNumberToLocale(totalSupply, 0, 0) })}
            </TooltipText>
            <TooltipText>{t("Data by Rarity Sniper")}</TooltipText>
          </>
        }
        contentProps={{ p: 2 }}
      >
        <Badge size="sm" variant="outline" colorScheme="gray">
          {t("Rank {{rank}}", { rank })}
        </Badge>
      </Popover>
    );
  }

  return null;
};
