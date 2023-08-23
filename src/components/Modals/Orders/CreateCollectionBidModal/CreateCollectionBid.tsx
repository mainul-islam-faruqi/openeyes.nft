import { useState, useCallback } from "react";
import { Divider, Grid, Box, Flex } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { BigNumber, BigNumberish } from "ethers";
import { Button, Text, ModalBody, ModalFooterGrid, EthIcon } from "uikit";
import { useTranslation } from "react-i18next";
import { useWethBalance } from "hooks/useTokenBalance";
import { useEthBalance } from "hooks/useEthBalance";
import { formatToSignificant, toDecimals } from "utils/format";
import { numberInputErrorCheck, NumberInputErrorType } from "utils/numberInputErrorCheck";
import { MINIMUM_COLLECTION_OFFER } from "config/constants";
import { useDurationLabels } from "hooks/useDurationLabels";
import { ConvertEthButton } from "components/Buttons/ConvertEthButton";
import { DurationPicker } from "components/DurationPicker/DurationPicker";
import {
  CollectionMeta,
  CurrencyInput,
  CurrencyCheckbox,
  shouldSkipUnverifiedWarning,
  UnverifiedWarningView,
} from "../shared";
import TransactionView from "./TransactionView";
import ConfirmationView from "./ConfirmationView";

enum View {
  UNVERIFIED_WARNING,
  MAIN,
  TRANSACTION,
  CONFIRMATION,
}

interface CreateCollectionBidProps {
  collectionAddress: string;
  collectionName: string;
  collectionFloorOrder?: { price: BigNumberish };
  isVerified?: boolean;
  onClose: () => void;
  isOpen: boolean;
}

const minimumCollectionOffer = BigNumber.from(MINIMUM_COLLECTION_OFFER);

const CreateCollectionBid = ({
  collectionAddress,
  collectionName,
  collectionFloorOrder,
  isVerified,
  isOpen,
  onClose,
}: CreateCollectionBidProps) => {
  const { t } = useTranslation();
  const { account } = useWeb3React();

  const skipWarning = shouldSkipUnverifiedWarning(collectionAddress);
  const showWarning = !isVerified && !skipWarning;

  const [viewIndex, setViewIndex] = useState(showWarning ? View.UNVERIFIED_WARNING : View.MAIN);
  const [price, setPrice] = useState("");

  const { getDefaultDurationOption } = useDurationLabels();
  const [endTimeMs, setEndTimeMs] = useState(new Date(getDefaultDurationOption().value).getTime());

  const ethBalanceQuery = useEthBalance(account!, { enabled: isOpen });
  const wethBalanceQuery = useWethBalance(account!, { enabled: isOpen });
  const priceInWei = toDecimals(price === "" ? "0" : price);

  const inputError = numberInputErrorCheck(price, {
    max: wethBalanceQuery.data,
    min: minimumCollectionOffer,
    errorMessages: {
      [NumberInputErrorType.BELOW_MIN]: t("You must offer a minimum amount of {{amount}} {{token}}", {
        amount: formatToSignificant(minimumCollectionOffer, 3),
        token: "WETH",
      }),
      [NumberInputErrorType.ABOVE_MAX]: t("Insufficient {{token}} balance", { token: "WETH" }),
      [NumberInputErrorType.INVALID_INPUT]: t("Please enter a valid number"),
    },
  });

  const onConfirmTransaction = () => setViewIndex(View.CONFIRMATION);

  const handleClose = useCallback(() => {
    onClose();
    setViewIndex(showWarning ? View.UNVERIFIED_WARNING : View.MAIN);
  }, [showWarning, onClose]);

  const renderModal = () => {
    const isLoading = ethBalanceQuery.isLoading || wethBalanceQuery.isLoading;

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
          collectionName={collectionName}
          onConfirm={onConfirmTransaction}
        />
      );
    }
    if (viewIndex === View.CONFIRMATION) {
      return (
        <ConfirmationView
          collectionName={collectionName}
          collectionAddress={collectionAddress}
          price={price}
          endTime={endTimeMs}
          onClose={handleClose}
        />
      );
    }
    return (
      <>
        <ModalBody bg="ui-bg">
          <CollectionMeta
            collectionAddress={collectionAddress}
            collectionName={collectionName}
            isVerified={isVerified}
          />
          <Box ml={16}>
            <Divider my={2} />

            <Flex justifyContent="space-between" alignItems="center">
              <Text color="text-02" textStyle="detail">
                {t("Collection floor")}
              </Text>
              <Flex alignItems="center">
                <EthIcon boxSize={4} mr={0.5} />
                <Text textStyle="detail" bold>
                  {collectionFloorOrder ? formatToSignificant(collectionFloorOrder.price, 6) : "-"}
                </Text>
              </Flex>
            </Flex>
          </Box>
        </ModalBody>

        <ModalBody>
          <Text bold mb={4}>
            {t(
              "You’re making an offer on any item in this collection. It's valid for only one NFT purchase, and it'll expire after someone accepts it."
            )}
          </Text>
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
          <Button tabIndex={1} variant="tall" colorScheme="gray" isFullWidth onClick={handleClose}>
            {t("Cancel")}
          </Button>
          <Button
            tabIndex={2}
            variant="tall"
            isFullWidth
            isLoading={isLoading}
            disabled={priceInWei.isZero() || inputError !== undefined}
            onClick={() => setViewIndex(View.TRANSACTION)}
          >
            {t("Make Offer")}
          </Button>
        </ModalFooterGrid>
      </>
    );
  };

  return renderModal();
};

export default CreateCollectionBid;
