import React from "react";
import { BigNumber, BigNumberish } from "ethers";
import { useTranslation } from "react-i18next";
import { useWeb3React } from "@web3-react/core";
import noop from "lodash/noop";
import { Button, ButtonProps } from "uikit/Button/Button";
import { getErrorMessage } from "utils/errors";
import { cancelMultipleMakerOrders } from "utils/calls/exchange";
import { useSubmitTransaction } from "hooks/useSubmitTransaction";
import { useToast } from "hooks/useToast";
import { ConnectWalletGuard } from "../Layout/ConnectWalletGuard";

interface Props extends ButtonProps {
  nonces: BigNumberish[];
  onSuccess?: () => void;
}

export const CancelOrdersButton: React.FC<Props> = ({ nonces, onSuccess = noop, children, ...props }) => {
  const { t } = useTranslation();
  const { library, account } = useWeb3React();
  const toast = useToast();

  const noncesAsBn = nonces.map((nonce) => BigNumber.from(nonce));

  const { submitTransaction, isTxSending, isTxWaiting } = useSubmitTransaction({
    onSend: async () => {
      const transaction = await cancelMultipleMakerOrders(library, account!, noncesAsBn); // Button wrapped in ConnectWalletGuard so account will exist
      return transaction;
    },
    onSuccess: () => {
      onSuccess();
      toast({
        title: t("Canceled"),
        description:
          nonces.length > 1
            ? t("Your {{countOrders}} orders have been successfully canceled", { countOrders: nonces.length })
            : t("Your order has been successfully canceled"),
      });
    },
    onError: (error: any) => {
      toast({ title: t("Error"), description: getErrorMessage(error), status: "error" });
    },
  });

  return (
    <ConnectWalletGuard>
      <Button
        isLoading={isTxSending || isTxWaiting}
        onClick={submitTransaction}
        variant="outline"
        colorScheme="red"
        {...props}
      >
        {children || t("Cancel")}
      </Button>
    </ConnectWalletGuard>
  );
};
