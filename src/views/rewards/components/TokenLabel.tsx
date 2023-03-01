import { Flex, FlexProps, Skeleton } from "@chakra-ui/react";
import { BigNumber } from "ethers";
import { useCoinPrices } from "hooks/useCoinPrices";
import { Text } from "uikit";
import { formatToSignificant, formatUsd, fromDecimals } from "utils/format";

export interface TokenLabelProps extends FlexProps {
  amount: BigNumber;
  symbol: string;
  displayDecimals?: number;
  price: number;
  isLoadingPrice?: boolean;
}

export const TokenLabel = ({
  amount,
  symbol,
  price,
  isLoadingPrice = false,
  displayDecimals = 9,
  ...props
}: TokenLabelProps) => {
  const amountDisplay = formatToSignificant(amount, displayDecimals);
  const amountAsNum = parseFloat(fromDecimals(amount));

  return (
    <Flex alignItems="center" flexWrap="wrap" {...props}>
      <Text bold mr={2}>{`${amountDisplay} ${symbol}`}</Text>
      {isLoadingPrice ? (
        <Skeleton height="24px" width="70px" />
      ) : (
        <Text color="text-02" textStyle="helper">
          {`(${formatUsd(amountAsNum * price!)})`}
        </Text>
      )}
    </Flex>
  );
};

export const WethTokenLabel = ({ amount, ...props }: Omit<TokenLabelProps, "symbol" | "price">) => {
  const coinPriceQuery = useCoinPrices();
  return (
    <TokenLabel
      amount={amount}
      price={coinPriceQuery.isSuccess ? coinPriceQuery.data.eth : 0}
      isLoadingPrice={coinPriceQuery.isFetching}
      symbol="WETH"
      {...props}
    />
  );
};

export const LooksTokenLabel = ({ amount, ...props }: Omit<TokenLabelProps, "symbol" | "price">) => {
  const coinPriceQuery = useCoinPrices();
  return (
    <TokenLabel
      amount={amount}
      price={coinPriceQuery.isSuccess ? coinPriceQuery.data.looks : 0}
      isLoadingPrice={coinPriceQuery.isFetching}
      symbol="LOOKS"
      {...props}
    />
  );
};
