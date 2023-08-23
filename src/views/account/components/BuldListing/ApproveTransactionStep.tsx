import { Divider, VStack } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { NFTCardCollection } from "types/graphql";
import { Step, StepStatusProps, Text } from "uikit";
import { ListingRow } from "./shared";

interface ApproveTransactionStepProps extends StepStatusProps {
  onSuccess?: () => void;
  onError?: () => void;
  collectionCount: number;
  approvedCollections: NFTCardCollection[];
  txPendingCollections: NFTCardCollection[];
  txNeedsConfirmationCollections: NFTCardCollection[];
  needsApprovalCollections: NFTCardCollection[];
  txDeclinedCollections: NFTCardCollection[];
}

export const ApproveTransactionStep: React.FC<ApproveTransactionStepProps> = ({
  title,
  collectionCount,
  approvedCollections,
  txPendingCollections,
  txNeedsConfirmationCollections,
  needsApprovalCollections,
  txDeclinedCollections,
  status,
  ...props
}) => {
  const { t } = useTranslation();
  return (
    <Step title={title} status={status} {...props}>
      <VStack spacing={2} alignItems="flex-start" divider={<Divider />}>
        <Text textStyle="helper" bold color="text-02">
          {t("{{remaining}} of {{total}} left", {
            remaining: collectionCount - approvedCollections.length,
            total: collectionCount,
          })}
        </Text>
        {!!approvedCollections.length && (
          <VStack spacing={2} alignItems="flex-start" width="100%">
            {approvedCollections.map((collection) => (
              <ListingRow key={collection.address} status="done" text={collection.name} />
            ))}
          </VStack>
        )}
        {!!txPendingCollections.length && (
          <VStack alignItems="flex-start" spacing={2} width="100%">
            <Text textStyle="helper" bold color="text-02">
              {t("Pending...")}
            </Text>
            {txPendingCollections.map((collection) => (
              <ListingRow key={collection.address} status="pending" text={collection.name} />
            ))}
          </VStack>
        )}
        {!!txNeedsConfirmationCollections.length && (
          <VStack alignItems="flex-start" spacing={2} width="100%">
            <Text textStyle="helper" bold color="text-02">
              {t("Waiting for you to confirm")}
            </Text>
            {txNeedsConfirmationCollections.map((collection) => (
              <ListingRow
                key={collection.address}
                status="pending"
                text={collection.name}
                textProps={{
                  bold: true,
                  color: "text-01",
                }}
              />
            ))}
          </VStack>
        )}
        {!!txDeclinedCollections.length && (
          <VStack alignItems="flex-start" spacing={2} width="100%">
            <Text textStyle="helper" bold color="text-error">
              {t("Transaction Declined")}
            </Text>

            {txDeclinedCollections.map((collection) => (
              <ListingRow
                key={collection.address}
                status="error"
                text={collection.name}
                textProps={{ bold: true, color: "text-01" }}
              />
            ))}
          </VStack>
        )}

        {!!needsApprovalCollections.length && (
          <VStack alignItems="flex-start" spacing={2} width="100%">
            {needsApprovalCollections.map((collection) => (
              <ListingRow key={collection.address} status="wait" text={collection.name} />
            ))}
          </VStack>
        )}
      </VStack>
    </Step>
  );
};
