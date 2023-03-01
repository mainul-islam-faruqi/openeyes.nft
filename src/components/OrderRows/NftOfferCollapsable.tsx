import { Flex, Box } from "@chakra-ui/react";
import { forceCheck } from "react-lazyload";
import { useTranslation } from "react-i18next";
import { Text, WethHalfIcon } from "uikit";
import { ORDERS_PER_PAGE } from "config";
import { formatToSignificant } from "utils/format";
import { getFloorPricePercentDifference, useFloorPriceText } from "utils/floorPricePercentHelpers";
import { NFTWithBids } from "utils/graphql/getTokensWithBids";
import { Collapsable } from "components/Collapsable";
import { Image } from "components/Image";
import NftOfferCollapsableChildren from "./NftOfferCollapsableChildren";

interface NftOfferCardProps {
  nft: NFTWithBids;
}

const NftOfferCollapsable: React.FC<NftOfferCardProps> = ({ nft }) => {
  const { t } = useTranslation();
  const { name, image, bids, collection } = nft;
  const topBid = bids[0];

  const { floorDiffPercentString, floorDiffPercentBn } =
    (collection.floorOrder?.price &&
      topBid &&
      getFloorPricePercentDifference(collection.floorOrder.price, topBid.price)) ||
    {};
  const floorPriceDifferenceText = useFloorPriceText(floorDiffPercentString, floorDiffPercentBn);

  return (
    <Collapsable
      collapseProps={{ unmountOnExit: true }}
      isOpenCallback={forceCheck}
      header={
        <Flex alignItems="center">
          <Box position="relative" height="48px" width="48px" mr={4}>
            <Image
              src={image.src}
              contentType={image.contentType}
              alt={`${name} image`}
              layout="fill"
              objectFit="contain"
              sizes="48px"
            />
          </Box>
          <Flex flexDirection="column" justifyContent="center">
            <Flex alignItems="center" mb={4}>
              <Text color="text-02" bold textStyle="detail" mr={3}>
                {name}
              </Text>
              <Text color="text-03" bold textStyle="detail">
                {bids.length >= ORDERS_PER_PAGE
                  ? t("{{numBids}}+ offers", { numBids: bids.length })
                  : t("{{numBids}} offers", { numBids: bids.length })}
              </Text>
            </Flex>
            {topBid && (
              <Flex alignItems="center">
                <WethHalfIcon boxSize={14} width="10px" height="20px" mr={1} />
                <Text textStyle="detail" bold mr={3}>
                  {formatToSignificant(topBid.price, 4)}
                </Text>
                {floorPriceDifferenceText && (
                  <Text textStyle="detail" color="text-03">
                    {floorPriceDifferenceText}
                  </Text>
                )}
              </Flex>
            )}
          </Flex>
        </Flex>
      }
      bg="ui-01"
    >
      <NftOfferCollapsableChildren nft={nft} />
    </Collapsable>
  );
};

export default NftOfferCollapsable;
