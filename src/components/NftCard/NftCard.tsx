import React, { ReactEventHandler, useMemo } from "react";
import { Box, BoxProps, Divider, Flex, useDisclosure } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { NFTCard, OrderSort, OrderStatus } from "types/graphql";
import { getUnixTime } from "date-fns";
import { Text } from "uikit";
import { getCurrencyConfig } from "config/currencies";
import { formatAsCompactNumber, formatToSignificant } from "utils/format";
import { getOwnerBalance } from "utils/tokens";
import { isAddressEqual, isAddressOneOfOwners } from "utils/guards";
import { useOrders } from "hooks/graphql/orders";
import { useAddressFromQuery } from "views/account/hooks/useAddressFromQuery";
import ListForSaleModal from "components/Modals/Orders/ListForSaleModal";
import CreateStandardBidModal from "components/Modals/Orders/CreateStandardBidModal";
import CreateCollectionBidModal from "components/Modals/Orders/CreateCollectionBidModal";
import { AdjustListingModal } from "components/Modals/Orders/AdjustListingModal";
import BuyNowModal from "components/Modals/Orders/BuyNowModal";
import MultipleListingCancellationModal from "components/Modals/Orders/MultipleListingCancellationModal";
import { NftCardCollectionTitle } from "./NftCardCollectionTitle";
import { NftCardContainer } from "./NftCardContainer";
import { NftCardImage } from "./NftCardImage";
import { NftCardPrice } from "./NftCardPrice";
import { NftCardTitle } from "./NftCardTitle";
import { NftCardMenu } from "./NftCardMenu";
import { NftCardRarityRank } from "./NftCardRarityRank";
import { NftCardQuickAction } from "./NftCardQuickAction";
import { NftCardBalance } from "./NftCardBalance";
import { NftCardOfferPrice } from "./NftCardOfferPrice";
import { NftCardLargeCheckbox } from "./NftCardLargeCheckbox";

export interface NftCardProps {
  nft: NFTCard;
  isAccountPage?: boolean;
  showCollectionName?: boolean;
  enableSingleRarityFetch?: boolean;
  isMultiselectActive?: boolean;
  isSelected?: boolean;
  onClickListItem?: (nft: NFTCard) => void;
  anchorProps?: BoxProps;
}

