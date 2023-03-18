import { useTranslation } from "react-i18next";
import { BoxProps } from "@chakra-ui/react";
import { Text } from "uikit";
import { pageHeightRemDesktop, pageHeightRemMobile } from "uikit/theme/global";
import Page from "components/Layout/Page";
import { Container } from "components/Layout/Container";
import { ConnectWalletButton } from "../Buttons";

export const ConnectWalletPlaceholderPage: React.FC<BoxProps> = ({ children, ...props }) => {
  const { t } = useTranslation();

  return (
    <Page>
      <Container
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight={{ base: pageHeightRemMobile, lg: pageHeightRemDesktop }}
        maxW="408px"
        px={2}
        {...props}
      >
        <Text as="h1" textStyle="display-03" textAlign="center" mb={6} bold>
          {t("Connect a Wallet")}
        </Text>
        {children || (
          <Text textStyle="detail" color="text-02" maxW="408px" textAlign="center">
            {t("OpenEyes.nft works great with Metamask, Coinbase Wallet, and most other Ethereum wallets.")}
          </Text>
        )}
        <ConnectWalletButton mt={6} round />
      </Container>
    </Page>
  );
};
