import { Box, BoxProps } from "@chakra-ui/react";
import { User } from "types/graphql";
import { FormattingIcon } from "uikit";
import { CreateEditProfileButton } from "./CreateEditProfileButton";

interface AvatarEditProfileButton extends BoxProps {
  user?: User;
  address: string;
}
export const AvatarEditProfileButton: React.FC<AvatarEditProfileButton> = ({ user, address, ...boxProps }) => {
  return (
    <Box
      cursor="pointer"
      height="100%"
      width="100%"
      top={0}
      left={0}
      position="absolute"
      alignItems="center"
      justifyContent="center"
      display="none"
      borderRadius="50%"
      zIndex={1}
      sx={{
        ".avatar-box:hover &": {
          display: "flex",
          background: "rgba(0,0,0,0.7)",
        },
        ".avatar-box:active &": {
          display: "flex",
          background: "rgba(0,0,0,0.8)",
        },
      }}
      {...boxProps}
    >
      <CreateEditProfileButton
        address={address}
        user={user}
        sx={{
          border: "none",
          _hover: { bg: "transparent", border: "none" },
          _active: { bg: "transparent", border: "none" },
        }}
        variant="ghost"
        width="100%"
        height="100%"
      >
        <FormattingIcon boxSize={6} color="white" />
      </CreateEditProfileButton>
    </Box>
  );
};
