import { Box, Flex, Grid, IconButton, useBreakpointValue, VStack } from "@chakra-ui/react";
import { constants } from "ethers";
import { useTranslation } from "next-i18next";
import { NFTCard } from "types/graphql";
import { formatEther } from "ethers/lib/utils";
import { STRATEGIES_ADDRESS } from "config";
import { toDecimals } from "utils/format";
import { useMultiselect } from "components/Multiselect/hooks/useMultiselect";
import { getFloorPricePercentDifference } from "utils/floorPricePercentHelpers";
import { useProtocolFee } from "hooks/useFees";
import { useCalculateCreatorFeePercentage } from "hooks/calls/fees";
import { DeleteIcon, EthIcon, NumberInputProps, Text } from "uikit";
import { CombinedFeePopover } from "components/Fees";
import { ListingStage } from "views/account/BulkListingView";
import { InputWithIcon } from "./InputWithIcon";
import { ListingStatus, ListingStatusIcon } from "./shared";
import { BulkListingNftMeta } from "./BulkListingNftMeta";
import { GlobalFloorPopover } from "./GlobalFloorPopover";

interface BulkListingInputRowProps {
  nft: NFTCard;
  listingStage: ListingStage;
  inputValue: string;
  onChangeInputValue: NumberInputProps["onTextChange"];
  status: ListingStatus;
}

const gridTemplateColumns = "3fr 1fr 1fr minmax(120px, 2fr) 40px";

export const BulkListingInputRow = ({
  nft,
  inputValue,
  onChangeInputValue,
  listingStage,
  status,
}: BulkListingInputRowProps) => {
  const { t } = useTranslation();
  const { removeFromCart } = useMultiselect();

  const protocolFeeQuery = useProtocolFee(STRATEGIES_ADDRESS.standard);
  const creatorFeeQuery = useCalculateCreatorFeePercentage(nft.collection.address, nft.tokenId);
  const creatorFee = creatorFeeQuery.isSuccess ? creatorFeeQuery.data : 0;

  const feeAsDecimal = creatorFee ? toDecimals(creatorFee.toFixed(2), 2) : constants.Zero;
  const protocolFee = protocolFeeQuery?.data || constants.Zero;

  // @todo revisit floor values when BE is ready for OSFloor. pass osFloor to GlobalFloor component
  const looksFloor = !!nft.collection.floorOrder ? nft.collection.floorOrder.price : constants.Zero;
  const looksFloorEth = formatEther(looksFloor);
  const globalFloor = looksFloorEth;
  const { floorDiffPercentString, hasLowThresholdReached } = getFloorPricePercentDifference(
    looksFloor,
    inputValue && toDecimals(inputValue)
  );

  const isMdLayout = useBreakpointValue({ base: false, md: true });
  if (!isMdLayout) {
    // mobile layout
    return (
      <VStack
        spacing={4}
        py={6}
        width="100%"
        borderBottom="1px solid"
        borderBottomColor="border-01"
        alignItems="flex-start"
      >
        <Flex width="100%" justifyContent="space-between" gap={4}>
          <BulkListingNftMeta
            name={nft.name}
            imageSrc={nft.image.src}
            collectionAddress={nft.collection.address}
            collectionName={nft.collection.name}
            isVerified={nft.collection.isVerified}
            tokenId={nft.tokenId}
            totalSupply={nft.collection.totalSupply}
          />
          {/* Delete button / Status Icon */}
          {listingStage === ListingStage.SCHEDULE ? (
            <IconButton
              size="sm"
              variant="outline"
              colorScheme="secondary"
              onClick={() => removeFromCart(nft.collection.address, nft.tokenId)}
              aria-label={"Remove from cart"}
            >
              <DeleteIcon />
            </IconButton>
          ) : (
            <ListingStatusIcon status={status} />
          )}
        </Flex>
        <Box pl={14} width="100%">
          {/* Input / Price */}
          {listingStage === ListingStage.SCHEDULE ? (
            <VStack spacing={2} width="100%" alignItems="flex-start">
              <InputWithIcon onTextChange={onChangeInputValue} width="100%" inputProps={{ value: inputValue }} />
              {hasLowThresholdReached && (
                <Text textStyle="helper" color="text-error">
                  {t("{{floorDiff}}% lower than floor price", { floorDiff: floorDiffPercentString?.replace("-", "") })}
                </Text>
              )}
            </VStack>
          ) : (
            <Flex alignItems="center">
              <EthIcon boxSize={4} />
              <Text textStyle="detail" color="text-01" bold>
                {inputValue}
              </Text>
            </Flex>
          )}
        </Box>
        <Flex pl={14} width="100%">
          {/* @TODO revisit when OS floor is available */}
          <VStack spacing={1} alignItems="flex-start" flex={1}>
            <Text textStyle="helper" color="text-03">
              {t("Floor")}
            </Text>
            <GlobalFloorPopover looksFloorEth={looksFloorEth} globalFloor={globalFloor} />
          </VStack>
          <VStack spacing={1} alignItems="flex-start" flex={1}>
            <Text textStyle="helper" color="text-03">
              {t("Fees")}
            </Text>
            <CombinedFeePopover creatorFee={feeAsDecimal} protocolFee={protocolFee} />
          </VStack>
        </Flex>
      </VStack>
    );
  }

  return (
    <Grid
      gridTemplateColumns={gridTemplateColumns}
      gridColumnGap={4}
      py={6}
      width="100%"
      borderBottom="1px solid"
      borderBottomColor="border-01"
      alignItems="center"
    >
      <BulkListingNftMeta
        maxWidth="250px"
        name={nft.name}
        imageSrc={nft.image.src}
        collectionAddress={nft.collection.address}
        collectionName={nft.collection.name}
        isVerified={nft.collection.isVerified}
        tokenId={nft.tokenId}
        totalSupply={nft.collection.totalSupply}
      />

      {/* Floor column */}
      {/* @TODO revisit when OS floor is available */}
      <VStack spacing={1} alignItems="flex-start">
        <Text textStyle="helper" color="text-03">
          {t("Floor")}
        </Text>
        <GlobalFloorPopover looksFloorEth={looksFloorEth} globalFloor={globalFloor} />
      </VStack>

      {/* Fees column */}
      <VStack spacing={1} alignItems="flex-start">
        <Text textStyle="helper" color="text-03">
          {t("Fees")}
        </Text>
        <CombinedFeePopover creatorFee={feeAsDecimal} protocolFee={protocolFee} />
      </VStack>

      {/* Input / Price */}
      {listingStage === ListingStage.SCHEDULE ? (
        <VStack spacing={2} alignItems="flex-start" width="100%">
          <InputWithIcon onTextChange={onChangeInputValue} inputProps={{ value: inputValue }} width="100%" />
          {hasLowThresholdReached && (
            <Text textStyle="helper" color="text-error">
              {t("{{floorDiff}}% lower than floor price", { floorDiff: floorDiffPercentString?.replace("-", "") })}
            </Text>
          )}
        </VStack>
      ) : (
        <Flex alignItems="center">
          <EthIcon boxSize={4} />
          <Text textStyle="detail" color="text-01" bold>
            {inputValue}
          </Text>
        </Flex>
      )}

      {/* Delete button / Status Icon */}
      {listingStage === ListingStage.SCHEDULE ? (
        <IconButton
          size="sm"
          variant="outline"
          colorScheme="secondary"
          onClick={() => removeFromCart(nft.collection.address, nft.tokenId)}
          aria-label={"Remove from cart"}
        >
          <DeleteIcon />
        </IconButton>
      ) : (
        <ListingStatusIcon status={status} />
      )}
    </Grid>
  );
};
