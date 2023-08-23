import { Box, BoxProps } from "@chakra-ui/react";
import { NFT } from "types/graphql";
import { LogoPolygonIcon, Text, VerifiedIcon } from "uikit";
import { BackLink } from "components/BackLink";

type NftTitleProps = Pick<NFT, "collection"> & { name: string } & BoxProps;

export const NftTitle: React.FC<NftTitleProps> = ({ name, collection, ...props }) => {
  const isListingRewardsEligible = !!collection.points;
  return (
    <Box {...props}>
      <Box mb={{ base: 0, lg: 8 }}>
        <BackLink
          href={`/collections/${collection.address}`}
          textButtonProps={{ width: "100%", whiteSpace: "normal", display: "inline", textAlign: "left" }}
        >
          {collection.name} {collection.isVerified && <VerifiedIcon boxSize={4} ml={1} />}
          {isListingRewardsEligible && <LogoPolygonIcon color="purple.400" boxSize={4} ml={1} />}
        </BackLink>
      </Box>
      <Text as="h1" bold textStyle="display-03" mt={4} wordBreak="break-word" color="text-01">
        {name}
      </Text>
    </Box>
  );
};
