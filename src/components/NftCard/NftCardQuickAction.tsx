// @ts-nocheck
import { Flex, Skeleton, UseDisclosureReturn } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { CancelOrdersButton } from "components/Buttons/CancelOrdersButton";
import { ConnectWalletButton } from "components/Buttons/ConnectWalletButton";
import { useEagerConnect } from "hooks/useEagerConnect";
import { useTranslation } from "next-i18next";
import { NFTCard } from "types/graphql";
import { MakerOrderWithSignatureAndHash } from "types/orders";
import { Button } from "uikit";
import { isAddressEqual, isAddressOneOfOwners } from "utils/guards";

interface NftCardQuickActionProps {
  nft: NFTCard;
  accountAsks: MakerOrderWithSignatureAndHash[];
  isFetchingErc1155Asks: boolean;
  onOpenCancelListing: UseDisclosureReturn["onOpen"];
  onOpenListItem: UseDisclosureReturn["onOpen"];
  onOpenMakeOffer: UseDisclosureReturn["onOpen"];
  onOpenBuyNow: UseDisclosureReturn["onOpen"];
}

export const NftCardQuickAction = ({
  nft,
  accountAsks,
  isFetchingErc1155Asks,
  onOpenCancelListing,
  onOpenListItem,
  onOpenMakeOffer,
  onOpenBuyNow,
}: NftCardQuickActionProps) => {
  const { owners, collection, ask } = nft;
  const isErc1155 = collection.type === "ERC1155";

  const { account } = useWeb3React();
  const { t } = useTranslation();
  const hasTriedConnection = useEagerConnect();

  const actionButton = (() => {
    const isAddressOwner = isAddressOneOfOwners(account, owners);

    if (hasTriedConnection && !account) {
      return (
        <ConnectWalletButton
          id="nft-card-action-button-connect-wallet"
          px={3}
          variant="ghost"
          isFullWidth
          borderRadius="lg"
          borderTopRightRadius={0}
          borderTopLeftRadius={0}
          justifyContent="start"
        >
          {t("Connect")}
        </ConnectWalletButton>
      );
    }

    if (isFetchingErc1155Asks) {
      return <Skeleton height={6} width="30%" ml={3} />;
    }

    // ERC1155 Cancel
    if (isErc1155 && accountAsks.length > 0) {
      return (
        <Button
          id="nft-card-action-button-cancel-listing-1155"
          onClick={onOpenCancelListing}
          variant="ghost"
          colorScheme="red"
          isFullWidth
          borderRadius="lg"
          borderTopRightRadius={0}
          borderTopLeftRadius={0}
          justifyContent="start"
        >
          {t("Cancel Listing")}
        </Button>
      );
    }

    // ERC721 cancel
    if (ask && isAddressEqual(ask.signer, account)) {
      return (
        <CancelOrdersButton
          id="nft-card-action-button-cancel-listing-721"
          nonces={[ask.nonce]}
          px={3}
          variant="ghost"
          colorScheme="red"
          isFullWidth
          borderRadius="lg"
          borderTopRightRadius={0}
          borderTopLeftRadius={0}
          justifyContent="start"
        >
          {t("Cancel Listing")}
        </CancelOrdersButton>
      );
    }

    // Buy Now
    if ((isErc1155 && ask) || (ask && !isAddressOwner)) {
      return (
        <Button
          id="nft-card-action-button-buy-now"
          onClick={onOpenBuyNow}
          variant="ghost"
          colorScheme="green"
          isFullWidth
          borderRadius="lg"
          borderTopRightRadius={0}
          borderTopLeftRadius={0}
          justifyContent="start"
        >
          {t("Buy Now")}
        </Button>
      );
    }

    // Sell
    if (!ask && isAddressOwner) {
      return (
        <Button
          id="nft-card-action-button-sell"
          onClick={onOpenListItem}
          variant="ghost"
          colorScheme="green"
          isFullWidth
          borderRadius="lg"
          borderTopRightRadius={0}
          borderTopLeftRadius={0}
          justifyContent="start"
        >
          {t("Sell")}
        </Button>
      );
    }

    // Make Offer
    if (!isAddressOwner) {
      return (
        <Button
          id="nft-card-action-button-make-offer"
          onClick={onOpenMakeOffer}
          variant="ghost"
          colorScheme="green"
          isFullWidth
          borderRadius="lg"
          borderTopRightRadius={0}
          borderTopLeftRadius={0}
          justifyContent="start"
        >
          {t("Make Offer")}
        </Button>
      );
    }
  })();

  return (
    <Flex
      alignItems="center"
      className="quick-action"
      height={12}
      borderRadius="lg"
      borderTopRightRadius={0}
      borderTopLeftRadius={0}
      visibility="hidden"
      pointerEvents="none"
      width="100%"
      position="absolute"
      top={0}
      left={0}
    >
      {actionButton}
    </Flex>
  );
};
