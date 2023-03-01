import { Flex, FlexProps } from "@chakra-ui/react";
import { BigNumberish } from "ethers";
import { useTranslation } from "next-i18next";
import { EthHalfIcon, Text } from "uikit";
import { formatToSignificant } from "utils/format";

interface OsListingPriceProps extends FlexProps {
  priceInWei: BigNumberish | null | undefined;
}

export const OsListingPriceRow = ({ priceInWei, ...props }: OsListingPriceProps) => {
  const { t } = useTranslation();

  if (!priceInWei) {
    return null;
  }

  return (
    <Flex alignItems="center" {...props}>
      <Text flex={1} textStyle="helper" color="text-03">
        {t("Price on OpenSea")}
      </Text>
      <Flex alignItems="center" justifyContent="end">
        <EthHalfIcon boxSize={14} width="8px" height="16px" mr={1} />
        <Text textStyle="helper" bold color="text-02">
          {formatToSignificant(priceInWei, 4)}
        </Text>
      </Flex>
    </Flex>
  );
};
