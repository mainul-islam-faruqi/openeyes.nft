import { Flex, FlexProps } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { FloorTooltipText } from "../../../TooltipText/GlobalTooltipText";
import { CollectionFloor } from "types/graphql";
import { EthHalfIcon, HelpIcon, Popover, Text } from "uikit";
import { getGlobalFloor } from "utils/floorPricePercentHelpers";
import { formatToSignificant } from "utils/format";

interface GlobalFloorPriceProps extends FlexProps {
  collectionFloor: CollectionFloor;
}

const GlobalFloorPrice = ({ collectionFloor, ...props }: GlobalFloorPriceProps) => {
  const { t } = useTranslation();
  const { globalFloor, floorPrice } = getGlobalFloor(collectionFloor);

  return (
    <Flex {...props}>
      {/* @ts-ignore */}
      <Popover label={<FloorTooltipText amountLr={floorPrice} amountGlobal={globalFloor} />}>
        <Flex alignItems="center">
          <Text textStyle="helper" color="text-03" mr={1}>
            {t("Global Floor")}
          </Text>
          <EthHalfIcon boxSize={14} height={4} width={2} mr={1} />
          <Text textStyle="helper" color="text-02" bold mr={1}>
            {formatToSignificant(globalFloor, 4)}
          </Text>
          <HelpIcon boxSize={4} color="text-03" />
        </Flex>
      </Popover>
    </Flex>
  );
};

export default GlobalFloorPrice;
