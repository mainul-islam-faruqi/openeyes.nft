import { useDisclosure } from "@chakra-ui/react";
import CancelAllOrdersModal from "../Modals/CancelAllOrdersModal";
import React from "react";
import { useTranslation } from "react-i18next";
import { Button, ButtonProps } from "uikit/Button/Button";

export const CancelAllOrdersButton: React.FC<ButtonProps> = (props) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <CancelAllOrdersModal isOpen={isOpen} onClose={onClose} />
      <Button size="sm" {...props} onClick={onOpen}>
        {t("Cancel Offers + Listings")}
      </Button>
    </>
  );
};

CancelAllOrdersButton.defaultProps = {
  variant: "outline",
  colorScheme: "red",
};
