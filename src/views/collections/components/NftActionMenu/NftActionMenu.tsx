import { RefObject } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { getExplorerLink } from "utils/chains";
import { EtherscanLinkButton } from "components/Buttons";
import { ShareButton } from "components/Buttons";
import { NFT } from "types/graphql";
import { ExpandButton } from "./ExpandButton";
import RefreshMetadataButton from "./RefreshMetadataButton";

interface NftActionMenuProps {
  nft: NFT;
  imageRef: RefObject<HTMLDivElement>;
}

export const NftActionMenu = ({ nft, imageRef }: NftActionMenuProps) => {
  const { t } = useTranslation();

  return (
    <Flex alignItems="center" justifyContent="space-between">
      <Box>
        <ExpandButton imageRef={imageRef} />
      </Box>
      <Flex alignItems="center">
        <RefreshMetadataButton tokenId={nft.tokenId} collectionAddress={nft.collection.address} />
        <EtherscanLinkButton href={getExplorerLink(nft.collection.address, "address")} />
        <ShareButton
          copyPageUrl={`/collections/${nft.collection.address}/${nft.tokenId}`}
          shareText={`${t("Check out the {{collectionName}} NFT collection on @LooksRareNFT", {
            collectionName: nft.collection.name,
          })} 👀 💎`}
        />
      </Flex>
    </Flex>
  );
};
