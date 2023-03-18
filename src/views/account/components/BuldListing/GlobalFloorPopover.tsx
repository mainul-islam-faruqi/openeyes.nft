import { Box, Divider, Flex, VStack } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { EthIcon, HelpIcon, LogoRoundIcon, OpenSeaIcon, Popover, TooltipText, Text } from "uikit";

interface GlobalFloorPopoverProps {
  looksFloorEth: string;
  osFloorEth?: string;
  globalFloor: string;
}

export const GlobalFloorPopover = ({ looksFloorEth, osFloorEth, globalFloor }: GlobalFloorPopoverProps) => {
  const { t } = useTranslation();

  const headerText = !!osFloorEth ? t("Lowest cross-marketplace floor price") : t("Floor price");
  return (
    <Popover
      size="lg"
      label={
        <Box width="280px">
          <VStack sx={{ "> *": { width: "100%" } }} spacing={4}>
            <TooltipText>{headerText}</TooltipText>
            <Divider />
            <Flex justifyContent="space-between" alignItems="center">
              <Flex alignItems="center">
                <LogoRoundIcon boxSize={4} mr={1} />
                <TooltipText>{t("Floor on OpenEyes.nft")}:</TooltipText>
              </Flex>
              <Flex alignItems="center">
                <EthIcon boxSize={4} />
                <TooltipText textStyle="detail" bold>
                  {looksFloorEth}
                </TooltipText>
              </Flex>
            </Flex>
            {!!osFloorEth && (
              <Flex justifyContent="space-between" alignItems="center">
                <Flex alignItems="center">
                  <OpenSeaIcon boxSize={4} mr={1} />
                  <TooltipText>{t("Floor on OpenSea")}:</TooltipText>
                </Flex>
                <Flex alignItems="center">
                  <EthIcon boxSize={4} />
                  <TooltipText textStyle="detail">{osFloorEth}</TooltipText>
                </Flex>
              </Flex>
            )}
          </VStack>
        </Box>
      }
      placement="top"
    >
      <Flex alignItems="center">
        <EthIcon boxSize={4} />
        <Text textStyle="detail" color="text-02" mr={1}>
          {globalFloor}
        </Text>
        <HelpIcon boxSize={5} color="text-03" />
      </Flex>
    </Popover>
  );
};
