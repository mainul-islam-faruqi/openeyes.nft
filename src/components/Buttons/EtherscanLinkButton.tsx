// import { useTranslation } from "react-i18next";
// import { ButtonProps, EtherscanIcon, Popover, TooltipText, IconProps } from "uikit";
// import { IconLinkButton } from "./IconLinkButton";


import { useTranslation } from "react-i18next";
import { ButtonProps } from "uikit/Button/Button";
import { EtherscanIcon } from "uikit";
import Popover from "uikit/Popover/Popover";
import { TooltipText } from "uikit/Text/Text";
import { IconProps } from "uikit/Icons/Icon";
import { IconLinkButton } from "./IconLinkButton";



export interface EtherscanLinkButtonProps extends ButtonProps {
  href: string;
  hideTooltip?: boolean;
  iconProps?: IconProps;
}

export const EtherscanLinkButton = ({ href, hideTooltip = false, iconProps, ...props }: EtherscanLinkButtonProps) => {
  const { t } = useTranslation();
  const buttonComponent = (
    <IconLinkButton isExternal href={href} aria-label="etherscan" {...props}>
      <EtherscanIcon {...iconProps} />
    </IconLinkButton>
  );

  if (hideTooltip) {
    return buttonComponent;
  }

  return (
    <Popover label={<TooltipText>{t("View on {{name}}", { name: "Etherscan" })}</TooltipText>}>
      {buttonComponent}
    </Popover>
  );
};
