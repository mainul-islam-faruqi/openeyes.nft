import { Box, Flex, Skeleton } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { useRarityItem } from "hooks/useRarityItem";
import { Link, RaritySniperIcon, Text } from "uikit";
import { formatNumberToLocale } from "utils/format";

interface SingleTokenRarityScoreProps {
  collectionAddress: string;
  tokenId: string;
  totalSupply: number;
}

export const SingleTokenRarityScore = ({ collectionAddress, tokenId, totalSupply }: SingleTokenRarityScoreProps) => {
  const { t } = useTranslation();
  const rarityQuery = useRarityItem(collectionAddress, tokenId);
  const renderScore = () => {
    if (rarityQuery.isFetching) {
      return <Skeleton width="100%" height="21px" />;
    }

    if (rarityQuery.data) {
      return (
        <Text textStyle="detail" bold>
          {`${formatNumberToLocale(rarityQuery.data?.rank, 0, 0)} / ${formatNumberToLocale(totalSupply, 0, 0)}`}
        </Text>
      );
    }

    return (
      <Text textStyle="detail" color="text-02">
        N/A
      </Text>
    );
  };

  return (
    <Flex alignItems="center" bg="ui-01" borderRadius="md" p={2}>
      <Text textStyle="detail" color="text-03">
        {t("Rank")}
      </Text>
      <Box px={2} minWidth="40px">
        {renderScore()}
      </Box>
      {rarityQuery.isSuccess && rarityQuery.data ? (
        <Link href={rarityQuery.data?.raritySniperUrl} isExternal display="inline">
          <RaritySniperIcon boxSize={5} />
        </Link>
      ) : (
        <RaritySniperIcon boxSize={5} />
      )}
    </Flex>
  );
};
