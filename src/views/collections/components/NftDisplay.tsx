import { Box, Flex } from "@chakra-ui/react";
import { useRef } from "react";
import { NFT } from "types/graphql";
import { navHeightResponsive, pageHeightRemDesktop } from "uikit/theme/global";
import { FullscreenImage } from "./FullscreenImage";
import { NftActionMenu } from "./NftActionMenu";
import NftAnimation from "./NftAnimation";
import { NftTitle } from "./NftTitle";

export interface NftDisplayProps {
  nft: NFT;
  minHeight?: string;
}

export const NftDisplay = ({ nft, minHeight = pageHeightRemDesktop }: NftDisplayProps) => {
  const { animation, collection, name, image } = nft;
  const imageRef = useRef<HTMLDivElement>(null);

  return (
    <Flex
      position="sticky"
      top={navHeightResponsive}
      alignSelf="start"
      flexDirection="column"
      minHeight={{ base: "auto", md: minHeight }}
      overflow="hidden"
    >
      <Box px={{ base: 0, md: 4 }} pt={8} display={{ base: "block", md: "none" }} mb={4}>
        <NftTitle name={nft.name} collection={nft.collection} />
      </Box>
      <Flex
        alignItems="center"
        px={{ base: 0, md: 8 }}
        mb={{ base: 4, md: 0 }}
        order={{ base: 1, md: 2 }}
        height={{ base: "auto", md: "100%" }}
        flex={{ base: 0, md: 1 }}
        justifyContent="center"
        maxWidth={{ base: "100%", sm: "480px", md: "600px" }}
        mx="auto"
        width="100%"
      >
        {animation ? (
          <NftAnimation
            imageRef={imageRef}
            animation={animation}
            name={name}
            collectionName={collection.name}
            image={image}
          />
        ) : (
          <FullscreenImage
            src={image.src}
            contentType={image.contentType}
            alt={name}
            name={name}
            collectionName={collection.name}
            flex={1}
            imageRef={imageRef}
          />
        )}
      </Flex>
      <Box
        order={{ base: 2, md: 1 }}
        borderBottom="1px solid"
        borderColor={{ base: "transparent", md: "border-01" }}
        px={{ base: 4, md: 0 }}
      >
        <NftActionMenu nft={nft} imageRef={imageRef} />
      </Box>
    </Flex>
  );
};
