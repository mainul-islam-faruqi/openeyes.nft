import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { ModalBody, ModalFooterGrid, Modal, Text, Button } from "uikit";

interface ModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  onResetAll: () => void;
  children: ReactJSXElement;
}

const MobileFilterModal: React.FC<ModalWrapperProps> = ({ isOpen, onClose, onResetAll, children }) => {
  const { t } = useTranslation();

  return (
    <Modal
      title={t("Filters")}
      size="md"
      isOpen={isOpen}
      onClose={onClose}
      rightIcon={
        <Text textStyle="detail" color="link-01" bold>
          {t("Done")}
        </Text>
      }
      showCloseButton
      motionPreset="slideInBottom"
      modalContentProps={{ alignSelf: "flex-end", mb: 0, maxHeight: "calc(100% - 8rem)" }}
      scrollBehavior="inside"
    >
      <ModalBody p={0} bg="ui-bg">
        {children}
      </ModalBody>
      <ModalFooterGrid>
        <Button variant="tall" colorScheme="gray" flex={1} onClick={onResetAll}>
          {t("Reset All")}
        </Button>
        <Button variant="tall" flex={1} onClick={onClose}>
          {t("Done")}
        </Button>
      </ModalFooterGrid>
    </Modal>
  );
};

export default MobileFilterModal;
