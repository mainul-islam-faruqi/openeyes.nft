import { Box, Flex } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { DiscordIcon, InstagramIcon, Link, Text, TwitterIcon } from "uikit";
// import { LanguageSwitcherButtons } from "components/Buttons";
import { LanguageSwitcherButtons } from "../Buttons/LanguageSwitherButton/LanguageSwitcherButton";

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const thisYear = new Date().getFullYear();

  return (
    <Box pt="112px" px={{ base: 0, md: 4 }} borderTop="1px solid" borderTopColor="border-01">
      <Flex alignItems="center" flexWrap="wrap" p={4}>
        <Text as="span">{`Copyright ${thisYear} LooksRare`}</Text>
        <Text as="span" color="interactive-01" bold mx={2}>
          |
        </Text>
        <Text as="span" color="text-02">
          {t("By NFT people, for NFT people")}
        </Text>
      </Flex>
      <Flex alignItems="center" justifyContent="space-between" flexWrap="wrap" pb={{ base: 0, md: 6 }}>
        <Flex alignItems="center" flexWrap="wrap" p={4}>
          <Link href="https://docs.looksrare.org" fontWeight={600} mr={6} mb={4} isExternal>
            {t("About")}
          </Link>
          <Link
            href="https://docs.looksrare.org/developers/public-api-documentation"
            fontWeight={600}
            mr={6}
            mb={4}
            isExternal
          >
            {t("API")}
          </Link>
          <Link href="https://discord.gg/looksrare" fontWeight={600} mr={6} mb={4} isExternal>
            {t("Contact")}
          </Link>
          <Link href="https://docs.looksrare.org" fontWeight={600} mr={6} mb={4} isExternal>
            {t("Help")}
          </Link>
          <Link href="https://docs.looksrare.org/about/category/hiring" fontWeight={600} mr={6} mb={4} isExternal>
            {t("Jobs")}
          </Link>
          <Link href="https://www.immunefi.com/bounty/looksrare" fontWeight={600} mr={6} mb={4} isExternal>
            {t("Bug Bounty")}
          </Link>
          <Link href="https://docs.looksrare.org/about/brand-logos-usage" fontWeight={600} mr={6} mb={4} isExternal>
            {t("Brand")}
          </Link>
          <Link href="https://docs.looksrare.org/about/terms-of-service" fontWeight={600} mr={6} mb={4} isExternal>
            {t("Terms of Service")}
          </Link>
        </Flex>
        <Flex
          alignItems={{ base: "start", md: "center" }}
          flexDirection={{ base: "column", md: "row" }}
          width={{ base: "100%", md: "auto" }}
          mb={{ base: 0, md: 4 }}
          px={{ base: 0, md: 4 }}
        >
          <Flex alignItems="center" flexWrap="wrap" order={{ base: 2, md: 1 }} p={4}>
            <Link href="https://discord.gg/looksrare" color="text-01" mr={6} isExternal title="Discord">
              <DiscordIcon />
            </Link>
            <Link href="https://twitter.com/looksrarenft" color="text-01" mr={6} isExternal title="Twitter">
              <TwitterIcon />
            </Link>
            <Link href="https://www.instagram.com/looksrarenft" color="text-01" isExternal title="Instagram">
              <InstagramIcon />
            </Link>
          </Flex>
          <Box
            order={{ base: 1, md: 2 }}
            bg={{ base: "ui-02", md: "transparent" }}
            flex={{ base: 1, md: "auto" }}
            width={{ base: "100%", md: "auto" }}
          >
            <LanguageSwitcherButtons layoutFixed colorScheme="gray" />
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Footer;
