// import { Flex, FlexProps, AspectRatioProps } from "@chakra-ui/react";
// import { TextProps } from "uikit";
// import { Avatar, AvatarProps } from "./Avatar";
// import { UserProfileDisplay } from "components/UserProfileDisplay";




import { Flex, FlexProps, AspectRatioProps } from "@chakra-ui/react";
import { TextProps } from "uikit/Text/Text";
import { Avatar, AvatarProps } from "./Avatar";
import { UserProfileDisplay } from "../UserProfileDisplay";


export interface AvatarWithUsernameProps extends AvatarProps, FlexProps {
  textProps?: TextProps;
  avatarProps?: AspectRatioProps;
}

export const AvatarWithUsername = ({
  src,
  address,
  size = 16,
  textProps,
  avatarProps,
  ...props
}: AvatarWithUsernameProps) => (
  <Flex alignItems="center" {...props}>
    <Avatar src={src} address={address} size={size} mr={2} {...avatarProps} />
    <UserProfileDisplay address={address} maxWidth="220px" isTruncated bold {...textProps} />
  </Flex>
);
