// import { IconButton, Menu, MenuButton, MenuList, MenuItem, useClipboard } from "@chakra-ui/react";
// import { useTranslation } from "react-i18next";
// import { ButtonProps, IconProps, ShareIcon } from "uikit";
// import { currentChainInfo } from "config/chains";



import { IconButton, Menu, MenuButton, MenuList, MenuItem, useClipboard } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { ButtonProps } from "uikit/Button/Button";
import { IconProps } from "uikit/Icons/Icon";
import { ShareIcon } from "uikit";
import { currentChainInfo } from "config/chains";


interface ShareButtonProps extends ButtonProps {
  shareText: string;
  copyPageUrl: string;
  iconProps?: IconProps;
  buttonProps?: ButtonProps;
}

export const ShareButton = ({
  shareText,
  copyPageUrl,
  iconProps,
  buttonProps = {},
  children = null,
}: ShareButtonProps) => {
  const { t } = useTranslation();
  const url = `${currentChainInfo.appUrl}${copyPageUrl}`;

  const { onCopy } = useClipboard(url);

  return (
    <Menu>
      <MenuButton as={IconButton} aria-label="share" variant="ghost" colorScheme="gray" {...buttonProps}>
        {children || <ShareIcon {...iconProps} />}
      </MenuButton>
      <MenuList zIndex="dropdown">
        <MenuItem onClick={onCopy}>{t("Copy Link")}</MenuItem>
        <MenuItem
          as="a"
          href={`https://twitter.com/intent/tweet?url=${url}&text=${shareText}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("Share on Twitter")}
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
