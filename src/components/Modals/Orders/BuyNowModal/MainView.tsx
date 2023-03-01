import React from "react";
import { useTranslation } from "react-i18next";
import { Divider, Grid, Box, Flex } from "@chakra-ui/react";
import { BigNumber } from "ethers";
import { Button, Text, ModalBody, ModalFooterGrid, EthIcon } from "uikit";
import { formatToSignificant, formatUsd } from "utils/format";
import { ImageData } from "types/graphql";
import { MakerOrderWithSignatureAndHash } from "types/orders";
import { useCoinPrices } from "hooks/useCoinPrices";
import { NftMeta, CurrencyCheckbox, PaymentBreakdown } from "../shared";

interface Props {
  tokenName: string;
  tokenImage: ImageData;
  collectionName: string;
  isVerified?: boolean;
  ask: MakerOrderWithSignatureAndHash;
  onConfirm: () => void;
  onClose: () => void;
  isUsingEth: boolean;
  setIsUsingEth: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  isUsingWeth: boolean;
  setIsUsingWeth: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  ethBalance: BigNumber;
  wethBalance: BigNumber;
  wethBalanceUsed: BigNumber;
  ethBalanceUsed: BigNumber;
}

const MainView: React.FC<Props> = ({
  tokenName,
  tokenImage,
  collectionName,
  isVerified,
  ask,
  onConfirm,
  onClose,
  isUsingEth,
  setIsUsingEth,
  isUsingWeth,
  setIsUsingWeth,
  ethBalance,
  wethBalance,
  wethBalanceUsed,
  ethBalanceUsed,
}) => {
  const { t } = useTranslation();

  const coinPriceQuery = useCoinPrices();
  const nftPriceInWei = BigNumber.from(ask?.price || 0);
  const nftPriceInEth = formatToSignificant(nftPriceInWei, 6);

  const canProceed = () => {
    if (!ethBalance || !wethBalance) {
      return false;
    }

    if (isUsingEth && isUsingWeth) {
      return ethBalance.add(wethBalance).gt(nftPriceInWei);
    }

    if (isUsingEth && !isUsingWeth) {
      return ethBalance.gt(nftPriceInWei);
    }

    if (!isUsingEth && isUsingWeth) {
      return wethBalance.gt(nftPriceInWei);
    }

    return false;
  };

  return (
    <>
      <ModalBody bg="ui-bg">
        <NftMeta
          tokenName={tokenName}
          tokenImage={tokenImage}
          collectionName={collectionName}
          isVerified={isVerified}
        />
        <Box ml={16}>
          <Divider my={2} />
          <Flex justifyContent="space-between" alignItems="center" mb={2}>
            <Text color="text-02">{t("Price")}</Text>
            <Text bold>
              <EthIcon mr={1} />
              {nftPriceInEth}
            </Text>
          </Flex>
          <Flex justifyContent="end">
            <Text color="text-02">
              {coinPriceQuery.isSuccess ? formatUsd(parseFloat(nftPriceInEth) * coinPriceQuery.data.eth) : null}
            </Text>
          </Flex>
        </Box>
      </ModalBody>
      <ModalBody>
        <Grid templateColumns="repeat(2, 1fr)" templateRows="repeat(2, 1fr)" gridGap={2}>
          <Text color="text-02" gridRow="1 / span 2">
            {t("Pay with")}
          </Text>
          <CurrencyCheckbox
            isChecked={isUsingWeth}
            onCheck={setIsUsingWeth}
            currency="WETH"
            userBalance={wethBalance}
          />
          <CurrencyCheckbox isChecked={isUsingEth} onCheck={setIsUsingEth} currency="ETH" userBalance={ethBalance} />
        </Grid>
        {wethBalance.add(ethBalance).lt(nftPriceInWei) && (
          <Text textStyle="detail" color="text-error" mt={4}>
            {t("Insufficient balance")}
          </Text>
        )}
        <Divider my={4} />
        <PaymentBreakdown
          nftPriceInWei={nftPriceInWei}
          isUsingEth={isUsingEth}
          isUsingWeth={isUsingWeth}
          wethBalanceUsed={wethBalanceUsed}
          ethBalanceUsed={ethBalanceUsed}
        />
      </ModalBody>

      <ModalFooterGrid>
        <Button tabIndex={1} variant="tall" colorScheme="gray" isFullWidth onClick={onClose}>
          {t("Cancel")}
        </Button>
        <Button tabIndex={2} variant="tall" isFullWidth disabled={!canProceed()} onClick={onConfirm}>
          {t("Buy")}
        </Button>
      </ModalFooterGrid>
    </>
  );
};

export default MainView;
