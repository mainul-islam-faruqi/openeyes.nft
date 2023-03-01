import { Box } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { ConnectWalletButton } from "components/Buttons/ConnectWalletButton";
import { useTranslation } from "next-i18next";
import { Text } from "uikit";

// @ts-ignore
export const ConnectWalletModalGuard: React.FC = ({ children }) => {
  const { t } = useTranslation();
  const { account } = useWeb3React();

  if (!account) {
    return (
      <Box px={4} py={8}>
        <Text as="h1" textStyle="heading-03" bold mb={4}>
          {t("Connect a Wallet")}
        </Text>
        <Text textStyle="detail" color="text-02" mb={6}>
          {t("LooksRare works great with Metamask, Coinbase Wallet, and most other Ethereum wallets.")}
        </Text>
        <ConnectWalletButton />
      </Box>
    );
  }

  return <>{children}</>;
};
