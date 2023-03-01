// import { useWeb3React } from "@web3-react/core";
// import { useTranslation } from "next-i18next";
// import { Flex, FlexProps, Link, LinkProps, AspectRatioProps, Box } from "@chakra-ui/react";
// import NextLink from "next/link";
// import { formatAddressUsername } from "utils/format";
// import { isAddressEqual } from "utils/guards";
// import { Popover, RainbowText, RainbowTextProps, Text, VerifiedIcon } from "uikit";
// import { Avatar, AvatarProps } from "./Avatar";




import { useWeb3React } from "@web3-react/core";
import { useTranslation } from "next-i18next";
import { Flex, FlexProps, Link, LinkProps, AspectRatioProps, Box } from "@chakra-ui/react";
import NextLink from "next/link";
import { formatAddressUsername } from "utils/format";
import { isAddressEqual } from "utils/guards";
import Popover from "uikit/Popover/Popover";
import { RainbowText, RainbowTextProps, Text } from "uikit/Text/Text";
import { VerifiedIcon } from "uikit";
import { Avatar, AvatarProps } from "./Avatar";





export interface AvatarWithLinkProps extends AvatarProps, FlexProps {
  href: string;
  name?: string;
  ensDomain?: string | null;
  linkProps?: Omit<LinkProps, "href">;
  rainbowTextProps?: RainbowTextProps;
  avatarProps?: AspectRatioProps;
  isVerified?: boolean;
}

const PopoverContent = ({
  src,
  name,
  ensDomain,
  address,
  size,
  avatarProps,
  isVerified,
}: Pick<AvatarWithLinkProps, "src" | "name" | "ensDomain" | "address" | "size" | "avatarProps" | "isVerified">) => (
  <Flex alignItems="center">
    <Avatar src={src} address={address} size={size} mr={2} flexShrink={0} {...avatarProps} />
    <Box>
      <Flex alignItems="center">
        <Text bold textStyle="detail" color="text-inverse">
          {name || ensDomain || formatAddressUsername(address)}
        </Text>
        {isVerified && <VerifiedIcon boxSize={4} ml={1} />}
      </Flex>
      <Text color="text-inverse-03" textStyle="helper">
        {name && ensDomain ? ensDomain : address}
      </Text>
    </Box>
  </Flex>
);

export const AvatarWithLink = ({
  src,
  address,
  href,
  name,
  ensDomain,
  isVerified = false,
  size = 32,
  linkProps,
  avatarProps,
  rainbowTextProps,
  ...props
}: AvatarWithLinkProps) => {
  const { account } = useWeb3React();
  const { t } = useTranslation();
  const isConnectedAccount = isAddressEqual(account, address);

  return (
    <Popover
      label={
        <PopoverContent
          src={src}
          address={address}
          size={size}
          avatarProps={avatarProps}
          name={name}
          ensDomain={ensDomain}
          isVerified={isVerified}
        />
      }
      placement="top"
      contentProps={{ maxWidth: "none", p: 2 }}
    >
      <Flex alignItems="center" display="inline-flex" {...props}>
        <NextLink href={href} passHref>
          <Link color="link-01" fontWeight="bold" {...linkProps}>
            {isConnectedAccount ? (
              <RainbowText textStyle="detail" fontWeight="bold" {...rainbowTextProps}>
                {t("You")}
              </RainbowText>
            ) : (
              name || ensDomain || formatAddressUsername(address)
            )}
          </Link>
        </NextLink>
      </Flex>
    </Popover>
  );
};
