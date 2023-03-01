import { useTranslation } from "react-i18next";
import { ModalBody, Modal, ModalProps } from "uikit";
import StakeLooksAggregator from "./StakeLooksAggregator";

interface Props {
  onConfirm: (txHash: string) => void;
  onClose: ModalProps["onClose"];
  isOpen: ModalProps["isOpen"];
  stakingAmount: string;
}

const StakeLooksAggregatorModal = ({ onConfirm, onClose, isOpen, stakingAmount }: Props) => {
  const { t } = useTranslation();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t("Confirmation")} closeOnOverlayClick>
      <ModalBody>
        <StakeLooksAggregator stakingAmount={stakingAmount} onConfirm={onConfirm} />
      </ModalBody>
    </Modal>
  );
};

export default StakeLooksAggregatorModal;
