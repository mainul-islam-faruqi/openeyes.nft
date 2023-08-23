// import { ReactElement } from "react";
// import { Box, Flex, FlexProps } from "@chakra-ui/layout";
// import { useColorModeValue } from "@chakra-ui/react";
// import { useWeb3React } from "@web3-react/core";
// import { ChevronRight, MetaMaskIcon, WalletConnectIcon, Text, CoinbaseIcon, CoinbaseLightIcon } from "uikit";
// import { injected, walletconnect, walletlink } from "utils/connectors";
// import { LOCAL_STORAGE_EAGER_CONNECT, EagerConnect } from "config";
// import { setLocalStorageItem } from "utils/localStorage";






import { ReactElement } from "react";
import { Box, Flex, FlexProps } from "@chakra-ui/layout";
import { useColorModeValue } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import ChevronRight from "uikit/Icons/components/ChevronRight";
import { MetaMaskIcon, CoinbaseIcon, CoinbaseLightIcon, WalletConnectIcon } from "uikit";
import { Text } from "uikit/Text/Text";
import { injected, walletconnect, walletlink } from "utils/connectors";
import { LOCAL_STORAGE_EAGER_CONNECT, EagerConnect } from "config/localStorage";
import { setLocalStorageItem } from "utils/localStorage";






export interface BaseWalletLinkProps extends FlexProps {
  leftIcon: ReactElement;
}

export const BaseWalletLink: React.FC<BaseWalletLinkProps> = ({ leftIcon, children, ...props }) => {
  return (
    <Flex alignItems="center" bg="ui-02" cursor="pointer" userSelect="none" mb={0.5} p={4} {...props}>
      <Box flexShrink={0} mr={2}>
        {leftIcon}
      </Box>
      <Box flex={1}>{children}</Box>
      <ChevronRight flexShrink={0} />
    </Flex>
  );
};

export const MetaMaskWalletLink = (props: FlexProps) => {
  const { activate } = useWeb3React();
  const handleConnect = () => {
    activate(injected);
    setLocalStorageItem(LOCAL_STORAGE_EAGER_CONNECT, EagerConnect.INJECTED);
  };

  return (
    <BaseWalletLink onClick={handleConnect} leftIcon={<MetaMaskIcon />} {...props}>
      <Text as="span">MetaMask</Text>
    </BaseWalletLink>
  );
};

export const WalletConnectWalletLink = (props: FlexProps) => {
  const { activate } = useWeb3React();
  const handleConnect = () => {
    setLocalStorageItem(LOCAL_STORAGE_EAGER_CONNECT, EagerConnect.WALLET_CONNECT);
    activate(walletconnect);
  };

  return (
    <BaseWalletLink onClick={handleConnect} leftIcon={<WalletConnectIcon />} {...props}>
      <Text as="span">WalletConnect</Text>
    </BaseWalletLink>
  );
};

export const CoinbaseWalletLink = (props: FlexProps) => {
  const { activate } = useWeb3React();
  const handleConnect = () => {
    activate(walletlink);
    setLocalStorageItem(LOCAL_STORAGE_EAGER_CONNECT, EagerConnect.WALLET_LINK);
  };
  const coinbaseIcon = useColorModeValue(<CoinbaseLightIcon />, <CoinbaseIcon />);

  return (
    <BaseWalletLink onClick={handleConnect} leftIcon={coinbaseIcon} {...props}>
      <Text as="span">Coinbase Wallet</Text>
    </BaseWalletLink>
  );
};
