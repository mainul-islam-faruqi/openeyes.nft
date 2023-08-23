import {
  IconButton,
  MenuItem,
  MenuList,
  MenuButton,
  useClipboard,
  MenuDivider,
  Box,
  Portal,
  UseDisclosureReturn,
} from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { useTranslation } from "next-i18next";
import { CloseIcon, MenuHorizontalIcon } from "uikit";
import { currentChainInfo } from "config/chains";
import { Menu } from "uikit/Menu/Menu";
import { useRefreshTokenMetadata } from "hooks/useRefreshTokenMetadata";
import { NFTCard } from "types/graphql";
import { isAddressOneOfOwners } from "utils/guards";
import { NftCardOwnerMenuItems } from "./NftCardOwnerMenuItems";

interface NftCardMenuProps {
  nft: NFTCard;
  canListForSale: boolean;
  onOpenSellModal: UseDisclosureReturn["onOpen"];
  onOpenAdjustModal: UseDisclosureReturn["onOpen"];
  onOpenMakeOfferModal: UseDisclosureReturn["onOpen"];
  onOpenMakeCollectionOfferModal: UseDisclosureReturn["onOpen"];
}

export const NftCardMenu = ({
  nft,
  canListForSale,
  onOpenSellModal,
  onOpenAdjustModal,
  onOpenMakeOfferModal,
  onOpenMakeCollectionOfferModal,
}: NftCardMenuProps) => {
  const { t } = useTranslation();
  const { account } = useWeb3React();
  const { collection, owners, ask } = nft;
  const url = `${currentChainInfo.appUrl}/collections/${collection.address}/${nft.tokenId}`;

  const { onCopy } = useClipboard(url);
  const isAddressOwner = isAddressOneOfOwners(account, owners);
  const refreshTokenMetadata = useRefreshTokenMetadata();

  return (
    <Box>
      <Menu placement="bottom-end" isLazy>
        {({ isOpen }) => (
          <>
            <MenuButton as={IconButton} aria-label="share" variant="ghost" colorScheme="gray" size="sm">
              {isOpen ? <CloseIcon /> : <MenuHorizontalIcon />}
            </MenuButton>
            <Portal>
              <MenuList zIndex="dropdown">
                {isAddressOwner && (
                  <>
                    <NftCardOwnerMenuItems
                      nft={nft}
                      canListForSale={canListForSale}
                      onOpenSellModal={onOpenSellModal}
                      onOpenAdjustModal={onOpenAdjustModal}
                    />
                    <MenuDivider />
                  </>
                )}
                <>
                  {ask && !isAddressOwner && <MenuItem onClick={onOpenMakeOfferModal}>{t("Make Offer")}</MenuItem>}
                  <MenuItem onClick={onOpenMakeCollectionOfferModal}>{t("Make Collection Offer")}</MenuItem>
                  <MenuDivider />
                </>
                <MenuItem onClick={onCopy}>{t("Copy Link")}</MenuItem>
                <MenuItem onClick={() => refreshTokenMetadata(collection.address, nft.tokenId)}>
                  {t("Refresh Metadata")}
                </MenuItem>
              </MenuList>
            </Portal>
          </>
        )}
      </Menu>
    </Box>
  );
};
