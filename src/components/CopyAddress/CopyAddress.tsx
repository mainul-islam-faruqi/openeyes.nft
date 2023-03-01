// import { useEffect, useState } from "react";
// import { Box, Flex, FlexProps, Spinner, useClipboard, useDisclosure } from "@chakra-ui/react";
// import { useTranslation } from "react-i18next";
// import { Button, CopyFileIcon, LaunchOpenInNewIcon, Text, Popover, TooltipText, ButtonProps } from "uikit";
// import { getExplorerLink } from "utils/chains";
// import { formatAddress } from "utils/format";
// import { IconLinkButton } from "components/Buttons";
// import { useUserProfileDisplay } from "hooks/useUserProfileDisplay";



import { useEffect, useState } from "react";
import { Box, Flex, FlexProps, Spinner, useClipboard, useDisclosure } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
// import { Button, CopyFileIcon, LaunchOpenInNewIcon, Text, Popover, TooltipText, ButtonProps } from "uikit";
import { Button, ButtonProps } from "uikit/Button/Button";
import { CopyFileIcon, LaunchOpenInNewIcon } from "uikit";
import { Text, TooltipText } from "uikit/Text/Text";
import Popover from "uikit/Popover/Popover";
import { getExplorerLink } from "utils/chains";
import { formatAddress } from "utils/format";
import { IconLinkButton } from "../Buttons/IconLinkButton";
import { useUserProfileDisplay } from "hooks/useUserProfileDisplay";




export interface CopyAddressProps extends FlexProps {
  address: string;
  showEnsDomain?: boolean;
  showCopyIcon?: boolean;
  truncateAddress?: boolean;
  startLength?: number;
  endLength?: number;
  iconButtonProps?: ButtonProps;
  copyButtonProps?: ButtonProps;
}

export const CopyAddress = ({
  address,
  showEnsDomain = true,
  showCopyIcon = true,
  truncateAddress = true,
  startLength = 4,
  endLength = 4,
  iconButtonProps = {},
  copyButtonProps = {},
  ...props
}: CopyAddressProps) => {
  const { t } = useTranslation();
  const { onCopy, hasCopied } = useClipboard(address);
  const {
    isOpen: showAddress,
    onToggle: onToggleEnsDisclosure,
    onClose: onCloseEnsDisclosure,
  } = useDisclosure({ defaultIsOpen: true });
  const [tooltipIsOpen, setTooltipIsOpen] = useState(false);
  const profileDisplayQuery = useUserProfileDisplay(address, { enabled: showEnsDomain });
  const ensDomain = profileDisplayQuery.data?.ensDomain ?? "";

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (hasCopied) {
      setTooltipIsOpen(true);
      timer = setTimeout(() => {
        setTooltipIsOpen(false);
      }, 2000);
    }

    return () => {
      if (timer) {
        setTooltipIsOpen(false);
        clearTimeout(timer);
      }
    };
  }, [hasCopied, setTooltipIsOpen]);

  useEffect(() => {
    if (showEnsDomain && ensDomain) {
      onCloseEnsDisclosure();
    }
  }, [ensDomain, showEnsDomain, onCloseEnsDisclosure]);

  const handleMouse = () => {
    if (showEnsDomain && ensDomain) {
      onToggleEnsDisclosure();
    }
  };

  const rightIcon = (() => {
    if (showCopyIcon) {
      return profileDisplayQuery.isFetching ? <Spinner boxSize={5} /> : <CopyFileIcon boxSize={5} />;
    }
    return undefined;
  })();

  return (
    <Flex onMouseOver={handleMouse} onMouseOut={handleMouse} title={ensDomain || address} {...props}>
      <Popover isOpen={tooltipIsOpen} placement="top" label={<TooltipText>{t("Copied!")}</TooltipText>}>
        <Button
          onClick={onCopy}
          size="xs"
          colorScheme="gray"
          rightIcon={rightIcon}
          mr={0.5}
          square
          {...copyButtonProps}
        >
          <Box as="span" position="relative">
            <Text as="span" textStyle="detail" isTruncated bold visibility={showAddress ? "visible" : "hidden"}>
              {truncateAddress ? formatAddress(address, startLength, endLength) : address}
            </Text>
            {showEnsDomain && ensDomain && (
              <Text
                as="span"
                textStyle="detail"
                isTruncated
                bold
                visibility={showAddress ? "hidden" : "visible"}
                position="absolute"
                left={0}
                maxWidth="100%"
              >
                {ensDomain}
              </Text>
            )}
          </Box>
        </Button>
      </Popover>
      <IconLinkButton
        size="xs"
        variant="ghost"
        colorScheme="gray"
        isExternal
        href={getExplorerLink(address, "address")}
        aria-label="etherscan"
        borderRadius={0}
        {...iconButtonProps}
      >
        <LaunchOpenInNewIcon boxSize={5} />
      </IconLinkButton>
    </Flex>
  );
};
