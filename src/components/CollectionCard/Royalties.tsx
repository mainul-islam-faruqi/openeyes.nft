// import { Box, Flex, FlexProps, useDisclosure } from "@chakra-ui/react";
// import { useTranslation } from "next-i18next";
// import { ChevronDown, ChevronUp, Text } from "uikit";
// import { Payouts } from "./Payouts";



import { Box, Flex, FlexProps, useDisclosure } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import ChevronDown from "uikit/Icons/components/ChevronDown";
import ChevronUp from "uikit/Icons/components/ChevronUp";
import { Text } from "uikit/Text/Text";
import { Payouts } from "./Payouts";



export interface RoyaltiesProps extends FlexProps {
  collectionAddress: string;
  defaultIsOpen?: boolean;
}

export const Royalties = ({ collectionAddress, defaultIsOpen = false, ...props }: RoyaltiesProps) => {
  const { t } = useTranslation();
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen });

  return (
    <Box bg="ui-bg">
      <Flex alignItems="center" cursor="pointer" p={4} onClick={onToggle} userSelect="none" {...props}>
        <Text flex={1}>{t("Royalty Payout")}</Text>
        <Box flexShrink={0}>{isOpen ? <ChevronDown /> : <ChevronUp />}</Box>
      </Flex>
      {isOpen && <Payouts collectionAddress={collectionAddress} />}
    </Box>
  );
};
