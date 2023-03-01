// @ts-nocheck
import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { BigNumber, constants } from "ethers";
import { Divider, Grid, Box, Flex } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { Button, Text, ModalBody, ModalFooterGrid, EthIcon, WethIcon } from "uikit";
import { ModalProps } from "uikit/Modal/Modal"
import { formatToSignificant, toDecimals } from "utils/format";
import { numberInputErrorCheck, NumberInputErrorType } from "utils/numberInputErrorCheck";
import { addresses } from "config/addresses";
import { MINIMUM_STANDARD_OFFER } from "config/constants";
import { useWethBalance } from "hooks/useTokenBalance";
import { useEthBalance } from "hooks/useEthBalance";
import { useCollectionCreatorFee, useProtocolFee } from "hooks/useFees";
import { useDurationLabels } from "hooks/useDurationLabels";
import { ImageData } from "types/graphql";
import { MakerOrderWithSignatureAndHash } from "types/orders";
import { ConvertEthButton } from "components/Buttons/ConvertEthButton";
import { DurationPicker } from "components/DurationPicker/DurationPicker";
import TransactionView from "./TransactionView";
import ConfirmationView from "./ConfirmationView";
import {
  NftMeta,
  CurrencyInput,
  CurrencyCheckbox,
  UnverifiedWarningView,
  shouldSkipUnverifiedWarning,
} from "../shared";

export enum View {
  UNVERIFIED_WARNING,
  MAIN,
  TRANSACTION,
  CONFIRMATION,
}

export interface CreateSingleBidProps {
  tokenId: string;
  tokenName: string;
  tokenImage: ImageData;
  collectionAddress: string;
  collectionName: string;
  bids: MakerOrderWithSignatureAndHash[];
  ask?: MakerOrderWithSignatureAndHash;
  isVerified?: boolean;
  onClose: ModalProps["onClose"];
}

const minimumStandardOffer = BigNumber.from(MINIMUM_STANDARD_OFFER);

