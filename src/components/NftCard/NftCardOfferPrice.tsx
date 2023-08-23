import { Flex } from "@chakra-ui/react";
import { IconProps, Text } from "uikit";

interface TokenPriceProps {
  icon?: React.FC<IconProps>;
  label: string;
  price: string;
}

export const NftCardOfferPrice = ({ icon: PriceIcon, label, price }: TokenPriceProps) => (
  <Flex>
    <Text color="text-03" textStyle="helper" mr={1}>
      {label}
    </Text>
    {PriceIcon && <PriceIcon boxSize={4} height="16px" width="8px" mr={0.5} />}
    <Text as="span" bold textStyle="helper" ml={0.5}>
      {price}
    </Text>
  </Flex>
);
