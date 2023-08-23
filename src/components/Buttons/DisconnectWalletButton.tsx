// import { useWeb3React } from "@web3-react/core";
// import { useTranslation } from "react-i18next";
// import { Button, ButtonProps } from "uikit";
// import { LOCAL_STORAGE_EAGER_CONNECT } from "config";
// import { removeAuthCookie } from "utils/cookies";
// import { removeLocalStorageItem } from "utils/localStorage";



import { useWeb3React } from "@web3-react/core";
import { useTranslation } from "react-i18next";
import { Button, ButtonProps } from "uikit/Button/Button";
import { LOCAL_STORAGE_EAGER_CONNECT } from "config/localStorage";
import { removeAuthCookie } from "utils/cookies";
import { removeLocalStorageItem } from "utils/localStorage";



export const DisconnectWalletButton: React.FC<ButtonProps> = ({ children, ...props }) => {
  const { account, deactivate } = useWeb3React();
  const { t } = useTranslation();

  const handleClick = () => {
    if (account) {
      deactivate();
      removeAuthCookie(account);
      removeLocalStorageItem(LOCAL_STORAGE_EAGER_CONNECT);
    }
  };

  return (
    <Button onClick={handleClick} {...props}>
      {children || t("Disconnect")}
    </Button>
  );
};