export const CreateSingleBid = ({
  tokenId,
  tokenName,
  tokenImage,
  collectionAddress,
  collectionName,
  bids,
  ask,
  isVerified,
  onClose,
}: CreateSingleBidProps) => {
  const { t } = useTranslation();
  const { account } = useWeb3React();
  const [highestBid] = bids;

  const skipWarning = shouldSkipUnverifiedWarning(collectionAddress);
  const showWarning = !isVerified && !skipWarning;

  const [viewIndex, setViewIndex] = useState(showWarning ? View.UNVERIFIED_WARNING : View.MAIN);
  const [price, setPrice] = useState("");

  const { getDefaultDurationOption } = useDurationLabels();
  const [endTimeMs, setEndTimeMs] = useState(new Date(getDefaultDurationOption().value).getTime());

  const ethBalanceQuery = useEthBalance(account!);
  const wethBalanceQuery = useWethBalance(account!);
  const creatorFeeQuery = useCollectionCreatorFee(collectionAddress);
  const protocolFeeQuery = useProtocolFee(addresses.STRATEGY_COLLECTION_SALE);

  const isLoadingDeps =
    ethBalanceQuery.isLoading || wethBalanceQuery.isLoading || creatorFeeQuery.isLoading || protocolFeeQuery.isLoading;

  const priceInWei = toDecimals(price === "" ? "0" : price);

  const inputError = numberInputErrorCheck(price, {
    max: wethBalanceQuery.isSuccess ? wethBalanceQuery.data : constants.Zero,
    min: minimumStandardOffer,
    errorMessages: {
      [NumberInputErrorType.BELOW_MIN]: t("You must offer a minimum amount of {{amount}} {{token}}", {
        amount: formatToSignificant(minimumStandardOffer, 6),
        token: "WETH",
      }),
      [NumberInputErrorType.ABOVE_MAX]: t("Insufficient {{token}} balance", { token: "WETH" }),
      [NumberInputErrorType.INVALID_INPUT]: t("Please enter a valid number"),
    },
  });

  const onConfirmTransaction = useCallback(() => setViewIndex(View.CONFIRMATION), []);

  if (viewIndex === View.UNVERIFIED_WARNING) {
    return (
      <UnverifiedWarningView
        collectionName={collectionName}
        collectionAddress={collectionAddress}
        onClose={onClose}
        onConfirm={() => setViewIndex(View.MAIN)}
      />
    );
  }

  if (viewIndex === View.TRANSACTION) {
    return (
      <TransactionView
        price={price}
        endTime={endTimeMs}
        collectionAddress={collectionAddress}
        tokenId={tokenId}
        onConfirm={onConfirmTransaction}
        creatorFee={creatorFeeQuery.data}
        protocolFee={protocolFeeQuery.data}
        tokenName={tokenName}
        tokenImage={tokenImage}
        collectionName={collectionName}
        isVerified={isVerified}
      />
    );
  }

  if (viewIndex === View.CONFIRMATION) {
    return (
      <ConfirmationView
        tokenName={tokenName}
        tokenImage={tokenImage}
        collectionName={collectionName}
        isVerified={isVerified}
        price={price}
        endTime={endTimeMs}
        onClose={onClose}
      />
    );
  }

  return (
    <>
      <Box p={4} bg="ui-bg">
        <NftMeta
          tokenName={tokenName}
          tokenImage={tokenImage}
          collectionName={collectionName}
          isVerified={isVerified}
        />
        <Box ml={16}>
          <Divider my={2} />
          {ask && (
            <Flex justifyContent="space-between" alignItems="center" mb={2}>
              <Text textStyle="detail" color="text-02">
                {t("Price")}
              </Text>
              <Text textStyle="detail" bold>
                <EthIcon boxSize={4} mr={0.5} />
                {formatToSignificant(ask.price, 6).toString()}
              </Text>
            </Flex>
          )}
          {highestBid && (
            <Flex justifyContent="space-between" mb={2}>
              <Text color="text-02" textStyle="detail">
                {t("Top Offer")}
              </Text>
              <Flex alignItems="center" justifyContent="flex-end">
                <WethIcon boxSize={4} mr={0.5} />
                <Text textStyle="detail" bold>
                  {`${formatToSignificant(highestBid.price, 6)} WETH`}
                </Text>
              </Flex>
            </Flex>
          )}
        </Box>
      </Box>

      <ModalBody>
        <CurrencyInput price={price} setPrice={setPrice} currency="WETH" warning={inputError?.message} autoFocus />
        <Divider my={4} />
        <Grid templateColumns="repeat(2, 1fr)" gridGap={2}>
          <Text color="text-02" gridRow="1 / span 2">
            {t("Offer with")}
          </Text>
          <CurrencyCheckbox isChecked currency="WETH" userBalance={wethBalanceQuery.data} />
        </Grid>
        <Text color="text-02">
          {t("Your ETH Balance:")} {ethBalanceQuery.isSuccess && formatToSignificant(ethBalanceQuery.data, 6)}
        </Text>
        <ConvertEthButton />

        <Divider my={4} />

        <Flex alignItems="center" mb={6}>
          <Text textStyle="helper" color="text-02" flex={1}>
            {t("Validity")}
          </Text>
          <DurationPicker onDateUpdate={setEndTimeMs} />
        </Flex>
      </ModalBody>

      <ModalFooterGrid>
        <Button tabIndex={1} variant="tall" colorScheme="gray" isFullWidth onClick={onClose}>
          {t("Cancel")}
        </Button>
        <Button
          tabIndex={2}
          variant="tall"
          isFullWidth
          isLoading={isLoadingDeps}
          disabled={priceInWei.eq(0) || inputError !== undefined}
          onClick={() => setViewIndex(View.TRANSACTION)}
        >
          {t("Make Offer")}
        </Button>
      </ModalFooterGrid>
    </>
  );
};
