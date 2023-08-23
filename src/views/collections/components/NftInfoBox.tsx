import { ReactNode } from "react";
import { Box, BoxProps, Divider, Grid, GridItem, GridProps } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { NFT } from "types/graphql";
import { getExplorerLink } from "utils/chains";
import { formatAddress } from "utils/format";
import { isFeeAboveWarningThreshold } from "utils/isFeeAboveWarningThreshold";
import { ExternalLink, Text } from "uikit";
import { CreatorFeePopover } from "components/Fees";
import { useCalculateCreatorFeePercentage } from "hooks/calls/fees";

export interface NftInfoBoxProps extends BoxProps {
  nft: NFT;
}

interface InfoRowProps extends GridProps {
  rowTitle: ReactNode;
}

const InfoRow: React.FC<InfoRowProps> = ({ rowTitle, children, ...props }) => (
  <Grid alignItems="center" gridTemplateColumns="max-content 1fr" {...props}>
    <GridItem>
      <Text color="text-02" textStyle="detail">
        {rowTitle}
      </Text>
    </GridItem>
    <GridItem justifySelf="end">{children}</GridItem>
  </Grid>
);

export const NftInfoBox = ({ nft, ...props }: NftInfoBoxProps) => {
  const { t } = useTranslation();
  const creatorFeeQuery = useCalculateCreatorFeePercentage(nft.collection.address, nft.tokenId);
  const creatorFee = creatorFeeQuery.isSuccess ? creatorFeeQuery.data : 0;
  const isCreatorFeeWarning = isFeeAboveWarningThreshold(creatorFee);

  return (
    <Box p={4} bg="ui-01" {...props}>
      <InfoRow rowTitle={t("Token ID")} mb={4}>
        <Text bold textStyle="detail" isTruncated maxWidth="268px" title={nft.tokenId}>
          {nft.tokenId}
        </Text>
      </InfoRow>
      <InfoRow rowTitle={t("Contract")} mb={4}>
        <ExternalLink
          href={getExplorerLink(nft.collection.address, "address")}
          color="link-01"
          fontWeight={600}
          textStyle="detail"
        >
          {formatAddress(nft.collection.address)}
        </ExternalLink>
      </InfoRow>
      <InfoRow rowTitle={t("Blockchain")} mb={4}>
        <Text bold textStyle="detail">
          Ethereum
        </Text>
      </InfoRow>
      <InfoRow rowTitle={t("Token Standard")} mb={4}>
        <Text bold textStyle="detail">
          {nft.collection.type}
        </Text>
      </InfoRow>
      <Divider mb={4} />
      <InfoRow rowTitle={t("Creator Royalties")}>
        <CreatorFeePopover fee={creatorFee} isWarning={isCreatorFeeWarning} />
      </InfoRow>
    </Box>
  );
};
