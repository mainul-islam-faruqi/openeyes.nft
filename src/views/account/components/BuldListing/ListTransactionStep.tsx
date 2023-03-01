import { Divider, VStack } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { NFTCard } from "types/graphql";
import { Step, StepStatusProps, Text } from "uikit";
import { getTokenKey } from "./hooks/listAllInSequence";
import { ListingRow } from "./shared";

interface ListTransactionStepProps extends StepStatusProps {
  onSuccess?: () => void;
  onError?: () => void;
  selectedItemsCount: number;
  needsListingTokens: NFTCard[];
  needsSigningTokens: NFTCard[];
  declinedTokens: NFTCard[];
  listedTokens: NFTCard[];
  skippedTokens: NFTCard[];
}

export const ListTransactionStep: React.FC<ListTransactionStepProps> = ({
  title,
  selectedItemsCount,
  status,
  needsListingTokens,
  needsSigningTokens,
  declinedTokens,
  listedTokens,
  skippedTokens,
  ...props
}) => {
  const { t } = useTranslation();
  return (
    <Step title={title} status={status} {...props}>
      <VStack spacing={2} alignItems="flex-start" divider={<Divider />}>
        <Text textStyle="helper" bold color="text-02">
          {t("{{remaining}} of {{total}} left", {
            remaining: selectedItemsCount - listedTokens.length - skippedTokens.length,
            total: selectedItemsCount,
          })}
        </Text>
        {!!(listedTokens.length || skippedTokens.length) && (
          <VStack spacing={2} alignItems="flex-start" width="100%">
            {listedTokens.map((nft) => (
              <ListingRow key={getTokenKey(nft)} status="done" text={nft.name} />
            ))}
            {skippedTokens.map((nft) => (
              <ListingRow key={getTokenKey(nft)} status="skipped" text={nft.name} />
            ))}
          </VStack>
        )}
        {!!needsSigningTokens.length && (
          <VStack alignItems="flex-start" spacing={2} width="100%">
            <Text textStyle="helper" bold color="text-02">
              {t("Pending")}
            </Text>
            {needsSigningTokens.map((nft) => (
              <ListingRow
                key={getTokenKey(nft)}
                status="pending"
                text={nft.name}
                textProps={{
                  bold: true,
                  color: "text-01",
                }}
              />
            ))}
          </VStack>
        )}
        {!!declinedTokens.length && (
          <VStack alignItems="flex-start" spacing={2} width="100%">
            <Text textStyle="helper" bold color="text-error">
              {t("Transaction Declined")}
            </Text>

            {declinedTokens.map((nft) => (
              <ListingRow
                key={getTokenKey(nft)}
                status="error"
                text={nft.name}
                textProps={{ bold: true, color: "text-01" }}
              />
            ))}
          </VStack>
        )}

        {!!needsListingTokens.length && (
          <VStack alignItems="flex-start" spacing={2} width="100%">
            {needsListingTokens.map((nft) => (
              <ListingRow key={getTokenKey(nft)} status="wait" text={nft.name} />
            ))}
          </VStack>
        )}
      </VStack>
    </Step>
  );
};
