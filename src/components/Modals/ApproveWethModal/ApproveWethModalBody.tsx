// import React, { useState, ReactNode } from "react";
// import { useWeb3React } from "@web3-react/core";
// import { TransactionReceipt } from "@ethersproject/abstract-provider";
// import { useTranslation } from "react-i18next";
// import { ModalBody } from "uikit";
// import { addresses } from "config";
// import { approve } from "utils/calls/erc20";
// import { TransactionStep } from "../Orders/shared";
// import { useSubmitTransaction } from "hooks/useSubmitTransaction";
// import { getErrorMessage } from "utils/errors";
// import { useToast } from "hooks/useToast";




import React, { useState, ReactNode } from "react";
import { useWeb3React } from "@web3-react/core";
import { TransactionReceipt } from "@ethersproject/abstract-provider";
import { useTranslation } from "react-i18next";
import ModalBody from "uikit/Modal/ModalBody";
import { addresses } from "config/addresses";
import { approve } from "utils/calls/erc20";
import { TransactionStep } from "../Orders/shared";
import { useSubmitTransaction } from "hooks/useSubmitTransaction";
import { getErrorMessage } from "utils/errors";
import { useToast } from "hooks/useToast";




interface Props {
  onConfirm: (transaction: string) => void;
  modalBodyContent?: ReactNode;
}

const ApproveWethModalBody: React.FC<Props> = ({ onConfirm, modalBodyContent }) => {
  const { t } = useTranslation();
  const { library, account } = useWeb3React();
  const [transaction, setTransaction] = useState<string>();

  const toast = useToast();

  const { submitTransaction } = useSubmitTransaction({
    onSend: async () => {
      const response = await approve(library, addresses.WETH, account!, addresses.EXCHANGE);
      setTransaction(response.hash);
      return response;
    },
    onSuccess: (receipt: TransactionReceipt) => {
      onConfirm(receipt.transactionHash);
      setTransaction(undefined);
    },
    onError: (error: any) => {
      toast({ title: t("Error"), description: getErrorMessage(error), status: "error" });
    },
  });

  return (
    <ModalBody>
      {modalBodyContent}
      <TransactionStep
        onSendRequest={submitTransaction}
        title={t("Enable WETH spending")}
        message={t("Confirm the transaction in your wallet. This lets you spend WETH to buy NFTs.")}
        status="current"
        transaction={transaction}
      />
    </ModalBody>
  );
};

export default ApproveWethModalBody;
