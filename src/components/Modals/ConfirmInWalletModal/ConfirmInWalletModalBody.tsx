// import { ReactNode } from "react";
// import { Box, Flex, Spinner, Divider } from "@chakra-ui/react";
// import { TransactionResponse } from "@ethersproject/abstract-provider";
// import { useTranslation } from "react-i18next";
// import { CheckmarkOutlineIcon, ModalBody, ModalProps, Text, Button, MisuseAltIcon, ExternalLink } from "uikit";
// import { TextButton } from "components/Buttons";
// import { getExplorerLink } from "utils/chains";
// import { formatAddress } from "utils/format";






import { ReactNode } from "react";
import { Box, Flex, Spinner, Divider } from "@chakra-ui/react";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import { useTranslation } from "react-i18next";
import { CheckmarkOutlineIcon, MisuseAltIcon } from "uikit";
import ModalBody from "uikit/Modal/ModalBody";
import { ModalProps } from "uikit/Modal/Modal";
import { Text } from "uikit/Text/Text";
import { Button } from "uikit/Button/Button";
import { ExternalLink } from "uikit/Link/Link";
import { TextButton } from "../../Buttons/TextButton";
import { getExplorerLink } from "utils/chains";
import { formatAddress } from "utils/format";






export interface ConfirmInWalletModalBodyProps {
  onClose: ModalProps["onClose"];
  onRetry?: () => void;
  txConfirmedTitle?: string;
  txConfirmedText?: string;
  actionText?: string;
  actionHandler?: () => void;
  bodyMetaComponent?: ReactNode;
  isTxConfirmed?: boolean;
  isTxSending?: boolean;
  isTxWaiting?: boolean;
  isTxError?: boolean;
  txResponse?: TransactionResponse;
}

export const ConfirmInWalletModalBody = ({
  onClose,
  onRetry,
  txConfirmedTitle,
  txConfirmedText,
  actionText,
  actionHandler,
  bodyMetaComponent,
  isTxConfirmed,
  isTxSending,
  isTxWaiting,
  isTxError,
  txResponse,
}: ConfirmInWalletModalBodyProps) => {
  const { t } = useTranslation();
  const confirmTitle = txConfirmedTitle || t("Confirmed");
  const confirmText = txConfirmedText || t("Confirm the transaction in your wallet.");

  const getStatusText = () => {
    if (isTxError) {
      return (
        <Text textStyle="detail" textAlign="right" color="text-error" bold>
          {t("You declined the transaction")}
        </Text>
      );
    }

    if (isTxWaiting) {
      return (
        <Text textStyle="detail" textAlign="right" bold>
          {t("Pending Confirmation...")}
        </Text>
      );
    }

    if (isTxSending) {
      return (
        <Text textStyle="detail" textAlign="right" bold>
          {t("Waiting for you to confirm")}
        </Text>
      );
    }

    return null;
  };

  const getIcon = () => {
    if (isTxError) {
      return <MisuseAltIcon boxSize={12} color="text-error" />;
    }

    if (isTxConfirmed) {
      return <CheckmarkOutlineIcon boxSize={12} color="link-01" />;
    }

    return <Spinner color="link-01" size="xl" />;
  };

  return (
    <>
      {bodyMetaComponent}
      <ModalBody>
        <Flex alignItems="center" height={14} mb={6}>
          {getIcon()}
        </Flex>
        <Text as="h3" textStyle="display-body" bold mb={4}>
          {isTxConfirmed ? confirmTitle : t("Confirm in Wallet")}
        </Text>
        <Text as="p" color="text-02" mb={6}>
          {isTxConfirmed ? confirmText : t("Confirm the transaction in your wallet.")}
        </Text>
      </ModalBody>
      {isTxConfirmed ? (
        <Flex justifyContent="end">
          <Button variant="tall" colorScheme="gray" onClick={onClose} width="50%" autoFocus>
            {t("Close")}
          </Button>
          {actionHandler && actionText && (
            <Button variant="tall" onClick={actionHandler} width="50%">
              {actionText}
            </Button>
          )}
        </Flex>
      ) : (
        <>
          <Divider />
          <Box p={4}>
            <Flex justifyContent="space-between">
              <Text color="text-02" textStyle="detail">
                {t("Status")}
              </Text>
              <Box textAlign="right">
                {getStatusText()}
                {isTxError && onRetry && (
                  <TextButton variant="ghost" size="xs" onClick={onRetry} autoFocus>
                    {t("Submit transaction again")}
                  </TextButton>
                )}
              </Box>
            </Flex>
            {txResponse && (
              <Flex justifyContent="space-between" alignItems="center" mt={2}>
                <Text textStyle="detail" color="text-02">
                  {t("Transaction")}
                </Text>
                <Text textStyle="detail" color="text-01">
                  <ExternalLink href={getExplorerLink(txResponse.hash, "transaction")}>
                    {formatAddress(txResponse.hash, 7, 4)}
                  </ExternalLink>
                </Text>
              </Flex>
            )}
          </Box>
        </>
      )}
    </>
  );
};
