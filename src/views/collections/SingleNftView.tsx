import { Box, Grid, Tabs, TabList, Tab, GridItem } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { useTranslation } from "react-i18next";
import { UseQueryResult } from "react-query";
import { EventType, NFT, TokenOwner } from "types/graphql";
import { isAddressOneOfOwners } from "utils/guards";
import { navHeightResponsive, pageHeightRemDesktop } from "uikit/theme/global";
import { formatToSignificant } from "utils/format";
import useIntersectionObserver from "hooks/useIntersectionObserver";
import { useGetWindowHash } from "hooks/useGetWindowHash";
import { ActivityFilterProvider } from "components/Filters";
import { Container } from "components/Layout/Container";
import { NftDisplay } from "./components/NftDisplay";
import { NftTitle } from "./components/NftTitle";
import { NftDetailsBox } from "./components/NftDetailsBox";
import { AboutPanel } from "./components/AboutPanel";
import { OffersPanel } from "./components/OffersPanel";
import { SingleNftActivityPanel } from "./components/SingleNftActivityPanel";
import { NftDetailScrollMenu } from "./components/NftDetailScrollMenu";
import { OwnerBar } from "./components/OwnerBar";
import { ListingsPanel } from "./components/ListingsPanel";

export interface SingleNftViewProps {
  nft: NFT;
  tokenOwnersQuery: UseQueryResult<TokenOwner[]>;
}

export const SingleNftView = ({ nft, tokenOwnersQuery }: SingleNftViewProps) => {
  const { account } = useWeb3React();
  const { t } = useTranslation();
  const hash = useGetWindowHash();
  const { observerRef, isIntersecting } = useIntersectionObserver();
  const isErc1155 = nft.collection.type === "ERC1155";

  const price = nft.ask?.price ? formatToSignificant(nft.ask?.price, 4) : "";
  const [highestBid] = nft.bids;

  const isUserNft = tokenOwnersQuery.isSuccess && isAddressOneOfOwners(account, tokenOwnersQuery.data);
  const tabListTop = isUserNft ? { base: navHeightResponsive.base, md: navHeightResponsive.md } : navHeightResponsive;

  const tabIndex = (() => {
    switch (hash) {
      case "#activity":
        return 2;
      case "#offers":
        return 1;
      case "#listings": {
        if (isErc1155) {
          return 3;
        }
        return 0;
      }
      case "#about":
        return 0;
      default: {
        if (isUserNft) {
          return 1;
        }
        return 0;
      }
    }
  })();

  const showScrollMenu = (() => {
    // Hide scrolling menu if there is no price or top bid
    if (!price && !highestBid) {
      return false;
    }

    // Hide menu if the user owns the nft AND it is not ERC1155
    if (isUserNft && !isErc1155) {
      return false;
    }

    return true;
  })();

  return (
    <Container position="relative">
      <Box
        minHeight={{ md: pageHeightRemDesktop }}
        mx="auto"
        maxWidth="1440px"
        borderColor="border-01"
        borderWidth={{ lg: "0 1px" }}
      >
        <Grid
          gridTemplateColumns={{ base: "1fr", md: "repeat(2, 50%)", lg: "40% 60%" }}
          gridTemplateRows="1fr"
          minHeight={{ md: pageHeightRemDesktop }}
        >
          <GridItem
            borderRight={{ base: "none", md: "1px solid" }}
            borderRightColor={{ md: "border-01" }}
            order={{ base: 2, md: 1 }}
          >
            {/* @TODO these box wrappers are a quick fix */}
            <Box pt={{ base: 8, md: 0 }}>
              {tokenOwnersQuery.isSuccess && <OwnerBar nft={nft} owners={tokenOwnersQuery.data} />}
            </Box>
            <Box pt={8} px={{ base: 0, md: 4 }}>
              <NftTitle name={nft.name} collection={nft.collection} mb={8} display={{ base: "none", md: "block" }} />
              <NftDetailsBox nft={nft} tokenOwnersQuery={tokenOwnersQuery} ref={observerRef} mb={8} />
            </Box>
            <Tabs index={tabIndex} variant="line" isLazy position="sticky" top={tabListTop} bg="ui-bg" zIndex="sticky">
              <TabList>
                <Tab as="a" href="#about">
                  {t("About")}
                </Tab>
                <Tab as="a" href="#offers">
                  {t("Offers")}
                </Tab>
                <Tab as="a" href="#activity">
                  {t("Activity")}
                </Tab>
                {isErc1155 && (
                  <Tab as="a" href="#listings">
                    {t("Listings")}
                  </Tab>
                )}
              </TabList>
            </Tabs>
            {tabIndex === 0 && <AboutPanel nft={nft} />}
            {tabIndex === 1 && (
              <Box as="span">
                <OffersPanel nft={nft} isUserNft={isUserNft} />
              </Box>
            )}
            {tabIndex === 2 && (
              <Box as="span">
                <ActivityFilterProvider
                  defaultFilters={{
                    collection: nft.collection.address,
                    tokenId: nft.tokenId,
                    type: [EventType.SALE, EventType.TRANSFER, EventType.MINT],
                  }}
                >
                  <SingleNftActivityPanel />
                </ActivityFilterProvider>
              </Box>
            )}
            {isErc1155 && tabIndex === 3 && (
              <Box as="span">
                <ListingsPanel nft={nft} isUserNft={isUserNft} />
              </Box>
            )}
            {showScrollMenu && (
              <NftDetailScrollMenu
                nft={nft}
                price={price}
                highestBid={highestBid}
                isOpen={!isIntersecting}
                tokenOwnersQuery={tokenOwnersQuery}
              />
            )}
          </GridItem>
          <GridItem order={{ base: 1, md: 2 }}>
            <NftDisplay nft={nft} />
          </GridItem>
        </Grid>
      </Box>
    </Container>
  );
};
