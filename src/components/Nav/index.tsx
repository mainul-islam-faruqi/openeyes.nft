import React, { memo } from "react";
import { useWeb3React } from "@web3-react/core";
import { Flex, Box, FlexProps, Stack } from "@chakra-ui/react";
import { navHeightResponsive } from "uikit/theme/global";
import { ConnectWalletIconButton, ConnectWalletButton } from "components/Buttons/ConnectWalletButton";
import { LanguageSwitcherButtons } from "components/Buttons/LanguageSwitherButton/LanguageSwitcherButton";
import Logo from "./Logo";
import UserMenu from "./UserMenu";
import { MobileDrawer, LinkList } from "./NavLinks";
import { DesktopSearchButton, MobileSearchButton } from "./SearchButton";
import { useTranslation } from "next-i18next";
import { ColorModeButton } from "components/Buttons/ColorModeButton";

export type NavProps = FlexProps;

const showOnMobileProps = { base: "block", md: "none" };
const showOnDesktopProps = { base: "none", md: "block" };

export const Nav = memo((props: NavProps) => {
  const { account } = useWeb3React();
  const { t } = useTranslation();

  return (
    <Flex
      alignItems="center"
      position="fixed"
      top={0}
      left={0}
      width="100%"
      maxWidth="100%"
      zIndex="sticky"
      bg="ui-bg"
      height={navHeightResponsive}
      px={4}
      justifyContent="space-between"
      data-id="nav"
      {...props}
    >
      <Logo mx={4} />

      <Flex alignItems="center" width="100%" display={{ base: "none", md: "flex" }}>
        <Box flexGrow={1} mx={4}>
          <DesktopSearchButton />
        </Box>
        <LinkList />
      </Flex>

      <Stack direction="row" spacing={4}>
        <Stack direction="row" spacing={0}>
          <Box>
            <ColorModeButton />
          </Box>

          <Box display={showOnDesktopProps}>
            <LanguageSwitcherButtons variant="ghost" colorScheme="gray" />
          </Box>
        </Stack>
        <Box display={showOnMobileProps}>
          <MobileSearchButton />
        </Box>
        {account ? (
          <UserMenu account={account} />
        ) : (
          <>
            <Box display={{ base: "block", lg: "none" }}>
              <ConnectWalletIconButton />
            </Box>
            <Box display={{ base: "none", lg: "block" }}>
              <ConnectWalletButton round>{t("Connect")}</ConnectWalletButton>
            </Box>
          </>
        )}
        <Box display={showOnMobileProps} ml={3}>
          <MobileDrawer />
        </Box>
      </Stack>
    </Flex>
  );
});

Nav.displayName = "Nav";
