import { useState } from "react";
import { UseDisclosureReturn } from "@chakra-ui/hooks";
import { AspectRatio, Box, Flex, Grid, GridItem, Skeleton } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import flatten from "lodash/flatten";
import times from "lodash/times";
import { NFTAvatar } from "types/graphql";
import { useToast } from "hooks/useToast";
import { Button, Modal, ModalFooterGrid, SectionPlaceholder } from "uikit";
import { isAddressEqual } from "utils/guards";
import { getApiErrorMessage } from "utils/errors";
import { useUpdateUserAvatar, useUserProfileNfts } from "hooks/graphql/user";
import { Image } from "components/Image";
import { getNFTAvatar } from "./helpers";
import { NftGridLoader } from "./styles";

export interface SelectProfileNftModalProps {
  address: string;
  initialSelectedAvatar?: NFTAvatar;
  onAvatarUpdateSuccess: (userAvatar: NFTAvatar) => void;
  onClose: UseDisclosureReturn["onClose"];
}

export const SelectProfileNftModal = ({
  address,
  initialSelectedAvatar,
  onAvatarUpdateSuccess,
  onClose,
}: SelectProfileNftModalProps) => {
  const { t } = useTranslation();
  const toast = useToast();
  const [localNftItem, setLocalSelectedNft] = useState(initialSelectedAvatar);
  const userNftsQuery = useUserProfileNfts(address);
  const updateAvatar = useUpdateUserAvatar({
    onSuccess: (user) => {
      const avatarData = getNFTAvatar(user.avatar);

      if (avatarData) {
        onAvatarUpdateSuccess(avatarData);
      }
    },
    onError: (error) => {
      toast({
        status: "error",
        title: t("Error"),
        description: getApiErrorMessage(error),
      });
    },
  });

  const flattenedNfts = userNftsQuery.isSuccess ? flatten(userNftsQuery.data.pages) : [];

  const handleSelect = (nftAvatar: NFTAvatar) => {
    setLocalSelectedNft(nftAvatar);
  };

  const handleSaveAvatar = async () => {
    if (localNftItem) {
      updateAvatar.mutate({
        collection: localNftItem.collection,
        tokenId: localNftItem.tokenId,
      });
    }
  };

  const renderNfts = () => {
    if (userNftsQuery.isLoading) {
      return (
        <Grid
          gridTemplateColumns={{ base: "repeat(2, 1fr)", xs: "repeat(3, 1fr)", md: "repeat(4, 1fr)" }}
          gridGap={4}
          p={4}
        >
          {times(8).map((n) => (
            <AspectRatio ratio={1} key={n}>
              <Skeleton key={n} />
            </AspectRatio>
          ))}
        </Grid>
      );
    }

    if (flattenedNfts.length === 0) {
      return <SectionPlaceholder py={6}>{t("No NFTs found")}</SectionPlaceholder>;
    }

    return (
      <Grid
        gridTemplateColumns={{ base: "repeat(2, 1fr)", xs: "repeat(3, 1fr)", md: "repeat(4, 1fr)" }}
        gridGap={4}
        p={4}
      >
        {userNftsQuery.isLoading && <NftGridLoader />}
        {flattenedNfts.map((nftAvatar) => {
          const isSelected =
            localNftItem &&
            isAddressEqual(nftAvatar.collection, localNftItem?.collection) &&
            nftAvatar.tokenId === localNftItem.tokenId;

          return (
            <GridItem
              key={`${nftAvatar.collection}-${nftAvatar.tokenId}`}
              cursor="pointer"
              onClick={() => handleSelect(nftAvatar)}
              opacity={isSelected ? "1" : "0.5"}
              sx={{ _hover: { opacity: "1" } }}
              transition="opacity 350ms ease"
            >
              <Image
                alt="user nft"
                height={156}
                width={156}
                src={nftAvatar.image.src}
                contentType={nftAvatar.image.contentType}
                title={nftAvatar.name}
              />
            </GridItem>
          );
        })}
      </Grid>
    );
  };

  return (
    <Modal
      isOpen
      title={t("Choose an NFT From Your Wallet")}
      onClose={onClose}
      motionPreset="none"
      closeOnOverlayClick={false}
    >
      <Box my={6} maxHeight="598px" overflowY="auto">
        {renderNfts()}
        {userNftsQuery.hasNextPage && (
          <Flex justifyContent="center" py={2}>
            <Button
              isLoading={userNftsQuery.isFetching}
              disabled={userNftsQuery.isLoading}
              onClick={() => userNftsQuery.fetchNextPage()}
              size="xs"
            >
              {t("Load More")}
            </Button>
          </Flex>
        )}
      </Box>
      <ModalFooterGrid>
        <Button variant="tall" colorScheme="gray" isFullWidth onClick={onClose} disabled={updateAvatar.isLoading}>
          {t("Close")}
        </Button>
        <Button
          tabIndex={1}
          variant="tall"
          colorScheme="green"
          isFullWidth
          disabled={!localNftItem}
          onClick={handleSaveAvatar}
          isLoading={updateAvatar.isLoading}
        >
          {t("Save")}
        </Button>
      </ModalFooterGrid>
    </Modal>
  );
};
