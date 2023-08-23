// import { useState, useCallback } from "react";
// import { useTranslation } from "react-i18next";
// import { useWeb3React } from "@web3-react/core";
// import MainView from "./AcknowledgementView";
// import { ConfirmInWalletModalBody } from "components/Modals/ConfirmInWalletModal/ConfirmInWalletModalBody";
// import { getErrorMessage } from "utils/errors";
// import { useSubmitTransaction } from "hooks/useSubmitTransaction";
// import { useToast } from "hooks/useToast";
// import { cancelAllOrdersForSender } from "utils/calls/exchange";
// import { getUserNonce } from "utils/graphql";






import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useWeb3React } from "@web3-react/core";
import MainView from "./AcknowledgementView";
import { ConfirmInWalletModalBody } from "../../Modals/ConfirmInWalletModal/ConfirmInWalletModalBody";
import { getErrorMessage } from "utils/errors";
import { useSubmitTransaction } from "hooks/useSubmitTransaction";
import { useToast } from "hooks/useToast";
import { cancelAllOrdersForSender } from "utils/calls/exchange";
import { getUserNonce } from "utils/graphql/user";





enum View {
  ACKNOWLEDGEMENT,
  TRANSACTION,
}

export interface CancelAllOrdersProps {
  onClose: () => void;
}

export const CancelAllOrders = ({ onClose }: CancelAllOrdersProps) => {
  const { t } = useTranslation();
  const { account, library } = useWeb3React();
  const [viewIndex, setViewIndex] = useState(View.ACKNOWLEDGEMENT);
  const toast = useToast();

  const { submitTransaction, isTxConfirmed, isTxError, isTxSending, isTxWaiting } = useSubmitTransaction({
    onSend: async () => {
      const nonce = await getUserNonce(account!);
      const transaction = await cancelAllOrdersForSender(library, account!, nonce);
      return transaction;
    },
    onSuccess: () => {
      onClose();
      toast({
        title: t("Cancelled!"),
        description: t("Your listings and offers have been canceled."),
      });
    },
    onError: (error) => {
      toast({
        status: "error",
        title: t("Error"),
        description: getErrorMessage(error),
      });
    },
  });

  const handleSubmit = () => {
    setViewIndex(View.TRANSACTION);
    submitTransaction();
  };

  const handleClose = useCallback(() => {
    setViewIndex(View.ACKNOWLEDGEMENT);
    onClose();
  }, [onClose]);

  if (viewIndex === View.TRANSACTION) {
    return (
      <ConfirmInWalletModalBody
        onClose={handleClose}
        isTxConfirmed={isTxConfirmed}
        isTxSending={isTxSending}
        isTxWaiting={isTxWaiting}
        isTxError={isTxError}
      />
    );
  }
  return <MainView onConfirm={handleSubmit} onClose={handleClose} />;
};
