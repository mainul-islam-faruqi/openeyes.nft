import React from "react";
import NextLink from "next/link";
import {
  Flex,
  FlexProps,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  useDisclosure,
  Link,
  Box,
  Stack,
  Divider,
  useColorModeValue,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import {
  // Badge,
  // ChevronDown,
  // ChevronUp,
  CloseIcon,
  CollectionIcon,
  CompassIcon,
  GiftIcon,
  HamburgerIcon,
  // RainbowText,
  // StaticLogoLarge,
  // StaticLogoLargeLight,
} from "uikit";
import { Menu } from "uikit/Menu/Menu";
import { LanguageSwitcherButtons } from "../Buttons/LanguageSwitherButton/LanguageSwitcherButton";
import { DesktopNextLink, MobileLink, MobileNextLink } from "./shared";

export const LinkList: React.FC<FlexProps> = (props) => {
  const { t } = useTranslation();
  const { pathname } = useRouter();
  const isRewardActive = pathname.startsWith("/rewards");
  return (
    <Flex {...props}>
      {/* <DesktopNextLink href="/explore">{t("Explore")}</DesktopNextLink>
      <DesktopNextLink href="/collections">{t("Collections")}</DesktopNextLink> */}
      <Menu placement="bottom-end">
        <MenuButton
          as={Link}
          alignItems="center"
          display="flex"
          px={4}
          height={12}
          borderBottom="2px solid"
          borderBottomColor={isRewardActive ? "interactive-01" : "transparent"}
          whiteSpace="nowrap"
          sx={{ _hover: { bg: "ui-01" } }}
          color="text-02"
        >
          {/* <RainbowText as="span" animate>
            {t("Rewards")}
          </RainbowText> */}
        </MenuButton>
        <MenuList zIndex="dropdown">
          <NextLink href="/rewards" passHref>
            <MenuItem as="a">{t("Staking")}</MenuItem>
          </NextLink>
          <NextLink href="/rewards/trading" passHref>
            <MenuItem as="a" display="flex" justifyContent="space-between">
              {t("Listing & Trading")}
              {/* <Badge textTransform="uppercase" bg="support-error-inverse" color="white">
                {t("New")}
              </Badge> */}
            </MenuItem>
          </NextLink>
        </MenuList>
      </Menu>
    </Flex>
  );
};

export const MobileDrawer = () => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const rewardDisclosure = useDisclosure();
  // const logoWithText = useColorModeValue(
  //   <StaticLogoLargeLight width="130" height="40" />,
  //   <StaticLogoLarge width="130" height="40" />
  // );

  return (
    <>
      <IconButton aria-label="Mobile menu" colorScheme="gray" isRound onClick={onOpen}>
        <HamburgerIcon />
      </IconButton>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <Flex alignItems="center" justifyContent="space-between" pr={4}>
            <DrawerHeader flex="0" display="flex" alignItems="end" tabIndex={1} px={4}>
              {/* <Box w="130px">{logoWithText}</Box> */}
            </DrawerHeader>
            <IconButton aria-label="close menu" variant="ghost" size="xs" color="text-01" onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Flex>
          <Box bg="ui-02">
            <LanguageSwitcherButtons layoutFixed />
          </Box>
          <DrawerBody display="flex" flexDirection="column" bgColor="ui-01" px={0}>
            <Stack spacing={0} divider={<Divider />}>
              {/* <MobileNextLink href="/explore" leftIcon={CompassIcon}>
                {t("Explore")}
              </MobileNextLink> */}
              {/* <MobileNextLink href="/collections" leftIcon={CollectionIcon}>
                {t("Collections")}
              </MobileNextLink>
              <MobileLink
                as="div"
                leftIcon={GiftIcon}
                rightIcon={rewardDisclosure.isOpen ? <ChevronUp /> : <ChevronDown />}
                onClick={rewardDisclosure.onToggle}
                userSelect="none"
              >
                {t("Rewards")}
              </MobileLink> */}
              {rewardDisclosure.isOpen && (
                <>
                  {/* <MobileNextLink href="/rewards" pl="52px">
                    {t("Staking")}
                  </MobileNextLink>
                  <MobileNextLink
                    href="/rewards/trading"
                    pl="52px"
                    rightIcon={
                      <Badge textTransform="uppercase" bg="support-error-inverse" color="white">
                        {t("New")}
                      </Badge>
                    }
                  >
                    {t("Listing & Trading")}
                  </MobileNextLink> */}
                </>
              )}
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
