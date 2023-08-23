import { Flex, Box, VStack, HStack } from "@chakra-ui/react";
import { Text } from "uikit";
import { Avatar } from "components/Avatar";
import { User } from "types/graphql";
import UserActionMenu from "./UserActionMenu";
import { UsernameAddressDisplay } from "./UsernameAddressDisplay";
import { CollectionBanner } from "views/collections/components/CollectionHeadingBanner";
import makeBlockie from "ethereum-blockies-base64";
import { useWeb3React } from "@web3-react/core";
import { isAddressEqual } from "utils/guards";
import UserBar from "./UserBar";
import { AvatarEditProfileButton } from "./AvatarEditProfileButton";

interface Props {
  user?: User;
  address: string;
}

const Header: React.FC<Props> = ({ user, address }) => {
  const { biography, avatar } = user || {};
  const { account } = useWeb3React();
  const isConnectedAccountPage = isAddressEqual(account, address);
  const blockie = makeBlockie(address);
  const smallLayoutProps = {
    display: {
      md: "none",
    },
  };

  // on small layouts render a vertical stack.
  // on large layouts, a horizontal stack with 3 columns
  return (
    <Box width="100%" position="relative">
      {/* Banner - small layout */}
      <Box overflow="hidden" {...smallLayoutProps}>
        <Box width="100%" height="96px" position="relative" backgroundColor="ui-01">
          <CollectionBanner bannerImgSrc={avatar?.image.src} logoImgSrc={blockie} />
        </Box>
      </Box>

      {/* Banner - large layout */}
      <Box display={{ base: "none", md: "block" }}>
        <CollectionBanner bannerImgSrc={avatar?.image.src} logoImgSrc={blockie} isLargeLayout />
      </Box>

      <Box position="relative" pb={8}>
        {/* Main Header Content */}
        <Box px={{ base: 4, md: 8 }} position="relative">
          {/* Avatar */}
          <Box position="relative" {...smallLayoutProps}>
            <Box position="absolute" top="-48px" left={0} className="avatar-box">
              <Avatar
                boxSize="96px"
                src={avatar?.image.src}
                boxProps={{ borderColor: "ui-bg", borderWidth: "2px", bg: "ui-bg" }}
                size={128}
                address={address}
                priority
              />
              {/* position the avatar's CreateEditProfileButton, renders on .avatar-box hover */}
              {isConnectedAccountPage && <AvatarEditProfileButton user={user} address={address} />}
            </Box>
          </Box>

          {/* Vertical stack is small layout */}
          <VStack spacing={6} pt={4} alignItems="start" {...smallLayoutProps}>
            {/* Button Links - small layout */}
            <Flex justifyContent="flex-end" width="100%">
              <UserActionMenu address={address} user={user} isConnectedAccountPage={isConnectedAccountPage} />
            </Flex>

            {/* display name, ens domain, address */}
            <UsernameAddressDisplay user={user} address={address} />

            {/* user bio */}
            {biography && (
              <Text maxWidth="400px" textStyle="helper">
                {biography}
              </Text>
            )}

            {/* owner actions */}
            {account && isConnectedAccountPage && <UserBar address={address!} />}
          </VStack>

          {/* Horizontal stack is large layout */}
          <HStack display={{ base: "none", md: "flex" }} pt={8} spacing={6} alignItems="flex-start" width="100%">
            {/* Left column - avatar */}
            <Box flexShrink={0} width="96px" position="relative">
              <Box position="absolute" top={0} left={0}>
                <Box className="avatar-box" width="100%" height="100%">
                  <Avatar
                    boxSize="96px"
                    src={avatar?.image.src}
                    boxProps={{ bg: "ui-bg" }}
                    size={128}
                    address={address}
                    priority
                  />
                  {isConnectedAccountPage && <AvatarEditProfileButton user={user} address={address} />}
                </Box>
              </Box>
            </Box>

            {/* Center column - content */}
            <Box flexGrow={1} flexShrink={0} overflowX="hidden">
              <VStack spacing={4} maxWidth="512px" alignItems="start">
                <UsernameAddressDisplay user={user} address={address} textProps={{ textStyle: "heading-03" }} />
                {/* user bio */}
                {biography && <Text textStyle="helper">{biography}</Text>}
                {/* owner actions */}
                {account && isConnectedAccountPage && <UserBar address={address!} />}
              </VStack>
            </Box>

            {/* Right column - icon buttons */}
            <Box flexShrink={1}>
              <UserActionMenu address={address} user={user} isConnectedAccountPage={isConnectedAccountPage} />
            </Box>
          </HStack>
        </Box>
      </Box>
    </Box>
  );
};

export default Header;
