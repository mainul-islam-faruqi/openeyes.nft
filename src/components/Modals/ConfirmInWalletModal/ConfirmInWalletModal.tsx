// import { Modal, ModalProps } from "uikit/Modal/Modal";
// import { ConfirmInWalletModalBody, ConfirmInWalletModalBodyProps } from "./ConfirmInWalletModalBody";




import Modal from "uikit/Modal/Modal";
import { ModalProps } from "uikit/Modal/Modal";
import { ConfirmInWalletModalBody, ConfirmInWalletModalBodyProps } from "./ConfirmInWalletModalBody";






export interface ConfirmInWalletModalProps extends ConfirmInWalletModalBodyProps {
  isOpen: ModalProps["isOpen"];
}

export const ConfirmInWalletModal = ({
  isOpen,
  onClose,
  onRetry,
  txConfirmedTitle,
  txConfirmedText,
  actionText,
  actionHandler,
  bodyMetaComponent,
  isTxConfirmed = false,
  isTxSending = false,
  isTxWaiting = false,
  isTxError = false,
  txResponse,
}: ConfirmInWalletModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" closeOnOverlayClick={false} closeOnEsc={false}>
      <ConfirmInWalletModalBody
        onClose={onClose}
        onRetry={onRetry}
        isTxConfirmed={isTxConfirmed}
        isTxSending={isTxSending}
        isTxWaiting={isTxWaiting}
        isTxError={isTxError}
        txConfirmedTitle={txConfirmedTitle}
        txConfirmedText={txConfirmedText}
        actionText={actionText}
        actionHandler={actionHandler}
        bodyMetaComponent={bodyMetaComponent}
        txResponse={txResponse}
      />
    </Modal>
  );
};
