import { Trans, useTranslation } from "react-i18next";
import { BigNumber } from "ethers";
import { Box, Flex, FlexProps } from "@chakra-ui/react";
import { EthIcon, Text, WethIcon } from "uikit";
import { formatToSignificant } from "utils/format";
import { EthAmount } from "components/EthAmount";

export interface PaymentBreakdownProps extends FlexProps {
  nftPriceInWei: BigNumber;
  isUsingEth?: boolean;
  isUsingWeth?: boolean;
  wethBalanceUsed: BigNumber;
  ethBalanceUsed: BigNumber;
  title?: string;
}

export const PaymentBreakdown = ({
  nftPriceInWei,
  isUsingEth,
  isUsingWeth,
  wethBalanceUsed,
  ethBalanceUsed,
  title,
  ...props
}: PaymentBreakdownProps) => {
  const { t } = useTranslation();

  return (
    <>
      <Flex justifyContent="space-between" {...props}>
        <Text textStyle="heading-04" bold>
          {title || t("You pay")}
        </Text>
        <Box textAlign="right">
          {wethBalanceUsed.gt(0) && (
            <Text textStyle="heading-04" bold display="flex" alignItems="center" justifyContent="flex-end">
              <WethIcon boxSize={5} mr={1} />
              {`${formatToSignificant(wethBalanceUsed, 6)} WETH`}
            </Text>
          )}
          {ethBalanceUsed.gt(0) && (
            <Text textStyle="heading-04" bold display="flex" alignItems="center" justifyContent="flex-end">
              <EthIcon boxSize={5} mr={1} />
              {`${formatToSignificant(ethBalanceUsed, 6)} ETH`}
            </Text>
          )}
          {isUsingEth && isUsingWeth && (
            <Flex alignItems="center" justifyContent="end">
              <Trans i18nKey="totalEth">
                <Text color="text-02" textStyle="detail" mr={1}>
                  {t("Total")}
                </Text>
                <EthAmount bold textStyle="detail" amount={formatToSignificant(nftPriceInWei, 6)} />
              </Trans>
            </Flex>
          )}
        </Box>
      </Flex>
      {isUsingEth && (
        <Text mt={2} textStyle="helper" color="text-02">
          {t("ETH will be converted to WETH.")}
        </Text>
      )}
    </>
  );
};
