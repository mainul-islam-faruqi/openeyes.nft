import { useWeb3React } from "@web3-react/core";
import { Box, Collapse, Flex, Grid, GridItem, IconButton, Skeleton, useDisclosure } from "@chakra-ui/react";
import Link from "next/link";
import getUnixTime from "date-fns/getUnixTime";
import { useTranslation } from "react-i18next";
import { Button, SendIcon, Text } from "uikit";
import { getBalanceFromTokenOwners } from "utils/tokens";
import { NFT, OrderFilter, OrderSort, TokenOwner } from "types/graphql";
import { useOrders } from "hooks/graphql/orders";
import ListForSaleModal from "components/Modals/Orders/ListForSaleModal";
import MultipleListingCancellationModal from "components/Modals/Orders/MultipleListingCancellationModal";
import { AdjustListingModal } from "components/Modals/Orders/AdjustListingModal";
import { CancelOrdersButton } from "components/Buttons";

interface OwnerBarProps {
  nft: NFT;
  owners: TokenOwner[];
}

const now = getUnixTime(new Date());

export const OwnerBar: React.FC<OwnerBarProps> = ({ nft, owners }) => {
  const { t } = useTranslation();
  const { account } = useWeb3React();
  const isErc1155 = nft.collection.type === "ERC1155";
  const { collection, tokenId, name, image, ask } = nft;
  const numberOwned = getBalanceFromTokenOwners(account, owners);

  const { isOpen: isOpenForSaleModal, onOpen: onOpenListForSaleModal, onClose: onCloseForSaleModal } = useDisclosure();
  const {
    isOpen: isOpenMultipleListingCancellation,
    onOpen: onOpenMultipleListingCancellation,
    onClose: onCloseMultipleListingCancellation,
  } = useDisclosure();
  const adjustListingDiscolure = useDisclosure();

  const signerFilter = account ? { signer: account } : {};
  const erc1155Filter: OrderFilter = {
    isOrderAsk: true,
    collection: collection.address,
    tokenId,
    endTime: now,
    ...signerFilter,
  };
  const erc1155AsksQuery = useOrders(
    {
      filter: erc1155Filter,
      sort: OrderSort.PRICE_ASC,
      pagination: { first: 50 },
    },
    {
      enabled: isErc1155 && !!(numberOwned >= 1),
    }
  );
  const ownerOrders = (() => {
    if (isErc1155) {
      return erc1155AsksQuery.isSuccess ? erc1155AsksQuery.data : [];
    }

    return ask ? [ask] : [];
  })();

  const getLabel = () => {
    if (isErc1155) {
      if (erc1155AsksQuery.isLoading) {
        return (
          <>
            <Skeleton height="16px" width="84px" />
            <Skeleton height="48px" width="60px" />
          </>
        );
      }

      return (
        erc1155AsksQuery.isSuccess && (
          <Text textStyle="helper" color="text-03">
            {t("Yours: {{numberOnSale}}/{{numberOwned}} Listed", {
              numberOnSale: erc1155AsksQuery.data.length,
              numberOwned,
            })}
          </Text>
        )
      );
    }

    return (
      <Text textStyle="helper" color="text-03">
        {nft.ask ? t("Yours: Listed") : t("Yours: Unlisted")}
      </Text>
    );
  };

  const getPrimaryActions = () => {
    return (
      <Box>
        {ownerOrders.length < numberOwned && (
          <Button size="sm" onClick={onOpenListForSaleModal} mr={2}>
            {t("Sell")}
          </Button>
        )}
        <Link href={`/collections/${nft.collection.address}/${tokenId}/transfer`} passHref>
          <IconButton as="a" size="sm" aria-label="transfer" colorScheme="gray">
            <SendIcon />
          </IconButton>
        </Link>
      </Box>
    );
  };

  const getCancelButton = () => {
    if (isErc1155 && ownerOrders.length > 0) {
      return (
        <Button isFullWidth variant="outline" colorScheme="red" size="sm" onClick={onOpenMultipleListingCancellation}>
          {t("Cancel Listing")}
        </Button>
      );
    }

    if (ownerOrders.length === 1 && nft.ask) {
      return (
        <CancelOrdersButton nonces={[nft.ask.nonce]} variant="outline" colorScheme="red" size="sm" isFullWidth>
          {t("Cancel Listing")}
        </CancelOrdersButton>
      );
    }
    return null;
  };

  const getAdjustButton = () => {
    if (ownerOrders.length === 0) {
      return null;
    }

    return (
      <Button isFullWidth colorScheme="gray" size="sm" onClick={() => adjustListingDiscolure.onOpen()}>
        {t("Adjust Listing")}
      </Button>
    );
  };

  return (
    <Collapse in={numberOwned >= 1} unmountOnExit>
      <AdjustListingModal
        isOpen={adjustListingDiscolure.isOpen}
        onClose={adjustListingDiscolure.onClose}
        orders={ownerOrders}
        collectionType={nft.collection.type}
        tokenName={nft.name}
        tokenImage={nft.image}
        collectionName={nft.collection.name}
        isVerified={nft.collection.isVerified}
        collectionFloor={nft.collection.floor}
        points={nft.collection.points}
      />
      {erc1155AsksQuery.isSuccess && (
        <MultipleListingCancellationModal
          orders={erc1155AsksQuery.data}
          collectionFloorOrderPrice={nft.collection.floorOrder?.price}
          isOpen={isOpenMultipleListingCancellation}
          onClose={onCloseMultipleListingCancellation}
        />
      )}
      <ListForSaleModal
        tokenId={tokenId}
        tokenName={name}
        tokenImage={image}
        collectionName={collection.name}
        collectionAddress={collection.address}
        collectionType={collection.type}
        collectionFloor={collection.floor}
        isVerified={collection.isVerified}
        points={collection.points}
        isOpen={isOpenForSaleModal}
        onClose={onCloseForSaleModal}
      />
      <Box bg="ui-01" p={4}>
        <Flex alignItems="center" justifyContent="space-between">
          {getLabel()}
          {getPrimaryActions()}
        </Flex>
        {ownerOrders.length > 0 && (
          <Grid gridTemplateColumns="50% 50%" gridColumnGap={2} mt={4}>
            <GridItem>{getAdjustButton()}</GridItem>
            <GridItem>{getCancelButton()}</GridItem>
          </Grid>
        )}
      </Box>
    </Collapse>
  );
};
