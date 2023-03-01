import { Divider, Flex, VStack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { Button, Text, WarningIcon } from "uikit";
import { useMultiselect } from "components/Multiselect/hooks/useMultiselect";
import { DurationPicker } from "components/DurationPicker";

interface ScheduleViewProps {
  isPriceValid: boolean;
  lowPriceWarning: boolean;
  setEndTimeMs: (ms: number) => void;
  onStartListing: () => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  lowPriceWarning,
  isPriceValid,
  setEndTimeMs,
  onStartListing,
}) => {
  const { t } = useTranslation();
  const { getUniqueCollections, selectedItems } = useMultiselect();
  const numCollectionsSelected = getUniqueCollections().length;

  const buttonText = (() => {
    if (!isPriceValid) {
      return t("Set Price for All");
    }
    if (lowPriceWarning) {
      return t("List Anyway");
    }
    return t("Start Listing");
  })();

  return (
    <>
      <VStack spacing={4} pb={6} width="100%" sx={{ "> *": { width: "100%" } }}>
        <Text color="text-02" textStyle="heading-04" bold>
          {t("Listing Summary")}
        </Text>
        {!isPriceValid && (
          <Text color="text-03" textStyle="helper">
            {t("Input valid prices for all the items you want to sell")}
          </Text>
        )}
        <Divider />
        <Text textStyle="detail" color="text-02">
          {t("Listing {{numListed}} from {{numCollections}}", {
            numListed: `${selectedItems.length} ${selectedItems.length > 1 ? "items" : "item"}`,
            numCollections: `${numCollectionsSelected} ${numCollectionsSelected > 1 ? "collections" : "collection"}`,
          })}
        </Text>
        <Flex justifyContent="space-between" alignItems="center">
          <Text textStyle="detail" color="text-02">
            {t("Validity")}
          </Text>
          <DurationPicker onDateUpdate={setEndTimeMs} width="185px" minWidth="185px" />
        </Flex>
      </VStack>
      {lowPriceWarning && (
        <Flex mb={4}>
          <WarningIcon color="support-warning" mr={4} />
          <Text color="text-02" textStyle="detail">
            {t(
              "The price you've input for one of more listings is significantly lower than the price of any other NFT from this collection on LooksRare. List anyway?"
            )}
          </Text>
        </Flex>
      )}
      <Button
        disabled={!isPriceValid}
        variant={lowPriceWarning ? "secondary" : "primary"}
        isFullWidth
        onClick={onStartListing}
        size="sm"
      >
        {buttonText}
      </Button>
    </>
  );
};
