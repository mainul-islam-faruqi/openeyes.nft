import { Box, Flex, Grid, useBreakpointValue, useDisclosure } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { useEffect } from "react";
import { ArrowHorizontalIcon, ChevronDown, ChevronUp, HelpIcon, Link, LogoPolygonIcon, Text } from "uikit";

export const ListingRewardHowItWorks = () => {
  const { t } = useTranslation();
  const { isOpen, onToggle, onClose, onOpen } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Disclosure remains open all the time > MD
  useEffect(() => {
    if (isMobile) {
      onClose();
    } else {
      onOpen();
    }
  }, [onOpen, onClose, isMobile]);

  return (
    <Box border="1px solid" borderColor="border-01" borderRadius="lg">
      <Grid
        alignItems="center"
        cursor="pointer"
        gridTemplateColumns="20px 1fr 20px"
        gridColumnGap={4}
        p={4}
        display={{ base: "grid", md: "none" }}
        onClick={onToggle}
      >
        <HelpIcon boxSize={5} />
        <Text bold textStyle="detail">
          {t("How Does it Work?")}
        </Text>
        {isOpen ? <ChevronUp boxSize={5} /> : <ChevronDown boxSize={5} />}
      </Grid>
      {isOpen && (
        <Box px={4} py={5}>
          <Flex mb={8}>
            <Box flex={1} mr={4}>
              <Text as="h3" textStyle="detail" bold mb={4}>
                {t("Trading Rewards")}
              </Text>
              <Text as="p" textStyle="helper" color="text-03" mb={4}>
                {t(
                  "Earn trading rewards when you buy or sell any NFT on LooksRare (private listings excluded). Rewards distributed once daily."
                )}
              </Text>
              <Link
                href="https://docs.looksrare.org/about/rewards/trading-rewards"
                isExternal
                textStyle="detail"
                fontWeight="bold"
              >
                {t("Learn More")}
              </Link>
            </Box>
            <ArrowHorizontalIcon boxSize={12} color="text-03" />
          </Flex>
          <Flex>
            <Box flex={1} mr={4}>
              <Text as="h3" textStyle="detail" bold mb={4}>
                {t("Listing Rewards")}
              </Text>
              <Text as="p" textStyle="helper" color="text-03">
                {t("Earn points by listing NFTs from eligible collections.")}
              </Text>
              <Text as="p" textStyle="helper" color="text-03" mb={4}>
                {t("Points convert to LOOKS once daily!")}
              </Text>
              <Link
                href="https://docs.looksrare.org/about/rewards/listing-rewards"
                isExternal
                textStyle="detail"
                fontWeight="bold"
              >
                {t("Learn More")}
              </Link>
            </Box>
            <LogoPolygonIcon boxSize={12} color="text-03" />
          </Flex>
        </Box>
      )}
    </Box>
  );
};
