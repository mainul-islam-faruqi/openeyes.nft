import { IconButton, IconButtonProps, useDisclosure } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { LogoPolygonIcon } from "uikit";
import { ListingRewardExplanationModal } from "./index";

export const ListingRewardExplanationIconButton = (props: Omit<IconButtonProps, "aria-label">) => {
  const listingRewardDisclosure = useDisclosure();
  const { t } = useTranslation();
  return (
    <>
      <ListingRewardExplanationModal
        isOpen={listingRewardDisclosure.isOpen}
        onClose={listingRewardDisclosure.onClose}
      />
      <IconButton
        onClick={listingRewardDisclosure.onOpen}
        size="xs"
        aria-label={t("listing reward explanation button")}
        variant="ghost"
        colorScheme="gray"
        {...props}
      >
        <LogoPolygonIcon color="purple.400" boxSize={6} />
      </IconButton>
    </>
  );
};
