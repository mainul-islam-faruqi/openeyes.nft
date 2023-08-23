// import { Flex, FlexProps } from "@chakra-ui/react";
// import { BigNumber } from "ethers";
// import { useTranslation } from "next-i18next";
// import { InformationIcon, Popover, Text, TooltipText } from "uikit";
// import { formatFees } from "utils/format";




import { Flex, FlexProps } from "@chakra-ui/react";
import { BigNumber } from "ethers";
import { useTranslation } from "next-i18next";
import { InformationIcon } from "uikit";
import Popover from "uikit/Popover/Popover";
import { Text, TooltipText } from "uikit/Text/Text";
import { formatFees } from "utils/format";



export interface ProtocolPopoverProps extends FlexProps {
  fee?: BigNumber;
}

export const ProtocolFeePopover = ({ fee, ...props }: ProtocolPopoverProps) => {
  const { t } = useTranslation();

  return (
    <Popover
      label={
        <TooltipText textAlign="left">
          {t(
            "When you sell this item, this amount will be taken out of the sale proceeds and redistributed to everyone who is staking LOOKS on the rewards page."
          )}
        </TooltipText>
      }
      placement="right"
    >
      <Flex alignItems="center" {...props}>
        <Text textStyle="detail" bold mr={1} color="currentcolor">
          {fee ? formatFees(fee) : null}
        </Text>
        <InformationIcon boxSize={5} />
      </Flex>
    </Popover>
  );
};
