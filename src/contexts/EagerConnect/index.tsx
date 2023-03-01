import { createContext, useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { LOCAL_STORAGE_EAGER_CONNECT, EagerConnect } from "config/localStorage";
import { injected, walletconnect, walletlink } from "utils/connectors";
import { getLocalStorageItem } from "utils/localStorage";

export const EagerConnectContext = createContext<boolean>(false);

export const EagerConnectProvider: React.FC = ({ children }) => {
  const { activate, active, error } = useWeb3React();
  const [connectionTried, setConnectionTried] = useState(false);

  // Run eager connect
  useEffect(() => {
    (async () => {
      try {
        const eagerConnect = getLocalStorageItem(LOCAL_STORAGE_EAGER_CONNECT);
        const isAuthorized = await injected.isAuthorized();
        if (isAuthorized) {
          if (eagerConnect === EagerConnect.INJECTED) {
            await activate(injected, undefined, true);
          }
          if (eagerConnect === EagerConnect.WALLET_CONNECT) {
            await activate(walletconnect, undefined, true);
          }
          if (eagerConnect === EagerConnect.WALLET_LINK) {
            await activate(walletlink, undefined, true);
          }
        }

        setConnectionTried(true);
      } catch {
        setConnectionTried(true);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally only running on mount

  // Try to connect on account change
  useEffect(() => {
    const { ethereum } = window;
    if (ethereum && ethereum.on && !active && !error && !connectionTried) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          activate(injected, undefined, true).catch((err) => {
            console.error("Failed to activate after accounts changed", err);
          });
        }
      };

      ethereum.on("accountsChanged", handleAccountsChanged);

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener("accountsChanged", handleAccountsChanged);
        }
      };
    }
  }, [active, error, connectionTried, activate]);

  return <EagerConnectContext.Provider value={connectionTried}>{children}</EagerConnectContext.Provider>;
};
