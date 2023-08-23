// @ts-nocheck
import React, { useEffect, useState, useCallback } from "react";
import { Grid, Flex, Divider, ButtonGroup, Box } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { useTranslation } from "react-i18next";
import getUnixTime from "date-fns/getUnixTime";
import { BigNumber, constants, utils } from "ethers";
import {
  ModalFooter,
  ModalBody,
  Button,
  Text,
  Input,
  Switch,
  Popover,
  ExternalLink,
  TooltipText,
} from "uikit";
import { ModalProps } from "uikit/Modal/Modal"
import { STRATEGIES_ADDRESS } from "config/addresses";
import { MINIMUM_LISTING_PRICE } from "config/constants";
import { formatAddress, formatToSignificant, toDecimals } from "utils/format";
import { getFloorPricePercentDifference, getGlobalFloor } from "utils/floorPricePercentHelpers";
import { numberInputErrorCheck, NumberInputErrorType } from "utils/numberInputErrorCheck";
import { getExplorerLink } from "utils/chains";
import { validateErc1155PriceIsUnique } from "utils/tokens";
import { isFeeAboveWarningThreshold } from "utils/isFeeAboveWarningThreshold";
import { useProtocolFee } from "hooks/useFees";
import { useInvalidateToken, useInvalidateTokenOrders } from "hooks/graphql/tokens";
import { useCalculateCreatorFeePercentage } from "hooks/calls/fees";
import { useCheckOwner } from "hooks/calls/useCheckOwner";
import { useDurationLabels } from "hooks/useDurationLabels";
import { useOsListing } from "hooks/useOsListing";
import { TokenStandard } from "types/config";
import { CollectionFloor, ImageData } from "types/graphql";
import { SwitchButton } from "components/Buttons/SwitchButton";
import { CreatorFeePopover } from "components/Fees/CreatorFeePopover";
import { ProtocolFeePopover } from "components/Fees/ProtocolFeePopover";
import { DurationPicker } from "components/DurationPicker/DurationPicker";
import { NftMeta, CurrencyInput, ListingRewardPointDisplay, OsListingPriceRow } from "../shared";
import TransactionView from "./TransactionView";
import ConfirmationView from "./ConfirmationView";
import { ScheduleView } from "views/account/components/BuldListing/ScheduleView";
import FloorPriceWarningView from "./FloorPriceWarningView";
import InvalidOrderView from "../AcceptOrderModal/InvalidOrderView";

export enum View {
  MAIN,
  SCHEDULE,
  FLOOR_PRICE_WARNING,
  TRANSACTION,
  CONFIRMATION,
}

export interface BaseListForSaleProps {
  tokenId: string;
  tokenName: string;
  tokenImage: ImageData;
  collectionAddress: string;
  collectionName: string;
  collectionType: TokenStandard;
  collectionFloor: CollectionFloor;
  isVerified?: boolean;
  points: number | null;
  onClose: ModalProps["onClose"];
}

interface ListForSaleProps extends BaseListForSaleProps {
  setModalTitle: (newView: View) => void;
  onListingComplete?: () => void;
}

const minimumListingPrice = BigNumber.from(MINIMUM_LISTING_PRICE);
const now = getUnixTime(new Date());

