import { ReactText } from "react";
import { Text, TextProps } from "uikit";
import { ethers } from "ethers";

export interface EthAmountProps extends TextProps {
  amount: ReactText;
}

export const EthAmount = ({ amount, ...props }: EthAmountProps) => {
  return <Text {...props}>{`${ethers.constants.EtherSymbol}${amount}`}</Text>;
};
