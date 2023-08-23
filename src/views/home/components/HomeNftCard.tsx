// @ts-nocheck
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Flex, Box, Grid, AspectRatio, TagLabel } from "@chakra-ui/react";
import { NFTCard } from "types/graphql";
import { DiamondIcon, Tag, Text } from "uikit";
import { breakpoints } from "uikit/theme/breakpoints";
import { getCurrencyConfig } from "config/currencies";
import { formatToSignificant } from "utils/format";
import { CollectionLinkButton } from "components/Buttons/CollectionLinkButton";
import { TokenMedia } from "components/TokenMedia/TokenMedia";

interface Props {
  nft: NFTCard;
}

const HomeNftCard: React.FC<Props> = ({ nft }) => {
  const { tokenId, collection, image, name, ask, lastOrder, bids } = nft;
  const { t } = useTranslation();
  const [highestBid] = bids;
  const LastOrderIcon = lastOrder && getCurrencyConfig(lastOrder.currency, true).icon;
  const AskIcon = ask && getCurrencyConfig(ask.currency, true).icon;
  const HighestBidIcon = highestBid && getCurrencyConfig(highestBid.currency).icon;

  const getOrderSection = () => {
    if (ask) {
      return (
        <Flex flexDir="column" justifyContent="flex-end">
          <Text textStyle="helper" bold color="text-02" textAlign="right">
            {t("Price")}
          </Text>
          <Flex mt={2} alignItems="center">
            {AskIcon && <AskIcon boxSize={6} height="24px" width="12px" mr={1.5} />}
            <Text bold>{formatToSignificant(ask.price, 4)}</Text>
          </Flex>
        </Flex>
      );
    }

    if (highestBid) {
      return (
        <Flex flexDir="column">
          <Text textStyle="helper" bold color="text-02" textAlign="right">
            {t("Top Offer")}
          </Text>
          <Flex mt={2} alignItems="center" justifyContent="flex-end">
            {HighestBidIcon && <HighestBidIcon boxSize={6} height="24px" width="12px" mr={1.5} />}
            <Text bold>{formatToSignificant(highestBid.price, 4)}</Text>
          </Flex>
        </Flex>
      );
    }

    if (lastOrder) {
      return (
        <Flex flexDir="column">
          <Text textStyle="helper" bold color="text-02" textAlign="right">
            {t("Last sold for")}
          </Text>
          <Flex mt={2} alignItems="center" justifyContent="flex-end">
            {LastOrderIcon && <LastOrderIcon boxSize={6} height="24px" width="12px" mr={1.5} />}
            <Text bold>{formatToSignificant(lastOrder.price, 4)}</Text>
          </Flex>
        </Flex>
      );
    }

    return null;
  };

  return (
    <Flex
      minWidth="260px"
      flexDirection="column"
      p={2}
      pb={4}
      transition="background 200ms ease-out"
      sx={{ _hover: { bg: "ui-01", img: { opacity: 0.9, transition: "opacity 200ms ease-out" } } }}
      data-id="home-nft-card"
    >
      <Link href={`/collections/${collection.address}/${tokenId}`} passHref>
        <a>
          <Box position="relative" cursor="pointer">
            <Box position="absolute" zIndex="docked" top={2} left={2}>
              <Tag>
                <TagLabel>
                  <Flex alignItems="center">
                    <DiamondIcon boxSize={5} mr={1} />
                    {t("Trending")}
                  </Flex>
                </TagLabel>
              </Tag>
            </Box>
            <AspectRatio ratio={1}>
              <TokenMedia
                src={image.src}
                contentType={image.contentType}
                alt={name}
                imageProps={{
                  sizes: `(max-width: ${breakpoints.md}) 100vw, (max-width: ${breakpoints.lg}) 262px, 360px`,
                  priority: true,
                }}
                videoProps={{ preload: "auto", loop: true, sizes: { base: 768, md: 262, lg: 360 } }}
              />
            </AspectRatio>
            <Grid
              justifyContent="space-between"
              alignItems="center"
              gridTemplateColumns="auto auto"
              gridColumnGap={4}
              mt={4}
            >
              <Flex flexDir="column" overflow="hidden" whiteSpace="nowrap" alignItems="flex-start">
                <CollectionLinkButton
                  name={collection.name}
                  address={collection.address}
                  isVerified={collection.isVerified}
                  textProps={{ color: "text-02" }}
                />
                <Text mt={2} isTruncated bold>
                  {name}
                </Text>
              </Flex>
              {getOrderSection()}
            </Grid>
          </Box>
        </a>
      </Link>
    </Flex>
  );
};

export default HomeNftCard;
