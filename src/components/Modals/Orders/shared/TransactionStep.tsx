import { useRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import noop from "lodash/noop";
import { Flex, Divider, Box } from "@chakra-ui/react";
import { Button, Text, Step } from "uikit";
import { ExternalLink } from "uikit/Link/Link";
import { StepStatusProps } from "uikit/Step/Step";
import { useToast } from "hooks/useToast";
import { getExplorerLink } from "utils/chains";
import { formatAddress } from "utils/format";
import { getErrorMessage } from "utils/errors";

interface Props extends StepStatusProps {
  onSendRequest: () => Promise<void>;
  onSuccess?: () => void;
  onError?: () => void;
  message: string;
  /* Transaction can be set only if the request is an on chain request  */
  transaction?: string;
}

/**
 * Transaction step manage on chain transaction as well as API calls
 */
export const TransactionStep: React.FC<Props> = ({
  onSendRequest,
  onSuccess = noop,
  onError = noop,
  message,
  transaction,
  status,
  ...props
}) => {
  const { t } = useTranslation();
  const toast = useToast();
  const [error, setError] = useState(false);

  // None of the code in the handler requires outside data so we use useRef
  const handleRequest = useRef(async () => {
    setError(false);
    try {
      await onSendRequest();
      onSuccess();
    } catch (e) {
      onError();
      setError(true);
      console.error(e);
      toast({ title: t("Error"), description: getErrorMessage(e), status: "error" });
    }
  });

  useEffect(() => {
    if (status === "current") {
      handleRequest.current();
    }
  }, [handleRequest, status]);

  return (
    <Step status={status} {...props}>
      <Text textStyle="detail" color="text-02">
        {message}
      </Text>
      <Divider my={2} />
      <Flex justifyContent="space-between" alignItems="center">
        <Text textStyle="detail" color="text-02" alignSelf="start">
          {t("Status")}
        </Text>
        {error ? (
          <Box textAlign="right">
            <Text textStyle="detail" color="text-error">
              {t("Error")}
            </Text>
            <Button variant="ghost" size="xs" colorScheme="green" onClick={() => handleRequest.current()} px={0}>
              {t("Submit transaction again")}
            </Button>
          </Box>
        ) : (
          <Text textStyle="detail" color="text-01" bold>
            {transaction ? t("Pending Confirmation...") : t("Waiting for you to confirm")}
          </Text>
        )}
      </Flex>

      {transaction && (
        <Flex justifyContent="space-between" alignItems="center" mt={2}>
          <Text textStyle="detail" color="text-02">
            {t("Transaction")}
          </Text>
          <Text textStyle="detail" color="text-01">
            <ExternalLink href={getExplorerLink(transaction, "transaction")}>
              {formatAddress(transaction, 7, 4)}
            </ExternalLink>
          </Text>
        </Flex>
      )}
    </Step>
  );
};
