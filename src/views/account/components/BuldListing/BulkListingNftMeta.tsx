import { Box, Flex, FlexProps } from "@chakra-ui/react";
import { Text, VerifiedIcon } from "uikit";
import { Image } from "components/Image";
import { NftCardRarityRank } from "components/NftCard";

interface BulkListingNftMetaProps extends FlexProps {
  name: string;
  imageSrc: string;
  collectionAddress: string;
  collectionName: string;
  isVerified?: boolean;
  tokenId: string;
  totalSupply: number;
}

export const BulkListingNftMeta: React.FC<BulkListingNftMetaProps> = ({
  name,
  imageSrc,
  collectionAddress,
  collectionName,
  isVerified,
  tokenId,
  totalSupply,
  ...props
}) => {
  return (
    <Flex width="100%" overflow="hidden" {...props}>
      <Box
        flexShrink={0}
        position="relative"
        width="40px"
        height="40px"
        mr={4}
        sx={{ img: { borderRadius: "0.25rem" } }}
      >
        <Image src={imageSrc} alt={`${name} image`} layout="fill" objectFit="contain" sizes="48px" />
      </Box>
      <Box flexGrow={1} minWidth={0}>
        <Text textStyle="detail" isTruncated>
          {name}
        </Text>
        <Flex direction="row" alignItems="center" width="100%" gap={1}>
          <Box minWidth={0}>
            <Text textStyle="helper" color="text-03" isTruncated>
              {collectionName}
            </Text>
          </Box>
          {isVerified && (
            <Flex alignItems="center" flexShrink={0}>
              <VerifiedIcon boxSize={4} ml={1} />
            </Flex>
          )}
        </Flex>
        <NftCardRarityRank
          collectionAddress={collectionAddress}
          tokenId={tokenId}
          enableSingleRarityFetch
          totalSupply={totalSupply}
        />
      </Box>
    </Flex>
  );
};
