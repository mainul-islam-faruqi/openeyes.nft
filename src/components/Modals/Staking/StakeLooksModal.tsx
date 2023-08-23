import { useTranslation } from "react-i18next";
import { ModalBody, Modal, ModalProps } from "uikit";
import StakeLooks, { StakeLooksProps } from "./StakeLooks";

interface StakeLooksModalProps extends StakeLooksProps {
  onClose: ModalProps["onClose"];
  isOpen: ModalProps["isOpen"];
  stakingAmount: string;
}

const StakeLooksModal = ({
  onConfirm,
  onClose,
  isOpen,
  stakingAmount,
  shouldClaimRewardToken,
}: StakeLooksModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t("Confirmation")} closeOnOverlayClick>
      <ModalBody>
        <StakeLooks
          stakingAmount={stakingAmount}
          shouldClaimRewardToken={shouldClaimRewardToken}
          onConfirm={onConfirm}
        />
      </ModalBody>
    </Modal>
  );
};

export default StakeLooksModal;