export const ListForSale = ({
  tokenId,
  tokenName,
  tokenImage,
  collectionName,
  collectionAddress,
  collectionType,
  collectionFloor,
  isVerified,
  points,
  onClose,
  onListingComplete,
  setModalTitle,
}: ListForSaleProps) => {
  const { t } = useTranslation();
  const { account } = useWeb3React();
  const [viewIndex, setViewIndex] = useState(View.MAIN);
  const [price, setPrice] = useState("");
  const [privateBuyer, setPrivateBuyer] = useState("");
  const [fetchingMultipleAsks, setFetchingMultipleAsks] = useState(false);
  const [multipleAskWarning, setMultipleAskWarning] = useState(false);
  const [strategy, setStrategy] = useState(STRATEGIES_ADDRESS.standard);
  const isErc1155 = collectionType === "ERC1155";
  const { getDefaultDurationOption } = useDurationLabels();
  const [endTimeMs, setEndTimeMs] = useState(new Date(getDefaultDurationOption().value).getTime());

  const inputError = numberInputErrorCheck(price, {
    min: minimumListingPrice,
    errorMessages: {
      [NumberInputErrorType.BELOW_MIN]: t("You must list for a minimum of {{amount}} {{token}}", {
        amount: formatToSignificant(minimumListingPrice, 6),
        token: "ETH",
      }),
      [NumberInputErrorType.INVALID_INPUT]: t("Please enter a valid number"),
    },
  });

  const ownerCheckQuery = useCheckOwner({
    addressToCheck: account!,
    tokenId,
    collectionAddress,
    collectionType,
  });
  const protocolFeeQuery = useProtocolFee(strategy);
  const creatorFeeQuery = useCalculateCreatorFeePercentage(collectionAddress, tokenId);

  const creatorFee = creatorFeeQuery.isSuccess ? creatorFeeQuery.data : 0;
  const isFeeWarning = isFeeAboveWarningThreshold(creatorFee);
  const feeAsDecimal = creatorFee ? toDecimals(creatorFee.toFixed(2), 2) : constants.Zero;
  const { globalFloor } = getGlobalFloor(collectionFloor);

  const invalidateTokenQuery = useInvalidateToken(collectionAddress, tokenId);
  const invalidateTokenOrderQuery = useInvalidateTokenOrders(collectionAddress, tokenId);
  const { data, isFetching, isSuccess } = useOsListing(collectionAddress, tokenId, account, { enabled: !!account });

  const isPrivate = strategy === STRATEGIES_ADDRESS.private;
  const canBeListed =
    inputError === undefined &&
    !multipleAskWarning &&
    !fetchingMultipleAsks &&
    price !== "" &&
    (!isPrivate || (isPrivate && privateBuyer !== ""));

  const collectionFloorPrice = collectionFloor.floorPrice || constants.Zero;

  // Floor price warning conditions
  const { floorDiffPercentString, hasLowThresholdReached, hasHighThresholdReached } = getFloorPricePercentDifference(
    collectionFloorPrice,
    price && toDecimals(price)
  );

  const onConfirmTransaction = useCallback(() => {
    setViewIndex(View.CONFIRMATION);
    invalidateTokenQuery();
    invalidateTokenOrderQuery();
  }, [invalidateTokenQuery, invalidateTokenOrderQuery]);

  const handleClose = useCallback(() => {
    onClose();
    setViewIndex(View.MAIN);
  }, [onClose]);

  const handlePriceChange = async (inputPrice: string) => {
    setPrice(inputPrice);
    setMultipleAskWarning(false);
  };

  const handleSubmit = async () => {
    if (isErc1155) {
      setFetchingMultipleAsks(true);
      const listingWithPriceExists = await validateErc1155PriceIsUnique(
        price,
        collectionAddress,
        tokenId,
        now,
        account || ""
      );
      if (listingWithPriceExists) {
        setFetchingMultipleAsks(false);
        setMultipleAskWarning(true);
        return;
      }
    }
    setFetchingMultipleAsks(false);
    if (hasHighThresholdReached) {
      setViewIndex(View.FLOOR_PRICE_WARNING);
      return;
    }
    setViewIndex(View.TRANSACTION);
  };

  // Update modal title each time the view changes
  useEffect(() => {
    setModalTitle(viewIndex);
  }, [viewIndex, setModalTitle]);

  // Set default listing price to the one on OS
  useEffect(() => {
    if (isSuccess && data.price) {
      setPrice((prevPrice) => {
        if (data.price && !prevPrice) {
          return formatToSignificant(data.price, 4, { commify: false });
        }
        return prevPrice;
      });
    }
  }, [data, isSuccess, setPrice]);

  const isLoading = protocolFeeQuery.isLoading || creatorFeeQuery.isLoading || ownerCheckQuery.isLoading;

  if (ownerCheckQuery.isSuccess && !ownerCheckQuery.data.isOwner) {
    return (
      <InvalidOrderView onClose={onClose}>
        <Box>
          <Text textStyle="display-body" bold mb={4}>
            {t("Invalid Listing")}
          </Text>
          <Text color="text-02" textStyle="detail" mb={4}>
            {t("Sorry, it looks like you aren't the owner of this NFT. Make sure it's in your wallet and try again.")}
          </Text>
          {ownerCheckQuery.data.ownerAddress && (
            <ExternalLink
              mr={4}
              isTruncated
              textStyle="detail"
              href={getExplorerLink(ownerCheckQuery.data.ownerAddress, "address")}
            >
              {t("Current owner: {{address}}", { address: formatAddress(ownerCheckQuery.data.ownerAddress) })}
            </ExternalLink>
          )}
        </Box>
      </InvalidOrderView>
    );
  }

  if (viewIndex === View.SCHEDULE) {
    <ScheduleView onClose={handleClose} />;
  }

  if (viewIndex === View.FLOOR_PRICE_WARNING) {
    return (
      <FloorPriceWarningView
        floorDiffPercentString={floorDiffPercentString}
        priceInEth={price}
        collectionFloorPriceInEth={utils.formatEther(collectionFloorPrice)}
        onBack={() => {
          setViewIndex(View.MAIN);
        }}
        onContinue={() => {
          setViewIndex(View.TRANSACTION);
        }}
      />
    );
  }

  if (viewIndex === View.TRANSACTION) {
    return (
      <TransactionView
        tokenId={tokenId}
        collectionType={collectionType}
        collectionAddress={collectionAddress}
        price={price}
        endTime={endTimeMs}
        strategyAddress={strategy}
        protocolFees={protocolFeeQuery.isSuccess ? protocolFeeQuery.data : constants.Zero}
        creatorFees={feeAsDecimal}
        onClose={handleClose}
        onBack={() => {
          setViewIndex(View.MAIN);
        }}
        onConfirm={onConfirmTransaction}
        privateBuyer={privateBuyer}
        tokenName={tokenName}
        tokenImage={tokenImage}
        collectionName={collectionName}
        isVerified={isVerified}
        points={points}
        collectionFloor={collectionFloor}
      />
    );
  }

  if (viewIndex === View.CONFIRMATION) {
    return (
      <ConfirmationView
        tokenId={tokenId}
        tokenName={tokenName}
        tokenImage={tokenImage}
        collectionName={collectionName}
        collectionAddress={collectionAddress}
        isVerified={isVerified}
        price={price}
        endTime={endTimeMs}
        onClose={() => {
          handleClose();
          if (onListingComplete) {
            onListingComplete();
          }
        }}
      />
    );
  }

  // Main view for listing
  return (
    <>
      <Box p={4} bgColor="ui-bg">
        <NftMeta
          tokenName={tokenName}
          tokenImage={tokenImage}
          collectionName={collectionName}
          isVerified={isVerified}
          points={points}
          collectionFloor={collectionFloor}
        />
      </Box>
      <Flex p={4} justifyContent="space-between" alignItems="center" bgColor="ui-02">
        <Text mr={4}>{t("Sale Type")}</Text>
        <ButtonGroup isAttached>
          <SwitchButton isActive>{t("Fixed Price")}</SwitchButton>
          <Popover label={<TooltipText>{t("Coming Soon")}</TooltipText>}>
            <SwitchButton cursor="not-allowed">{t("Auction")}</SwitchButton>
          </Popover>
        </ButtonGroup>
      </Flex>
      <ModalBody pt={6}>
        <OsListingPriceRow priceInWei={data?.price} mb={4} />
        <Flex alignItems="center" justifyContent="space-between" mb={3}>
          <Text textStyle="detail" color="text-02">
            {t("Sale Price")}
          </Text>
          <ListingRewardPointDisplay points={points} globalFloor={globalFloor} priceInEth={price} />
        </Flex>
        <CurrencyInput
          price={price}
          setPrice={handlePriceChange}
          currency="ETH"
          warning={
            multipleAskWarning
              ? t("You’ve already got a listing for {{tokenName}} at this price", { tokenName })
              : inputError?.message
          }
          isDisabled={isFetching}
          autoFocus
        />
        {hasLowThresholdReached && (
          <Box mt={2}>
            <Text textStyle="helper" color="text-error">
              {t("{{floorDiff}}% lower than floor price", { floorDiff: floorDiffPercentString?.replace("-", "") })}
            </Text>
          </Box>
        )}
        <Divider my={4} />
        <Flex alignItems="center" mb={6}>
          <Text textStyle="helper" color="text-02" flex={1}>
            {t("Validity")}
          </Text>
          <DurationPicker onDateUpdate={setEndTimeMs} />
        </Flex>
        <Flex justifyContent="space-between" alignItems="center">
          <Text color="text-disabled">{t("Reserve for a specific buyer")}</Text>
          <Popover label={<TooltipText>{t("Coming Soon")}</TooltipText>}>
            <Box>
              <Switch
                isDisabled
                isChecked={isPrivate}
                onChange={(e) =>
                  setStrategy(e.target.checked ? STRATEGIES_ADDRESS.private : STRATEGIES_ADDRESS.standard)
                }
              />
            </Box>
          </Popover>
        </Flex>
        {isPrivate && <Input value={privateBuyer} onChange={(e) => setPrivateBuyer(e.target.value)} mt={3} />}
        <Divider my={4} />
        <Grid templateColumns="auto 1fr" templateRows="repeat(2, 1fr)" gridGap={2}>
          <Text gridRow="1 / span 2" color="text-02">
            {t("Fees")}
          </Text>
          <Text textAlign="right" color={isFeeWarning ? "text-warning" : "text-02"}>
            {t("Creator Royalties")}:{" "}
            <CreatorFeePopover
              display="inline-flex"
              fee={creatorFeeQuery.isLoading ? undefined : creatorFee}
              isWarning={isFeeWarning}
            />
          </Text>
          <Text textAlign="right" color="text-02">
            OpenEyes.nft: <ProtocolFeePopover color="text-02" display="inline-flex" fee={protocolFeeQuery.data} />
          </Text>
        </Grid>
      </ModalBody>

      <ModalFooter mt={8}>
        <Grid width="100%" templateColumns="repeat(2, 1fr)">
          <Button tabIndex={1} variant="tall" colorScheme="gray" onClick={handleClose}>
            {t("Cancel")}
          </Button>
          <Button
            isLoading={isLoading || fetchingMultipleAsks}
            tabIndex={2}
            variant="tall"
            disabled={!canBeListed}
            onClick={handleSubmit}
          >
            {t("List item")}
          </Button>
        </Grid>
      </ModalFooter>
    </>
  );
};
