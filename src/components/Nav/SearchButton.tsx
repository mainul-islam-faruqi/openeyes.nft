import React from "react";
import { useTranslation } from "react-i18next";
import { Flex, IconButton, useDisclosure } from "@chakra-ui/react";
import { useHotkeys } from "react-hotkeys-hook";
import { Button, SearchIcon, Text } from "uikit";
import SearchModal from "./SearchModal";

export const DesktopSearchButton = () => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useHotkeys("cmd+/", () => onOpen());
  useHotkeys("esc", () => onClose());

  return (
    <>
      <SearchModal isOpen={isOpen} onClose={onClose} />
      <Button id="desktop-search-button-search" onClick={onOpen} round colorScheme="gray" width="100%" maxWidth="512px">
        <Flex width="100%" alignItems="flex-start">
          <SearchIcon color="text-placeholder" mr={{ base: 0, md: 3 }} />
          <Text display={{ base: "none", md: "block" }} color="text-placeholder">
            {t("Search")}
          </Text>
        </Flex>
      </Button>
    </>
  );
};

export const MobileSearchButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <SearchModal isOpen={isOpen} onClose={onClose} />
      <IconButton
        id="mobile-search-button-search"
        onClick={onOpen}
        aria-label="search"
        colorScheme="gray"
        rounded="50%"
        color="text-01"
      >
        <SearchIcon boxSize={6} />
      </IconButton>
    </>
  );
};
