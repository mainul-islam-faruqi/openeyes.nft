import { Box, Flex, SimpleGrid } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { Text } from "uikit";
import { ConnectWalletButton } from "components/Buttons";

const ConnectWalletBox = () => {
  const { t } = useTranslation();

  return (
    <Box bg="ui-01" py={6} px={4}>
      <SimpleGrid width="100%" columns={2}>
        <Flex alignItems="center">
          <Text bold>{t("Connect Wallet to View")}</Text>
        </Flex>
        <ConnectWalletButton width="100%" />
      </SimpleGrid>
    </Box>
  );
};

export default ConnectWalletBox;
