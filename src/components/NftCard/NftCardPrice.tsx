import { Flex, FlexProps } from "@chakra-ui/react";
import { IconProps, Text } from "uikit";

interface NftCardPriceProps extends FlexProps {
  price: string;
  currencyIcon: React.FC<IconProps>;
}

export const NftCardPrice = ({ price, currencyIcon: Icon, ...props }: NftCardPriceProps) => (
  <Flex alignItems="center" maxWidth="150px" {...props}>
    <Icon boxSize={4} width="8px" mr={1} />
    <Text textStyle="detail" color="text-01" bold isTruncated title={price}>
      {price}
    </Text>
  </Flex>
);
