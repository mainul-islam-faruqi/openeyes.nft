import { useState } from "react";
import { useTranslation } from "next-i18next";
import { Box, BoxProps, Flex, VStack } from "@chakra-ui/react";
import { InputValues, getTokenKey } from "./hooks/multiInput";
import { StatusMap, TokenState } from "./hooks/listAllInSequence";
import { Text } from "uikit";
import { useMultiselect } from "components/Multiselect/hooks/useMultiselect";
import { ListingStage } from "views/account/BulkListingView";
import { BulkListingInputRow } from "./BulkListingInputRow";
import { InputWithIcon } from "./InputWithIcon";
import { ListingStatus } from "./shared";
import { parseInputToSafeDecimals } from "utils/guards";

interface BulkListingInputTableProps extends BoxProps {
  inputValues: InputValues;
  listingStage: ListingStage;
  tokenStatusMap: StatusMap;
  setValueForAll: (val: string) => void;
  setValueForKey: (key: string, val: string) => void;
}

// map the hook's state to the icon's ListingStatus
const iconStatusMap: Record<TokenState, ListingStatus> = {
  needsListing: "wait",
  needsSigning: "pending",
  declined: "error",
  listed: "done",
  skipped: "error",
};

export const BulkListingInputTable = ({
  inputValues,
  listingStage,
  tokenStatusMap,
  setValueForAll,
  setValueForKey,
  ...props
}: BulkListingInputTableProps) => {
  const { t } = useTranslation();
  const { selectedItems } = useMultiselect();
  const [priceForAllInput, setPriceForAllInput] = useState("");

  return (
    <Box {...props}>
      {listingStage === ListingStage.SCHEDULE && (
        <Flex
          justifyContent="space-between"
          alignItems={{ base: "flex-start", md: "center" }}
          flexDirection={{ base: "column", md: "row" }}
          gap={2}
        >
          <Text textStyle="heading-04" color="text-02" bold mb={{ base: 4, md: 0 }} whiteSpace="nowrap">
            {t("Set Prices")}
          </Text>
          <Flex p={4} bg="ui-01" borderRadius="8px" alignItems="center">
            <Text textStyle="detail" color="text-02" mr={4}>
              {t("Set Price for All")}:
            </Text>
            <InputWithIcon
              onTextChange={(value) => {
                const safeValue = parseInputToSafeDecimals(value);
                setPriceForAllInput(safeValue);
                setValueForAll(safeValue);
              }}
              inputProps={{
                value: priceForAllInput,
                height: "40px",
              }}
            />
          </Flex>
        </Flex>
      )}

      <VStack spacing={0}>
        {selectedItems.map((nft) => {
          const inputKey = getTokenKey(nft.collection.address, nft.tokenId);
          const status = iconStatusMap[tokenStatusMap[inputKey]];
          return (
            <BulkListingInputRow
              listingStage={listingStage}
              key={`${nft.collection.address}-${nft.tokenId}`}
              nft={nft}
              onChangeInputValue={(val) => {
                const safeValue = parseInputToSafeDecimals(val);
                setValueForKey(inputKey, safeValue);
              }}
              inputValue={inputValues[inputKey]}
              status={status}
            />
          );
        })}
      </VStack>
    </Box>
  );
};
