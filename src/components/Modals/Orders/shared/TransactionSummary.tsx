import { Box, Divider, Flex } from "@chakra-ui/react";
import { BigNumber } from "ethers";
import { useTranslation } from "next-i18next";
import React from "react";
import { EthIcon, Text, WethIcon } from "uikit";
import { formatTimestampAsDateString, formatToSignificant } from "utils/format";

interface Props {
  priceText?: string;
  endTime?: number;
  wethBalanceUsed?: BigNumber;
  ethBalanceUsed?: BigNumber;
  showDivider?: boolean;
}

const TransactionSummary: React.FC<Props> = ({
  priceText,
  endTime,
  wethBalanceUsed,
  ethBalanceUsed,
  showDivider = true,
}) => {
  const { t } = useTranslation();

  const isEthUsed = ethBalanceUsed && ethBalanceUsed.gt(0);
  const isWethUsed = wethBalanceUsed && wethBalanceUsed.gt(0);

  return (
    <>
      <Box ml={16}>
        {showDivider && <Divider my={2} />}
        <Flex justifyContent="space-between" alignItems="flex-start">
          <Text color="text-02" textStyle="detail">
            {priceText || t("Price")}
          </Text>
          <Flex flexDir="column">
            {isWethUsed && (
              <Flex alignItems="center" mb={isEthUsed ? 2 : 0} justifyContent="flex-end">
                <WethIcon boxSize={4} mr={0.5} />
                <Text textStyle="detail" bold>
                  {`${formatToSignificant(wethBalanceUsed, 6)} WETH`}
                </Text>
              </Flex>
            )}
            {isEthUsed && (
              <Flex alignItems="center" justifyContent="flex-end">
                <EthIcon boxSize={4} mr={0.5} />
                <Text textStyle="detail" bold>
                  {`${formatToSignificant(ethBalanceUsed, 6)} ETH`}
                </Text>
              </Flex>
            )}
          </Flex>
        </Flex>
        {endTime && (
          <Flex justifyContent="space-between" mt={2}>
            <Text color="text-02" textStyle="detail">
              {t("Valid until")}
            </Text>
            <Text color="text-02" textStyle="detail" textAlign="right">
              {formatTimestampAsDateString(endTime)}
            </Text>
          </Flex>
        )}
      </Box>
    </>
  );
};

export default TransactionSummary;
