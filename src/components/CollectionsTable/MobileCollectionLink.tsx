// import { MouseEventHandler } from "react";
// import { Flex, FlexProps } from "@chakra-ui/react";
// import { Avatar } from "components/Avatar";
// import Link from "next/link";
// import { Text, VerifiedIcon } from "uikit";
// import { ImageData } from "types/graphql";
// import { useOsCollectionImages } from "views/collections/components/hooks/useOsCollectionImages";




import { MouseEventHandler } from "react";
import { Flex, FlexProps } from "@chakra-ui/react";
import { Avatar } from "../Avatar/Avatar";
import Link from "next/link";
import { Text } from "uikit/Text/Text";
import { VerifiedIcon } from "uikit";
import { ImageData } from "types/graphql";
import { useOsCollectionImages } from "views/collections/components/hooks/useOsCollectionImages";



interface MobileCollectionLinkProps extends FlexProps {
  rank: number;
  collectionAddress: string;
  name: string;
  logo?: ImageData;
  isVerified?: boolean;
}

export const MobileCollectionLink = ({
  rank,
  collectionAddress,
  name,
  logo,
  isVerified = false,
  ...props
}: MobileCollectionLinkProps) => {
  const osCollectionImagesQuery = useOsCollectionImages(collectionAddress, { enabled: !logo });
  const logoImg = (() => {
    if (logo) {
      return logo;
    }

    if (osCollectionImagesQuery.isSuccess && osCollectionImagesQuery.data.logo) {
      return osCollectionImagesQuery.data.logo;
    }

    return undefined;
  })();

  const handleClick: MouseEventHandler = (evt) => {
    evt.stopPropagation();
  };

  return (
    <Link href={`/collections/${collectionAddress}`} passHref>
      <Flex as="a" alignItems="center" px={4} onClick={handleClick} {...props}>
        <Text textStyle="detail" bold textAlign="center" width={5} mr={2} flexShrink={0}>
          {rank}
        </Text>
        <Avatar size={40} src={logoImg?.src} address={collectionAddress} mr={2} flexShrink={0} borderRadius="4px" />
        <Flex alignItems="center">
          <Text textStyle="detail" bold mr={1}>
            {name}
          </Text>
          {isVerified && <VerifiedIcon boxSize={4} mr={1} />}
        </Flex>
      </Flex>
    </Link>
  );
};
