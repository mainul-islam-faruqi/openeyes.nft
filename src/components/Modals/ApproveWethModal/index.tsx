// import { ReactNode } from "react";
// import { useTranslation } from "react-i18next";
// import { Modal, ModalProps } from "uikit";
// import ApproveWethModalBody from "./ApproveWethModalBody";




import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import Modal from "uikit/Modal/Modal";
import { ModalProps } from "uikit/Modal/Modal";
import ApproveWethModalBody from "./ApproveWethModalBody";





interface Props {
  isOpen: ModalProps["isOpen"];
  onClose: ModalProps["onClose"];
  onConfirm: (transactionHash: string) => void;
  modalBodyContent?: ReactNode;
}

const ApproveWethModal = ({ isOpen, onClose, onConfirm, modalBodyContent }: Props) => {
  const { t } = useTranslation();

  const handleOnConfirm = (transactionHash: string) => {
    onConfirm(transactionHash);
    onClose();
  };

  return (
    <Modal size="sm" isOpen={isOpen} onClose={onClose} title={t("Enable WETH Spending")} closeOnOverlayClick={false}>
      <ApproveWethModalBody onConfirm={handleOnConfirm} modalBodyContent={modalBodyContent} />
    </Modal>
  );
};

export default ApproveWethModal;
