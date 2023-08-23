// import Link from "next/link";
// import { Box, BoxProps, Flex } from "@chakra-ui/react";
// import { useWeb3React } from "@web3-react/core";
// import { useTranslation } from "next-i18next";
// import { Collection } from "types/graphql";
// import { Button, Text } from "uikit";
// import { Avatar } from "components/Avatar";
// import { isAddressEqual } from "utils/guards";
// import VerifiedButton from "components/Modals/VerifiedModal/VerifiedButton";
// import { Royalties } from "./Royalties";




import Link from "next/link";
import { Box, BoxProps, Flex } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { useTranslation } from "next-i18next";
import { Collection } from "types/graphql";
import { Button } from "uikit/Button/Button";
import { Text } from "uikit/Text/Text";
import { Avatar } from "../Avatar/Avatar";
import { isAddressEqual } from "utils/guards";
import VerifiedButton from "../Modals/VerifiedModal/VerifiedButton";
import { Royalties } from "./Royalties";




interface CollectionCardProps extends BoxProps {
  collection: Collection;
  royaltiesDefaultIsOpen?: boolean;
}

export const CollectionCard = ({ collection, royaltiesDefaultIsOpen = false, ...props }: CollectionCardProps) => {
  const { name, banner, address, logo, owner, isVerified } = collection;
  const { account } = useWeb3React();
  const { t } = useTranslation();
  const isOwner = isAddressEqual(account, owner.address);

  return (
    <Box {...props}>
      <Box
        pt={2}
        backgroundColor="ui-02"
        backgroundImage={banner?.src}
        backgroundRepeat="no-repeat"
        backgroundPosition="center center"
        backgroundSize="cover"
        backdropFilter="blur(32px)"
        borderBottom="1px solid"
        borderBottomColor="border-01"
      >
        <Flex alignItems="center" bg="ui-01" px={4} py={8}>
          <Box flex={1}>
            <Flex alignItems="center" mb={4}>
              <Link href={`/collections/${address}`} passHref>
                <Text as="a" textStyle="heading-04" bold>
                  {name}
                </Text>
              </Link>
              {isOwner && (
                <Link href={`/collections/${address}/manage`} passHref prefetch={false}>
                  <Button round as="a" colorScheme="gray" size="xs" ml={4}>
                    {t("Manage")}
                  </Button>
                </Link>
              )}
            </Flex>
            <VerifiedButton isVerified={isVerified} />
          </Box>
          <Box flexShrink={0}>
            <Avatar address={address} src={logo?.src} size={96} />
          </Box>
        </Flex>
      </Box>
      {isOwner && <Royalties defaultIsOpen={royaltiesDefaultIsOpen} collectionAddress={address} />}
    </Box>
  );
};
