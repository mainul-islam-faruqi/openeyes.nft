// import { Flex, FlexProps, Spinner } from "@chakra-ui/react";
// import { useTranslation } from "next-i18next";
// import { InformationIcon, Popover, Text, TooltipText } from "uikit";
// import { formatNumberToLocale } from "utils/format";



import { Flex, FlexProps, Spinner } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { InformationIcon } from "uikit";
import Popover from "uikit/Popover/Popover";
import { Text, TooltipText } from "uikit/Text/Text";
import { formatNumberToLocale } from "utils/format";





interface CreatorPopoverProps extends FlexProps {
  fee?: number;
  isWarning?: boolean;
}

export const CreatorFeePopover = ({ fee, isWarning = false, ...props }: CreatorPopoverProps) => {
  const { t } = useTranslation();

  return (
    <Popover
      label={
        <TooltipText textAlign="left">
          {t(
            "When you sell this item, this amount will be taken out of the sale proceeds and sent to the creator of the NFT as royalties. Collection owners can adjust royalties."
          )}
        </TooltipText>
      }
      placement="right"
    >
      <Flex alignItems="center" color={isWarning ? "text-warning" : "currentColor"} {...props}>
        {fee === undefined ? (
          <Spinner boxSize={3} />
        ) : (
          <Text textStyle="detail" bold mr={1}>
            {formatNumberToLocale(fee || 0, 1, 1)}%
          </Text>
        )}
        <InformationIcon boxSize={5} />
      </Flex>
    </Popover>
  );
};
