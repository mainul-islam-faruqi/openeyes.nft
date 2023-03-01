// import { useState } from "react";
// import { useTranslation } from "react-i18next";
// import { useWeb3React } from "@web3-react/core";
// import { Divider, Box, IconButton, useBoolean, useDisclosure } from "@chakra-ui/react";
// import { ModalBody, Modal, ModalFooterGrid, Button, DoubleArrowIcon, Text } from "uikit";
// import { useEthBalance } from "hooks/useEthBalance";
// import { useInvalidateTokenBalance, useWethBalance } from "hooks/useTokenBalance";
// import { useSubmitTransaction } from "hooks/useSubmitTransaction";
// import { useToast } from "hooks/useToast";
// import { deposit, withdraw } from "utils/calls/weth";
// import { getErrorMessage } from "utils/errors";
// import { toDecimals, fromDecimals } from "utils/format";
// import { ConfirmInWalletModal } from "../ConfirmInWalletModal";
// import { CurrencyInput } from "../Orders/shared";





import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useWeb3React } from "@web3-react/core";
import { Divider, Box, IconButton, useBoolean, useDisclosure } from "@chakra-ui/react";
import ModalBody from "uikit/Modal/ModalBody";
import Modal from "uikit/Modal/Modal";
import { ModalFooterGrid } from "uikit/Modal/ModalFooterGrid";
import { Button } from "uikit/Button/Button";
import { DoubleArrowIcon } from "uikit";
import { Text } from "uikit/Text/Text";
import { useEthBalance } from "hooks/useEthBalance";
import { useInvalidateTokenBalance, useWethBalance } from "hooks/useTokenBalance";
import { useSubmitTransaction } from "hooks/useSubmitTransaction";
import { useToast } from "hooks/useToast";
import { deposit, withdraw } from "utils/calls/weth";
import { getErrorMessage } from "utils/errors";
import { toDecimals, fromDecimals } from "utils/format";
import { ConfirmInWalletModal } from "../ConfirmInWalletModal/ConfirmInWalletModal";
import { CurrencyInput } from "../Orders/shared";




interface ModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  account: string;
}

// Buffer to keep some eth to pay gas
const MIN_ETH_BALANCE = toDecimals("0.01");

export const ConvertEthModal: React.FC<ModalWrapperProps> = ({ isOpen, onClose, account }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const { library } = useWeb3React();
  const transactionDisclosure = useDisclosure();
  const [isDeposit, setIsDeposit] = useBoolean(true);
  const [amount, setAmount] = useState("");

  const { data: ethBalanceWei } = useEthBalance(account, { enabled: isOpen });
  const { data: wethBalanceWei } = useWethBalance(account, { enabled: isOpen });
  const invalidateTokenBalance = useInvalidateTokenBalance();

  const balanceWei = isDeposit ? ethBalanceWei : wethBalanceWei;
  const balance = balanceWei ? fromDecimals(balanceWei) : null;
  const amountInWei = amount !== "" ? toDecimals(amount) : null;

  const canConvert = amountInWei && balanceWei && amountInWei.lte(balanceWei) && amountInWei.gt(0);

  const { submitTransaction, isTxConfirmed, isTxError, isTxSending, isTxWaiting, txResponse } = useSubmitTransaction({
    onSend: async () => {
      const transaction = isDeposit
        ? await deposit(library, account, amountInWei!)
        : await withdraw(library, account, amountInWei!);
      return transaction;
    },
    onSuccess: () => {
      invalidateTokenBalance();
      transactionDisclosure.onClose();
      toast({
        title: t("Converted!"),
        description: t("Your WETH/ETH conversion was successful"),
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

  const handleMax = async () => {
    if (balance && balanceWei) {
      if (isDeposit) {
        const estimatedMaxAmount = balanceWei.sub(MIN_ETH_BALANCE);
        setAmount(fromDecimals(estimatedMaxAmount));
      } else {
        setAmount(balance);
      }
    }
  };

  const handleSubmit = () => {
    onClose();
    transactionDisclosure.onOpen();
    submitTransaction();
  };

  return (
    <>
      <ConfirmInWalletModal
        onRetry={submitTransaction}
        isOpen={transactionDisclosure.isOpen}
        onClose={transactionDisclosure.onClose}
        isTxConfirmed={isTxConfirmed}
        isTxSending={isTxSending}
        isTxWaiting={isTxWaiting}
        isTxError={isTxError}
        txResponse={txResponse || undefined}
      />
      <Modal size="sm" isOpen={isOpen} onClose={onClose} showCloseButton title={t("Convert ETH/WETH")}>
        <ModalBody borderTopWidth="1px" borderTopColor="border-01" flexDirection="column" py={12}>
          <Text color="text-02" textStyle="detail" mb={4}>
            {t("Convert from")}
          </Text>
          <CurrencyInput
            price={amount}
            setPrice={setAmount}
            onMax={handleMax}
            currency={isDeposit ? "ETH" : "WETH"}
            autoFocus
            info={t("Balance: {{amount}}", { amount: balance })}
            warning={balanceWei && amountInWei?.gt(balanceWei) ? t("Insufficient Balance") : undefined}
          />

          <Box position="relative" my={10}>
            <Divider />
            <IconButton
              onClick={setIsDeposit.toggle}
              colorScheme="gray"
              isRound
              aria-label="Switch currency"
              border="solid 1px"
              borderColor="currentcolor"
              position="absolute"
              right={0}
              top={-6}
              mr={4}
            >
              <DoubleArrowIcon boxSize={6} />
            </IconButton>
          </Box>

          <Text color="text-02" textStyle="detail" mb={4}>
            {t("Convert to")}
          </Text>
          <CurrencyInput price={amount} setPrice={setAmount} currency={isDeposit ? "WETH" : "ETH"} isReadOnly />

          <Text color="text-03" textStyle="detail" mt={4}>
            {t("Rate: 1 ETH = 1 WETH")}
          </Text>
          <Text color="text-03" textStyle="detail">
            {t("Platform Fees: 0")}
          </Text>
        </ModalBody>
        <ModalFooterGrid>
          <Button tabIndex={1} variant="tall" colorScheme="gray" isFullWidth onClick={onClose}>
            {t("Close")}
          </Button>
          <Button tabIndex={2} variant="tall" disabled={!canConvert} onClick={handleSubmit}>
            {t("Convert")}
          </Button>
        </ModalFooterGrid>
      </Modal>
    </>
  );
};
