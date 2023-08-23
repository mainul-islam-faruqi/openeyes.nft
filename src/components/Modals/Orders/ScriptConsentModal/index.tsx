import { useTranslation } from "next-i18next";
import { Modal, ModalProps } from "uikit";
import { ScriptConsentModalBody } from "./body";

interface Props {
  onClose: ModalProps["onClose"];
  isOpen: ModalProps["isOpen"];
  onConfirm: () => void;
}

const ScriptConsentModal = ({ onClose, onConfirm, isOpen }: Props) => {
  const { t } = useTranslation();

  return (
    <Modal
      isOpen={isOpen}
      variant="standard"
      size="sm"
      title={t("Allow HTML/JavaScript?")}
      onClose={onClose}
      closeOnOverlayClick={false}
    >
      <ScriptConsentModalBody onClose={onClose} onConfirm={onConfirm} />
    </Modal>
  );
};

export default ScriptConsentModal;
