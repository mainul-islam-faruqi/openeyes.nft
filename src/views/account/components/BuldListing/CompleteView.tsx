import { Button, Divider, VStack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { Text } from "uikit";
import { Trans } from "next-i18next";
import { AddWethToWalletButton } from "components/Buttons";

interface CompleteViewProps {
  onClickBackToItems: () => void;
}

export const CompleteView: React.FC<CompleteViewProps> = ({ onClickBackToItems }) => {
  const { t } = useTranslation();
  return (
    <VStack spacing={2} alignItems="flex-start">
      <Text color="text-02" textStyle="heading-04" bold>
        {t("Listing Complete")}
      </Text>
      <Divider />
      <Trans i18nKey="translateBulkListingSuccessWeth">
        <Text color="text-02" textStyle="detail">
          You’ll receive your payment in{" "}
          <Text bold as="span" color="text-error">
            WETH
          </Text>
          , not{" "}
          <Text bold as="span">
            ETH
          </Text>{" "}
          if someone buys your items.
        </Text>
      </Trans>
      <AddWethToWalletButton />
      <Button variant="secondary" isFullWidth onClick={onClickBackToItems} size="sm">
        {t("Back to Your Items")}
      </Button>
    </VStack>
  );
};
