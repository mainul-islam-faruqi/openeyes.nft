import { Flex, FlexProps } from "@chakra-ui/react";
import { MultipleIcon, Text } from "uikit";

interface NftCardBalanceProps extends FlexProps {
  balance: string;
}

export const NftCardBalance = ({ balance, ...props }: NftCardBalanceProps) => {
  return (
    <Flex alignItems="center" borderRadius="md" bg="ui-02" position="absolute" top={1} right={1} p={1.5} {...props}>
      <MultipleIcon boxSize={4} mr={1.5} />
      <Text textStyle="detail">{balance}</Text>
    </Flex>
  );
};
