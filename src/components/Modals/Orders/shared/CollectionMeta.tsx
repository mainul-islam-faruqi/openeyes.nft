import { Box, Flex, FlexProps } from "@chakra-ui/react";
import { Text, VerifiedIcon } from "uikit";
import { ImageData } from "types/graphql";
import { TOKEN_IMAGE_PLACEHOLDER_URI } from "config/urls";
import { useOsCollectionImages } from "views/collections/components/hooks/useOsCollectionImages";
import { Image } from "components/Image";

interface Props extends FlexProps {
  collectionAddress: string;
  collectionName: string;
  logo?: ImageData;
  isVerified?: boolean;
}

const CollectionMeta: React.FC<Props> = ({ collectionAddress, collectionName, logo, isVerified, ...props }) => {
  const osCollectionImagesQuery = useOsCollectionImages(collectionAddress, { enabled: !logo });

  const logoImg = (() => {
    if (logo) {
      return logo;
    }

    if (osCollectionImagesQuery.isSuccess && osCollectionImagesQuery.data.logo?.src) {
      return osCollectionImagesQuery.data.logo;
    }

    return { src: TOKEN_IMAGE_PLACEHOLDER_URI };
  })();

  return (
    <Flex alignItems="center" {...props}>
      <Box sx={{ img: { borderRadius: "50%" } }}>
        <Image src={logoImg.src} alt={collectionName} width={48} height={48} />
      </Box>
      <Text bold color="gray.100" ml={4}>
        {isVerified && <VerifiedIcon boxSize={4} mr={1} />}
        {collectionName}
      </Text>
    </Flex>
  );
};

export default CollectionMeta;
