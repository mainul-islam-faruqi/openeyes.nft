import { Box } from "@chakra-ui/react";
import { commify } from "ethers/lib/utils.js";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { Collection } from "types/graphql";
import { Popover, Text, TooltipText } from "uikit";
import { getOwnerData } from "utils/collection";
import { formatCompactNumber, formatNumberToLocale } from "utils/format";
import { useCollectionStats } from "hooks/graphql/collections";
import {
  ContentRow,
  DataPointAmount,
  DataPointLabel,
  DataPointMeta,
  DataPointWrapper,
  DisplayAlignment,
} from "components/DataPoint";

interface OwnersDataPointProps {
  address: Collection["address"];
  totalSupply: Collection["totalSupply"];
  isErc1155: boolean;
  isFixedSize?: boolean;
  align?: DisplayAlignment;
}

export const OwnersDataPoint = ({
  address,
  totalSupply,
  isErc1155,
  isFixedSize = false,
  align = "left",
  ...props
}: OwnersDataPointProps) => {
  const { t } = useTranslation();
  const { locale = "en" } = useRouter();
  const { data, isLoading } = useCollectionStats(address);
  const countOwners = data?.countOwners;
  const { ownerCountNum, uniqueOwners } = getOwnerData(countOwners, totalSupply, isErc1155);
  const ownerCountDisplay = formatCompactNumber(ownerCountNum, locale);
  const uniqueOwnerRatioDisplay = `${formatNumberToLocale(uniqueOwners, 0, 1)}%`;

  return (
    <Popover
      renderInPortal
      label={
        <Box>
          <Box mb={4}>
            <ContentRow label={t("Owners")} pb={1}>
              <Text textStyle="detail" color="text-inverse" bold>
                {commify(ownerCountNum)}
              </Text>
            </ContentRow>
            {!!totalSupply && (
              <ContentRow label={t("Circulating Supply")} py={1}>
                <Text textStyle="detail" color="text-inverse" bold>
                  {commify(totalSupply.toString())}
                </Text>
              </ContentRow>
            )}
            <ContentRow label={t("Unique Owner Ratio")} borderTop="1px solid" borderTopColor="border-01" py={1}>
              <Text textStyle="detail" color="text-inverse" bold>
                {uniqueOwnerRatioDisplay}
              </Text>
            </ContentRow>
          </Box>
          <TooltipText textStyle="helper" color="text-inverse-03" as="p" mb={2}>
            {t("Unique Owner Ratio = Owners / Circulating Supply * 100")}
          </TooltipText>
          <TooltipText textStyle="helper" color="text-inverse-03" as="p">
            {t("A higher ratio suggests that the collection is more evenly distributed.")}
          </TooltipText>
        </Box>
      }
    >
      <span>
        <DataPointWrapper align={align} {...props}>
          <DataPointAmount isLoading={isLoading} isFixedSize={isFixedSize}>
            {ownerCountDisplay}
          </DataPointAmount>
          <DataPointMeta>
            <DataPointLabel isFixedSize={isFixedSize}>{t("Owners")}</DataPointLabel>
            {!isErc1155 && (
              <DataPointLabel textStyle="caption" bold color="text-02">
                {uniqueOwnerRatioDisplay}
              </DataPointLabel>
            )}
          </DataPointMeta>
        </DataPointWrapper>
      </span>
    </Popover>
  );
};
