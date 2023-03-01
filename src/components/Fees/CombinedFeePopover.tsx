// import { Box, Flex, FlexProps } from "@chakra-ui/react";
// import { BigNumber, constants } from "ethers";
// import { useTranslation } from "next-i18next";
// import { HelpIcon, Popover, Text, TooltipText } from "uikit";
// import { formatFees } from "utils/format";




import { Box, Flex, FlexProps } from "@chakra-ui/react";
import { BigNumber, constants } from "ethers";
import { useTranslation } from "next-i18next";
import { HelpIcon } from "uikit";
import Popover from "uikit/Popover/Popover";
import { Text } from "uikit/Text/Text";
import { TooltipText } from "uikit/Text/Text";
import { formatFees } from "utils/format";





export interface CombinedFeePopoverProps extends FlexProps {
  protocolFee?: BigNumber;
  creatorFee?: BigNumber;
}

export const CombinedFeePopover = ({
  protocolFee = constants.Zero,
  creatorFee = constants.Zero,
  ...props
}: CombinedFeePopoverProps) => {
  const { t } = useTranslation();
  const combinedFee = creatorFee.add(protocolFee);
  const combinedFeeFormatted = formatFees(combinedFee);
  const creatorFeeFormatted = formatFees(creatorFee);
  const protocolFeeFormatted = formatFees(protocolFee);

  return (
    <Popover
      size="lg"
      label={
        <Box width="190px">
          <Flex justifyContent="space-between" mb={1}>
            <TooltipText textStyle="detail">{t("Creator Royalties")}</TooltipText>
            <TooltipText textStyle="detail">{t(creatorFeeFormatted)}</TooltipText>
          </Flex>
          <Flex justifyContent="space-between">
            <TooltipText textStyle="detail">{t("LOOKS Stakers")}</TooltipText>
            <TooltipText textStyle="detail">{t(protocolFeeFormatted)}</TooltipText>
          </Flex>
        </Box>
      }
      placement="top"
    >
      <Flex alignItems="center" {...props}>
        <Text textStyle="detail" color="text-02" mr={1}>
          {combinedFeeFormatted}
        </Text>
        <HelpIcon boxSize={5} color="text-03" />
      </Flex>
    </Popover>
  );
};
