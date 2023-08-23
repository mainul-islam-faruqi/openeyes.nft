import { MouseEventHandler } from "react";
import NextLink from "next/link";
import { Box, GridItem, IconButton } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { Container } from "components/Layout/Container";
import { CloseIcon, Link, LogoPolygonIcon, Text } from "uikit";

interface ListingRewardBannerProps {
  onDismiss: () => void;
}

export const ListingRewardBanner = ({ onDismiss }: ListingRewardBannerProps) => {
  const { t } = useTranslation();

  const handleClick: MouseEventHandler<HTMLButtonElement> = (evt) => {
    onDismiss();
    evt.preventDefault();
  };

  return (
    <NextLink href="/rewards/trading" passHref>
      <Box display="block" bg="purple.500" as={Link} sx={{ _hover: { textDecoration: "none" } }}>
        <Container
          display="grid"
          gridTemplateColumns={{ base: "1fr auto", md: "60px 1fr auto auto" }}
          gridTemplateAreas={{ base: "'b d' 'c c'", md: "'a b c d'" }}
          gridGap={4}
          alignItems={{ base: "start", md: "center" }}
          py={4}
        >
          <GridItem gridArea="a" display={{ base: "none", md: "block" }}>
            <LogoPolygonIcon boxSize="60px" color="white" />
          </GridItem>
          <GridItem gridArea="b">
            <Text textStyle="detail" color="white" bold mb={2}>
              {t("Introducing Listing Rewards!")}
            </Text>
            <Text textStyle="heading-03" bold color="white">
              {t("Earn LOOKS just by listing your NFTs!")}
            </Text>
          </GridItem>
          <GridItem gridArea="c">
            <Text
              width={{ base: "100%", md: "auto" }}
              color="gray.900"
              bg="gray.100"
              bold
              textStyle="detail"
              p={4}
              borderRadius="md"
              textAlign="center"
            >
              {t("Learn More")}
            </Text>
          </GridItem>
          <GridItem gridArea="d">
            <IconButton
              aria-label="close banner"
              size="sm"
              variant="ghost"
              color="white"
              sx={{ _hover: { color: "white" } }}
              onClick={handleClick}
            >
              <CloseIcon boxSize={5} />
            </IconButton>
          </GridItem>
        </Container>
      </Box>
    </NextLink>
  );
};
