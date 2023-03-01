import { Flex, Box, Grid, GridItem, useDisclosure } from "@chakra-ui/react";
import { BigNumberish } from "@ethersproject/bignumber";
import { formatDistanceToNowStrict } from "date-fns";
import { useWeb3React } from "@web3-react/core";
import { useTranslation } from "react-i18next";
import { MakerOrderWithSignatureAndHash } from "types/orders";
import { TokenStandard } from "types/config";
import { ImageData } from "types/graphql";
import { formatToSignificant, formatTimestampAsDateString } from "utils/format";
import { getFloorPricePercentDifference, useFloorPriceText } from "utils/floorPricePercentHelpers";
import { isAddressEqual } from "utils/guards";
import { timestampInMs } from "utils/date";
import { Button, Text, Popover, TooltipText, WethHalfIcon } from "uikit";
import { STRATEGIES_ADDRESS } from "config";
import AcceptOrderModal from "components/Modals/Orders/AcceptOrderModal";
import { ActivityAddress, CollectionOfferTag, StandardOfferTag } from "components/Activity";
import { CancelOrdersButton } from "components/Buttons";
import BuyNowModal from "components/Modals/Orders/BuyNowModal";

interface OfferRowProps {
  tokenId: string;
  tokenName: string;
  tokenImage: ImageData;
  collectionName: string;
  collectionAddress: string;
  collectionType: TokenStandard;
  isVerified?: boolean;
  order: MakerOrderWithSignatureAndHash;
  collectionfloorPrice?: BigNumberish;
  isFullWidth?: boolean;
  isNftOwnedByUser?: boolean;
}

const OrderRow: React.FC<OfferRowProps> = ({
  order,
  collectionfloorPrice,
  tokenId,
  tokenName,
  tokenImage,
  collectionName,
  collectionType,
  collectionAddress,
  isVerified,
  isFullWidth,
  isNftOwnedByUser,
}) => {
  const { t } = useTranslation();
  const { account } = useWeb3React();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { endTime, startTime, signer, price, isOrderAsk } = order;

  const orderPrice = formatToSignificant(price ?? "0", 4);
  const { floorDiffPercentString, floorDiffPercentBn } =
    (collectionfloorPrice && getFloorPricePercentDifference(collectionfloorPrice, price)) || {};
  const floorPriceDifferenceText = useFloorPriceText(floorDiffPercentString, floorDiffPercentBn);

  const expiryInMs = timestampInMs(endTime);
  const startTimeInMs = timestampInMs(startTime);
  const timeUntilExpiry = formatDistanceToNowStrict(expiryInMs, { addSuffix: true });
  const sinceStart = formatDistanceToNowStrict(startTimeInMs, { addSuffix: true });
  const expiryAsDate = formatTimestampAsDateString(expiryInMs);
  const startAsDate = formatTimestampAsDateString(startTimeInMs);

  const isSigner = isAddressEqual(signer, account || "");
  const isCollectionOrder = isAddressEqual(order.strategy, STRATEGIES_ADDRESS.collection);

  const getModal = () => {
    if (isOrderAsk) {
      return (
        <BuyNowModal
          tokenId={tokenId}
          tokenName={tokenName}
          tokenImage={tokenImage}
          collectionName={collectionName}
          collectionAddress={collectionAddress}
          collectionType={collectionType}
          isVerified={isVerified}
          ask={order}
          isOpen={isOpen}
          onClose={onClose}
        />
      );
    }
    return (
      <AcceptOrderModal
        tokenId={tokenId}
        tokenName={tokenName}
        tokenImage={tokenImage}
        collectionName={collectionName}
        collectionAddress={collectionAddress}
        collectionType={collectionType}
        collectionFloorPrice={collectionfloorPrice}
        isVerified={isVerified}
        order={order}
        isOpen={isOpen}
        onClose={onClose}
      />
    );
  };

  return (
    <>
      {getModal()}
      <Grid
        p={4}
        pl={isFullWidth ? 4 : { base: 4, sm: 24 }}
        backgroundColor="ui-bg"
        templateColumns="140px repeat(2, auto)"
        gridColumnGap={4}
        gridRowGap={4}
        borderBottom="1px solid"
        borderColor="border-01"
      >
        <GridItem colSpan={2}>
          <Flex flexDirection="column">
            <Flex alignItems="center">
              <WethHalfIcon boxSize={14} width="10px" height="20px" mr={1} />
              <Text bold mr={3}>
                {orderPrice}
              </Text>
              {!isOrderAsk && (isCollectionOrder ? <CollectionOfferTag mr={3} /> : <StandardOfferTag mr={3} />)}
              {floorPriceDifferenceText && (
                <Text textStyle="detail" color="text-03">
                  {floorPriceDifferenceText}
                </Text>
              )}
            </Flex>
          </Flex>
        </GridItem>
        <GridItem rowSpan={2}>
          <Flex height="100%" alignItems="center" justifyContent="flex-end">
            {isNftOwnedByUser && !isSigner && !isOrderAsk && (
              <Button colorScheme="gray" onClick={onOpen}>
                {t("Accept")}
              </Button>
            )}
            {isSigner && <CancelOrdersButton nonces={[order.nonce]} />}
            {isOrderAsk && !isSigner && (
              <Button colorScheme="gray" onClick={onOpen}>
                {t("Buy")}
              </Button>
            )}
          </Flex>
        </GridItem>
        <GridItem colSpan={{ base: 2, md: 1 }}>
          <ActivityAddress mr={0} label={t("From")} address={signer} />
        </GridItem>
        <GridItem colSpan={{ base: 3, md: 1 }}>
          <Flex flexWrap="wrap">
            <Box width="fit-content" mr={4}>
              <Popover label={<TooltipText>{startAsDate}</TooltipText>}>
                <Text textStyle="detail" color="text-03">
                  {sinceStart}
                </Text>
              </Popover>
            </Box>
            <Box width="fit-content">
              <Popover label={<TooltipText>{expiryAsDate}</TooltipText>}>
                <Text textStyle="detail" color="text-03">
                  {t("Expires {{timeUntilExpiry}}", { timeUntilExpiry })}
                </Text>
              </Popover>
            </Box>
          </Flex>
        </GridItem>
      </Grid>
    </>
  );
};

export default OrderRow;
