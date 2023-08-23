import { useTranslation } from "react-i18next";
import { Box, BoxProps, Flex } from "@chakra-ui/react";
import { BigNumber } from "ethers";
import { BasicPropertyButton } from "components/Property";
import { Attribute, NFT } from "types/graphql";
import { Text } from "uikit";
import { NftInfoBox } from "./NftInfoBox";
import { formatToSignificant } from "utils/format";
import { SingleTokenRarityScore } from "./SingleTokenRarityScore";

interface AboutPanelProps extends BoxProps {
  nft: NFT;
}

const getTraitLink = (address: string, attribute: Attribute) => {
  try {
    const stringifiedAttribute = JSON.stringify({
      attributes: [{ traitType: attribute.traitType, values: [attribute.value] }],
    });

    return `/collections/${address}?filters=${encodeURIComponent(stringifiedAttribute)}`;
  } catch {
    return undefined;
  }
};

export const AboutPanel = ({ nft, ...props }: AboutPanelProps) => {
  const { t } = useTranslation();

  return (
    <Box py={8} {...props}>
      <Text as="p" px={4} mb={8} color="text-02" wordBreak="break-word">
        {nft.description}
      </Text>
      {nft.attributes && nft.attributes.length > 0 && (
        <Box px={4} mb={8}>
          <Flex alignItems="center" justifyContent="space-between" mb={4}>
            <Text textStyle="heading-04" bold>
              {t("Properties")}
            </Text>
            <SingleTokenRarityScore
              collectionAddress={nft.collection.address}
              tokenId={nft.tokenId}
              totalSupply={nft.collection.totalSupply}
            />
          </Flex>
          {nft.attributes.map((attribute) => (
            <BasicPropertyButton
              key={attribute.traitType + attribute.value}
              gridTemplateColumns="2fr repeat(2, 1fr)"
              labelHeader={attribute.traitType}
              label={attribute.value}
              count={attribute.count}
              total={nft.collection.totalSupply}
              floorPrice={
                attribute.floorOrder ? formatToSignificant(BigNumber.from(attribute.floorOrder.price), 4) : "-"
              }
              mb={2}
              href={getTraitLink(nft.collection.address, attribute)}
            />
          ))}
        </Box>
      )}
      <Box px={{ base: 0, lg: 4 }}>
        <NftInfoBox nft={nft} />
      </Box>
    </Box>
  );
};
