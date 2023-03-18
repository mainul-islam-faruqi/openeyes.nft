kimport { chain, configureChains, createClient } from "wagmi";
import { darkTheme, lightTheme, connectorsForWallets } from "@rainbow-me/rainbowkit";
import { wallet } from "@rainbow-me/rainbowkit";
import { SupportedChainId } from "@looksrare/sdk";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { palette } from "uikit/theme/colors";
import { global } from "uikit/theme/global";
import { APP_CHAIN_ID, currentChainInfo } from "./chains";

const alchemyId = process.env.ALCHEMY_KEY;

const getSupportedChain = () => {
  switch (APP_CHAIN_ID) {
    case SupportedChainId.HARDHAT:
      return chain.hardhat;
    case SupportedChainId.GOERLI:
      return chain.goerli;
    case SupportedChainId.MAINNET:
    default:
      return chain.mainnet;
  }
};

const getProviders = () => {
  const alchemy = alchemyProvider({ apiKey: alchemyId });

  if (APP_CHAIN_ID === SupportedChainId.HARDHAT) {
    return [
      alchemy,
      // Hardhat support
      jsonRpcProvider({
        rpc: () => ({
          http: currentChainInfo.rpcUrl, // e.g. http://127.0.0.1:8545
        }),
      }),
      publicProvider(),
    ];
  }

  return [alchemy];
};

export const wagmiConfig = configureChains([getSupportedChain()], getProviders());

/**
 * RainbowKit Wallet
 */
const chains = wagmiConfig.chains;

// Default wallets
// https://github.com/rainbow-me/rainbowkit/blob/%40rainbow-me/rainbowkit%400.6.1/packages/rainbowkit/src/wallets/getDefaultWallets.ts#L24
const defaultWallets = [
  wallet.injected({ chains }),
  wallet.rainbow({ chains }),
  wallet.coinbase({ appName: "OpenEyes.nft", chains }),
  wallet.metaMask({ chains, shimDisconnect: true }),
  wallet.walletConnect({ chains }),
  wallet.brave({ chains, shimDisconnect: true }),
];
const walletList = [
  {
    groupName: "Popular",
    wallets: defaultWallets,
  },
];
const connectors = connectorsForWallets(walletList);

/**
 * @see https://www.rainbowkit.com/docs/custom-theme
 * @NOTE default theme included to ensure any updates will be reflected in the theme object
 */
const defaultDarkTheme = darkTheme();
export const darkRainbowTheme = {
  ...defaultDarkTheme,
  colors: {
    ...defaultDarkTheme.colors,
    accentColor: palette.green[200],
    accentColorForeground: "black", // text-primarybutton
    error: palette.red[400],
    menuItemBackground: palette.gray[850],
    modalBackground: palette.gray[800],
    modalText: palette.gray[50],
    modalTextSecondary: palette.gray[400],
  },
  fonts: {
    ...defaultDarkTheme.fonts,
    body: global.body.fontFamily,
  },
  radii: {
    ...defaultDarkTheme.radii,
    actionButton: "4px",
    menuButton: "4px",
    modal: "16px",
    modalMobile: "8px",
  },
};

// @TODO support light mode
const defaultLightTheme = lightTheme();
export const lightRainbowTheme = {
  ...defaultLightTheme,
  colors: {
    ...defaultLightTheme.colors,
    accentColor: palette.green[400],
    accentColorForeground: "white", // text-primarybutton
    error: palette.red[500],
    menuItemBackground: palette.gray[75],
    modalBackground: palette.gray[50],
    modalText: palette.gray[800],
    modalTextSecondary: palette.gray[500],
  },
  fonts: {
    ...defaultLightTheme.fonts,
    body: global.body.fontFamily,
  },
  radii: {
    ...defaultLightTheme.radii,
    actionButton: "4px",
    menuButton: "4px",
    modal: "16px",
    modalMobile: "8px",
  },
};

/**
 * WAGMI
 */
export const wagmiClient = createClient({
  autoConnect: true,
  provider: wagmiConfig.provider,
  connectors,
});
