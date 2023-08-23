import { Box, Flex, IconButton, useDisclosure, UseDisclosureReturn, VStack } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { Button, CloseIcon, Text } from "uikit";
import { navHeightResponsive } from "uikit/theme/global";
import { Image } from "components/Image";
import ListForSaleModal from "components/Modals/Orders/ListForSaleModal";
import { useMultiselect } from "components/Multiselect/hooks/useMultiselect";

interface MultiselectItemsProps {
  isMobileLayout?: boolean;
  onCloseModal?: UseDisclosureReturn["onClose"];
}

const headerHeight = "49px";
const itemsMaxHeight = {
  base: `calc(100vh - ${navHeightResponsive.base} - ${headerHeight} - 14rem - 1px)`,
  md: `calc(100vh - ${navHeightResponsive.md} - ${headerHeight} - 11rem - 1px)`,
};
export const MultiselectItems: React.FC<MultiselectItemsProps> = ({ isMobileLayout = false, onCloseModal }) => {
  const { t } = useTranslation();
  const { selectedItems, removeFromCart, clearCart } = useMultiselect();
  const sellDisclosure = useDisclosure();

  const prepareListing = () => {
    if (selectedItems.length === 1) {
      sellDisclosure.onOpen();
      return;
    }

    // these props will only be defined for mobile layout
    if (isMobileLayout && onCloseModal) {
      onCloseModal();
    }

    if (typeof window !== "undefined") {
      window.location.href = "#sell";
    }
  };

  const onClickClearCart = () => {
    if (isMobileLayout && onCloseModal) {
      onCloseModal();
    }
    clearCart();
  };

  // note the containers left & right spacing is different to account for ghost buttons that extend
  // into the "effective" 16px margin
  return (
    <>
      <VStack spacing={6} pl={4} pr={2} width="100%">
        <Flex justifyContent="space-between" alignItems="center" pt={6} pr={2} width="100%">
          <Text bold>{t("Listing")}</Text>
          <Button onClick={onClickClearCart} variant="outline" colorScheme="secondary" size="xs">
            {t("Clear")}
          </Button>
        </Flex>
        <VStack width="100%" spacing={0} height="100%" maxHeight={itemsMaxHeight} overflowY="auto">
          {selectedItems.map((nft) => {
            const key = `${nft.collection.address}-${nft.tokenId}`;
            return (
              <Flex key={key} justifyContent="space-between" alignItems="center" width="100%">
                <Box
                  flexShrink={0}
                  position="relative"
                  width="32px"
                  height="32px"
                  mr={4}
                  sx={{ img: { borderRadius: "0.25rem" } }}
                >
                  <Image src={nft.image.src} alt={`${nft.name} image`} layout="fill" objectFit="contain" sizes="48px" />
                </Box>
                <Box flex="1" minWidth={0}>
                  <Text textStyle="detail" isTruncated>
                    {nft.name}
                  </Text>
                </Box>
                <IconButton
                  flexShrink={0}
                  onClick={() => removeFromCart(nft.collection.address, nft.tokenId)}
                  variant="ghost"
                  colorScheme="secondary"
                  aria-label="Remove-selection-button"
                >
                  <CloseIcon />
                </IconButton>
              </Flex>
            );
          })}
        </VStack>
        <Box width="100%" pr={2}>
          <Button isFullWidth onClick={prepareListing}>
            {t("Prepare Listing")}
          </Button>
        </Box>
      </VStack>
      {/* @todo Abstract this even further. Do not hardcode index-0. Send the NFTCard to a globally available ListForSaleModal */}
      {!!selectedItems.length && (
        <ListForSaleModal
          tokenId={selectedItems[0].tokenId}
          tokenName={selectedItems[0].name}
          tokenImage={selectedItems[0].image}
          collectionName={selectedItems[0].collection.name}
          collectionAddress={selectedItems[0].collection.address}
          collectionType={selectedItems[0].collection.type}
          isVerified={selectedItems[0].collection.isVerified}
          points={selectedItems[0].collection.points}
          collectionFloor={selectedItems[0].collection.floor}
          isOpen={sellDisclosure.isOpen}
          onClose={sellDisclosure.onClose}
          onListingComplete={clearCart}
        />
      )}
    </>
  );
};