export const NftCard = ({
  nft,
  isAccountPage,
  showCollectionName = true,
  enableSingleRarityFetch = false,
  isMultiselectActive = false,
  isSelected = false,
  onClickListItem,
  anchorProps,
}: NftCardProps) => {
  const { tokenId, name, collection, image, owners, ask, bids } = nft;

  const { t } = useTranslation();
  const { account } = useWeb3React();
  const { locale } = useRouter();
  const pageAddress = useAddressFromQuery();

  const isErc1155 = collection.type === "ERC1155";
  const isListingRewardsEligible = !!collection.points;
  const [highestBid] = bids;

  const tokensOwnedByAddress = isAccountPage ? getOwnerBalance(owners, pageAddress) : getOwnerBalance(owners, account);
  const isAccountOwner = isAddressOneOfOwners(account, owners);
  const HighestBidIcon = highestBid && getCurrencyConfig(highestBid.currency).icon;

  const { isOpen: isActive, onOpen: onActive, onClose: onInactive } = useDisclosure();
  const sellDisclosure = useDisclosure();
  const offerDisclosure = useDisclosure();
  const collectionOfferDisclosure = useDisclosure();
  const adjustListingDisclosure = useDisclosure();
  const cancelListingDisclosure = useDisclosure();
  const buyNowDisclosure = useDisclosure();

  const additionalErc1155FetchesEnabled = isErc1155 && !!account && !!ask && isActive;
  const now = useMemo(() => getUnixTime(new Date()), []);
  // Query to get first 50 asks for erc1155 where connected wallet is signer
  const erc1155AccountAsksQuery = useOrders(
    {
      filter: {
        isOrderAsk: true,
        collection: collection.address,
        tokenId,
        endTime: now,
        status: [OrderStatus.VALID],
        ...(account ? { signer: account } : {}),
      },
      sort: OrderSort.PRICE_ASC,
      pagination: { first: 50 },
    },
    {
      enabled: additionalErc1155FetchesEnabled,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  // Query to get first 50 asks for erc1155 token regardless of signer.
  const erc1155AsksQuery = useOrders(
    {
      filter: {
        isOrderAsk: true,
        collection: collection.address,
        tokenId,
        endTime: now,
        status: [OrderStatus.VALID],
      },
      sort: OrderSort.PRICE_ASC,
      pagination: { first: 50 },
    },
    {
      enabled: additionalErc1155FetchesEnabled,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  const executableAsk = (() => {
    if (isErc1155 && erc1155AsksQuery.isSuccess) {
      //  @TODO: Temp FE filtering until a 'signer does not eq' filter is added to the BE.
      const [nonOwnerErc1155Ask] = erc1155AsksQuery.data.filter((ercAsk) => !isAddressEqual(ercAsk.signer, account));
      return nonOwnerErc1155Ask;
    }

    if (ask && !isAddressEqual(ask.signer, account)) {
      return ask;
    }
  })();

  const accountAsks = (() => {
    if (isErc1155 && erc1155AccountAsksQuery.isSuccess) {
      return erc1155AccountAsksQuery.data;
    }

    // ERC721
    return isAccountOwner && ask ? [ask] : [];
  })();
  const canListForSale = isAccountOwner && tokensOwnedByAddress.gt(accountAsks.length);

  const handleMenuClick: ReactEventHandler = (evt) => {
    evt.preventDefault();
  };

  // @TODO abstract all of these Modal functions into props. Move the modals out of NftCard
  // Once abstracted, we can pass `onClickListItem` without this wrapper
  const handleClickListItem = () => {
    if (onClickListItem) {
      onClickListItem(nft);
      return;
    }

    sellDisclosure.onOpen();
  };

  return (
    <>
      <NftCardContainer
        canListForSale={canListForSale}
        href={`/collections/${collection.address}/${tokenId}`}
        isActive={isActive}
        onActive={onActive}
        onInactive={onInactive}
        isMultiselectActive={isMultiselectActive}
        isSelected={isSelected}
        anchorProps={anchorProps}
      >
        <Box px={3} pt={3} sx={{ ...(isMultiselectActive && { pointerEvents: "none" }) }}>
          <Box position="relative">
            <NftCardImage src={image.src} contentType={image.contentType} alt={`${name} image`} />
            {isAccountPage && tokensOwnedByAddress.gt(1) && (
              <NftCardBalance balance={formatAsCompactNumber(tokensOwnedByAddress, locale)} />
            )}
          </Box>
          {showCollectionName && (
            <NftCardCollectionTitle
              address={collection.address}
              isVerified={collection.isVerified}
              isListingRewardsEligible={isListingRewardsEligible}
            >
              {collection.name}
            </NftCardCollectionTitle>
          )}
          <NftCardTitle title={name} mt={showCollectionName ? 0 : 3} />
          <Flex alignItems="center" justifyContent="space-between" mb={3} minHeight={6}>
            {ask ? (
              <NftCardPrice
                price={formatToSignificant(ask.price, 4)}
                currencyIcon={getCurrencyConfig(ask.currency, true).icon}
              />
            ) : (
              <Text textStyle="helper" color="text-disabled">
                {t("Unlisted")}
              </Text>
            )}
            <NftCardRarityRank
              collectionAddress={collection.address}
              tokenId={tokenId}
              enableSingleRarityFetch={enableSingleRarityFetch}
              totalSupply={collection.totalSupply}
            />
          </Flex>
          <Divider />
        </Box>
        <Flex
          alignItems="center"
          justifyContent="space-between"
          height={12}
          onClick={handleMenuClick}
          position="relative"
        >
          <NftCardQuickAction
            nft={nft}
            accountAsks={accountAsks}
            isFetchingErc1155Asks={erc1155AccountAsksQuery.isFetching || erc1155AsksQuery.isFetching}
            onOpenCancelListing={cancelListingDisclosure.onOpen}
            onOpenListItem={handleClickListItem}
            onOpenMakeOffer={offerDisclosure.onOpen}
            onOpenBuyNow={buyNowDisclosure.onOpen}
          />
          <Box pl={3}>
            {!isActive && highestBid && (
              <NftCardOfferPrice
                icon={HighestBidIcon}
                label={t("Offer")}
                price={formatToSignificant(highestBid.price)}
              />
            )}
          </Box>
          <Box height={12} width={12} flexShrink={0} p={1}>
            {isMultiselectActive ? (
              <NftCardLargeCheckbox isChecked={isSelected} />
            ) : (
              <NftCardMenu
                nft={nft}
                canListForSale={canListForSale}
                onOpenSellModal={handleClickListItem}
                onOpenAdjustModal={adjustListingDisclosure.onOpen}
                onOpenMakeOfferModal={offerDisclosure.onOpen}
                onOpenMakeCollectionOfferModal={collectionOfferDisclosure.onOpen}
              />
            )}
          </Box>
        </Flex>
      </NftCardContainer>
      <ListForSaleModal
        tokenId={tokenId}
        tokenName={name}
        tokenImage={image}
        collectionName={collection.name}
        collectionAddress={collection.address}
        collectionType={collection.type}
        isVerified={collection.isVerified}
        points={collection.points}
        collectionFloor={collection.floor}
        isOpen={sellDisclosure.isOpen}
        onClose={sellDisclosure.onClose}
      />
      <CreateStandardBidModal
        isOpen={offerDisclosure.isOpen}
        onClose={offerDisclosure.onClose}
        tokenId={tokenId}
        tokenName={name}
        tokenImage={image}
        collectionAddress={collection.address}
        collectionName={collection.name}
        bids={bids}
        ask={ask}
        isVerified={collection.isVerified}
      />
      <CreateCollectionBidModal
        collectionAddress={collection.address}
        collectionName={collection.name}
        isVerified={collection.isVerified}
        collectionFloorOrder={collection.floorOrder}
        isOpen={collectionOfferDisclosure.isOpen}
        onClose={collectionOfferDisclosure.onClose}
      />
      <AdjustListingModal
        isOpen={adjustListingDisclosure.isOpen}
        onClose={adjustListingDisclosure.onClose}
        orders={accountAsks}
        collectionType={nft.collection.type}
        tokenName={nft.name}
        tokenImage={nft.image}
        collectionName={nft.collection.name}
        isVerified={nft.collection.isVerified}
        collectionFloor={nft.collection.floor}
        points={nft.collection.points}
      />
      {executableAsk && (
        <BuyNowModal
          tokenId={tokenId}
          tokenName={name}
          tokenImage={image}
          collectionName={collection.name}
          collectionAddress={collection.address}
          collectionType={collection.type}
          isVerified={collection.isVerified}
          ask={executableAsk}
          isOpen={buyNowDisclosure.isOpen}
          onClose={buyNowDisclosure.onClose}
        />
      )}
      {erc1155AccountAsksQuery.isSuccess && (
        <MultipleListingCancellationModal
          orders={erc1155AccountAsksQuery.data}
          collectionFloorOrderPrice={nft.collection.floorOrder?.price}
          isOpen={cancelListingDisclosure.isOpen}
          onClose={cancelListingDisclosure.onClose}
        />
      )}
    </>
  );
};
