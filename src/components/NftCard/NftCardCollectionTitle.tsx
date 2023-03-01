import { Flex, FlexProps } from "@chakra-ui/react";
import Link from "next/link";
import { Text, VerifiedIcon, LogoPolygonIcon } from "uikit";

interface NftCardCollectionTitleProps extends FlexProps {
  address: string;
  isVerified?: boolean;
  isListingRewardsEligible?: boolean;
}

export const NftCardCollectionTitle: React.FC<NftCardCollectionTitleProps> = ({
  children,
  address,
  isVerified = false,
  isListingRewardsEligible = false,
  ...props
}) => (
  <Link href={`/collections/${address}`} passHref>
    <Flex
      as="a"
      alignItems="center"
      textOverflow="clip"
      overflow="hidden"
      whiteSpace="nowrap"
      pt={3}
      pb={2}
      color="text-03"
      sx={{ _hover: { color: "link-02" } }}
      {...props}
    >
      <Text textStyle="helper" color="currentColor" isTruncated>
        {children}
      </Text>
      {isVerified && <VerifiedIcon boxSize={3} ml={1} />}
      {isListingRewardsEligible && <LogoPolygonIcon color="purple.400" boxSize={3} ml={1} />}
    </Flex>
  </Link>
);
