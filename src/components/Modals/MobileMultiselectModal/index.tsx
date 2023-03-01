import { useTranslation } from "react-i18next";
import { NFTCard } from "types/graphql";
import { ModalBody, Modal, Text } from "uikit";

interface MobileMultiselectModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItems: NFTCard[];
}

const MobileMultiselectModal: React.FC<MobileMultiselectModalProps> = ({
  isOpen,
  onClose,
  selectedItems,
  children,
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      title={t("Selection ({{count}})", { count: selectedItems.length })}
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
      <ModalBody px={0} pt={0} pb={4} bg="ui-bg">
        {children}
      </ModalBody>
    </Modal>
  );
};

export default MobileMultiselectModal;
