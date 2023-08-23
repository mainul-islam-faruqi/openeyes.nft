// import { useEffect, useRef } from "react";
// import { Box, Flex } from "@chakra-ui/react";
// import { useIsSupportedNetwork } from "hooks/useIsSupportedNetwork";
// import { useTranslation } from "react-i18next";
// import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
// import {
//   NoEthereumProviderError,
//   UserRejectedRequestError as UserRejectedRequestErrorInjected,
// } from "@web3-react/injected-connector";
// import { useToast } from "hooks/useToast";
// import { ModalBody, ModalProps, Text, WarningFilledIcon, Button } from "uikit";
// import { LOCAL_STORAGE_EAGER_CONNECT, APP_CHAIN_ID, currentChainInfo } from "config";
// import { useIsMetaMaskish } from "hooks/useIsMetaMaskish";
// import { removeLocalStorageItem } from "utils/localStorage";
// import { switchNetwork } from "utils/wallet";
// import { MetaMaskWalletLink, WalletConnectWalletLink, CoinbaseWalletLink } from "./ConnectorLinks";








import { useEffect, useRef } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { useIsSupportedNetwork } from "hooks/useIsSupportedNetwork";
import { useTranslation } from "react-i18next";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from "@web3-react/injected-connector";
import { useToast } from "hooks/useToast";
import ModalBody from "uikit/Modal/ModalBody";
import { ModalProps } from "uikit/Modal/Modal";
import { Text } from "uikit/Text/Text";
import { WarningFilledIcon } from "uikit";
import { Button } from "uikit/Button/Button";
import { LOCAL_STORAGE_EAGER_CONNECT } from "config/localStorage";
import { APP_CHAIN_ID, currentChainInfo } from "config/chains";
import { useIsMetaMaskish } from "hooks/useIsMetaMaskish";
import { removeLocalStorageItem } from "utils/localStorage";
import { switchNetwork } from "utils/wallet";
import { MetaMaskWalletLink, WalletConnectWalletLink, CoinbaseWalletLink } from "./ConnectorLinks";








export type ConnectWalletModalProps = Pick<ModalProps, "isOpen" | "onClose">;

const getErrorMessage = (error: Error) => {
  if (error instanceof NoEthereumProviderError) {
    return "No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.";
  } else if (error instanceof UnsupportedChainIdError) {
    return "You're connected to an unsupported network.";
  } else if (error instanceof UserRejectedRequestErrorInjected) {
    return "Please authorize this website to access your Ethereum account.";
  } else {
    console.error(error);
    return "An unknown error occurred. Check the console for more details.";
  }
};

export const ConnectWalletModalBody = () => {
  const { error } = useWeb3React();
  const refId = useRef<number | string>();
  const toast = useToast();
  const { t } = useTranslation();
  const isUnsupportedNetwork = useIsSupportedNetwork();
  const isMetaMaskIsh = useIsMetaMaskish();

  useEffect(() => {
    if (error && !refId.current) {
      removeLocalStorageItem(LOCAL_STORAGE_EAGER_CONNECT);
      refId.current = toast({
        title: "Connection error:",
        description: getErrorMessage(error),
        status: "error",
        onCloseComplete: () => {
          refId.current = undefined;
        },
      });
    }
  }, [error, toast]);

  return (
    <>
      <Box mb={4}>
        {isUnsupportedNetwork && (
          <Box bg="yellow.300" p={4}>
            <Flex alignItems="center" mb={4}>
              <Text bold color="text-inverse" flex={1}>
                {t("Wrong Network")}
              </Text>
              <WarningFilledIcon color="text-inverse" />
            </Flex>{" "}
            <Text as="p" color="text-inverse" textStyle="detail">
              {t("Please connect your wallet to the {{chainName}} network", { chainName: currentChainInfo.label })}
            </Text>
            {isMetaMaskIsh && (
              <Button
                onClick={() => switchNetwork(APP_CHAIN_ID)}
                colorScheme="gray"
                size="sm"
                isFullWidth
                square
                mt={4}
              >
                {t("Change Network")}
              </Button>
            )}
          </Box>
        )}
        <MetaMaskWalletLink />
        <WalletConnectWalletLink />
        <CoinbaseWalletLink />
      </Box>

      <ModalBody>
        <Text as="p" bold mb={6}>
          {t("Don’t see your wallet provider?")}
        </Text>
        <Text as="p" color="text-02">
          {t("If you're on desktop, try MetaMask")}
        </Text>
        <Text as="p" color="text-02">
          {t("If you're on mobile, try WalletConnect")}
        </Text>
      </ModalBody>
    </>
  );
};
