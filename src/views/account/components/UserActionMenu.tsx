import { IconButton, useBreakpointValue, Wrap } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { useTranslation } from "react-i18next";
import { InstagramIcon, GlobeIcon, TwitterIcon, Button, ShareIcon } from "uikit";
import { User } from "types/graphql";
import { ShareButton, IconLinkButton, ChatButton } from "components/Buttons";
import { isAddressEqual } from "utils/guards";
import { CreateEditProfileButton } from "./CreateEditProfileButton";

interface UserActionMenuProps {
  user?: User;
  address: string;
  isConnectedAccountPage?: boolean;
}

const UserActionMenu = ({ user, address, isConnectedAccountPage = false }: UserActionMenuProps) => {
  const { t } = useTranslation();
  const { account } = useWeb3React();
  const { name, twitterLink, instagramLink, websiteLink } = user || {};

  const iconBoxSize = 5;
  const buttonSize = useBreakpointValue({ base: "xs", md: "sm" });
  const buttonVariant = useBreakpointValue({ base: "ghost", md: "outline" });
  const buttonProps = {
    width: { base: "32px", md: "40px" },
    height: { base: "32px", md: "40px" },
    minWidth: "none",
    variant: buttonVariant,
    size: buttonSize,
  };
  const shareButtonProps = useBreakpointValue({
    base: {
      ...buttonProps,
      as: IconButton,
      children: null,
    },
    md: {
      ...buttonProps,
      width: "fit-content",
      as: Button,
      leftIcon: <ShareIcon boxSize={iconBoxSize} />,
      children: t("Share"),
    },
  });

  return (
    <Wrap spacing={1} justifyContent="end">
      {websiteLink && (
        <IconLinkButton isExternal href={websiteLink} aria-label="website" {...buttonProps}>
          <GlobeIcon boxSize={iconBoxSize} />
        </IconLinkButton>
      )}
      {twitterLink && (
        <IconLinkButton isExternal href={twitterLink} aria-label="twitter" {...buttonProps}>
          <TwitterIcon boxSize={iconBoxSize} />
        </IconLinkButton>
      )}
      {instagramLink && (
        <IconLinkButton isExternal href={instagramLink} aria-label="instagram" {...buttonProps}>
          <InstagramIcon boxSize={iconBoxSize} />
        </IconLinkButton>
      )}
      <ShareButton
        iconProps={{ boxSize: iconBoxSize }}
        copyPageUrl={`/accounts/${address}`}
        shareText={`${t("Check out {{userName}}'s NFT collection on @LooksRareNFT", {
          userName: name || address,
        })} 👀 💎`}
        buttonProps={shareButtonProps}
      >
        {shareButtonProps?.children}
      </ShareButton>
      {isConnectedAccountPage && (
        <CreateEditProfileButton address={address} user={user} size={buttonSize}>
          {user ? t("Edit Profile") : t("Create Account")}
        </CreateEditProfileButton>
      )}
      {!isAddressEqual(address, account) && (
        <ChatButton
          id="user-action-menu-chat-button"
          address={address}
          tooltipText={t("Contact via Blockscan")}
          size={buttonSize}
          variant={buttonVariant}
          ml={2}
        >
          {t("Chat")}
        </ChatButton>
      )}
    </Wrap>
  );
};

export default UserActionMenu;
