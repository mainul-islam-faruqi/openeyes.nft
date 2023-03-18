// @ts-nocheck
import { Trans, useTranslation } from "react-i18next";
import Link from "next/link";
import { Box, Grid, GridItem, Flex } from "@chakra-ui/react";
import { Text, Button } from "uikit";
import { Container } from "components/Layout/Container";
import { CollectionBase, NFTCard } from "types/graphql";
import HomeNftCard from "./components/HomeNftCard";
import HomeNftCardLoadingSkeleton from "./components/HomeNftCardLoadingSkeleton";
import TopCollections from "./components/TopCollections";
import Earn from "./components/Earn";
import DidYouKnow from "./components/DidYouKnow";
import LooksMarqueeBanner from "./components/LooksMarqueeBanner";

interface Props {
  trendingNft?: NFTCard;
  topCollections?: CollectionBase[];
}

const HomeContainer: React.FC = ({ children }) => (
  <Container maxW="1200px" py={32}>
    {children}
  </Container>
);

const StakingLink: React.FC<{ href: string }> = ({ href, children }) => (
  <Link href={href} passHref>
    <Text as="a" color="link-01">
      {children}
    </Text>
  </Link>
);

const HomeView: React.FC<Props> = ({ trendingNft, topCollections }) => {
  const { t } = useTranslation();

  return (
    <>
      <HomeContainer>
        <Grid columnGap={12} gridTemplateColumns={{ base: "1fr", md: "auto 238px", lg: "auto 360px" }}>
          <GridItem>
            <Text as="h1" mb={12} bold textStyle="display-01" maxWidth={{ base: "320px", sm: "100%", md: "455px" }}>
              {t("Trade NFTs, Get Rewards")}
            </Text>
            <Box mb={12}>
              <Box>
                <Box display="inline">
                  <Text as="h2" display="inline" color="text-02">
                    {t("OpenEyes.nft is the community-first NFT marketplace with rewards for participating.")}
                  </Text>
                </Box>
                <Box>
                  <Trans i18nKey="buyNftsOrSellEmToEarnRewards">
                    <Text as="span" color="text-02">
                      Buy NFTs (or sell &apos;em) to
                    </Text>{" "}
                    <StakingLink href="/rewards">earn rewards.</StakingLink>
                  </Trans>
                </Box>
                <Box>
                  <Text display="inline" color="text-02">
                    {t("Explore the market to get started.")}
                  </Text>
                </Box>
              </Box>
              <Flex mt={12}>
                <Link href={`/accounts/me`} passHref>
                  <Button id="home-view-list-an-nft" as="a" mr={2}>
                    {t("List an NFT")}
                  </Button>
                </Link>
                <Link href="/explore" passHref>
                  <Button id="home-view-explore-nfts" as="a" variant="outline" colorScheme="gray">
                    {t("Explore NFTs")}
                  </Button>
                </Link>
              </Flex>
            </Box>
          </GridItem>
          <GridItem>{trendingNft ? <HomeNftCard nft={trendingNft} /> : <HomeNftCardLoadingSkeleton />}</GridItem>
        </Grid>
      </HomeContainer>
      <LooksMarqueeBanner />
      <HomeContainer>
        <TopCollections topCollections={topCollections} />
      </HomeContainer>
      <LooksMarqueeBanner />
      <HomeContainer>
        <Earn />
      </HomeContainer>
      {/* DidYouKnow uses some forced dark-mode colors, not responsive */}
      <Box bg="green.200">
        <HomeContainer>
          <DidYouKnow />
        </HomeContainer>
      </Box>
    </>
  );
};

export default HomeView;
