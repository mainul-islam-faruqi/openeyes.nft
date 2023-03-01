import  Modal  from "uikit/Modal/Modal";
import { CancelAllOrders, CancelAllOrdersProps } from "./CancelAllOrders";

interface CancelAllOrdersModalProps extends CancelAllOrdersProps {
  isOpen: boolean;
}

const CancelAllOrdersModal = ({ isOpen, onClose }: CancelAllOrdersModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton size="sm">
      <CancelAllOrders onClose={onClose} />
    </Modal>
  );
};

export default CancelAllOrdersModal;
