import { MenuItem, UseDisclosureReturn } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { NFTCard } from "types/graphql";
import { isAddressOneOfOwners } from "utils/guards";

interface NftCardOwnerMenuItemsProps {
  nft: NFTCard;
  canListForSale: boolean;
  onOpenSellModal: UseDisclosureReturn["onOpen"];
  onOpenAdjustModal: UseDisclosureReturn["onOpen"];
}

export const NftCardOwnerMenuItems = ({
  nft,
  canListForSale,
  onOpenSellModal,
  onOpenAdjustModal,
}: NftCardOwnerMenuItemsProps) => {
  const { t } = useTranslation();
  const { account } = useWeb3React();

  const { tokenId, collection, owners } = nft;
  const isAddressOwner = isAddressOneOfOwners(account, owners);

  return (
    <>
      {canListForSale ? (
        <MenuItem onClick={onOpenSellModal}>{t("Sell")}</MenuItem>
      ) : (
        <MenuItem onClick={onOpenAdjustModal}>{t("Adjust Listing")}</MenuItem>
      )}
      <Link href={`/collections/${collection.address}/${tokenId}/transfer`} passHref>
        <MenuItem as="a" isDisabled={!isAddressOwner}>
          {t("Transfer")}
        </MenuItem>
      </Link>
    </>
  );
};
