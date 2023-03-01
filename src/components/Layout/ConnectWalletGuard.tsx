import { useWeb3React } from "@web3-react/core";
import { ConnectWalletButton, ConnectWalletButtonProps } from "../Buttons/ConnectWalletButton";

export const ConnectWalletGuard: React.FC<ConnectWalletButtonProps> = ({ children, ...props }) => {
  const { account } = useWeb3React();

  if (!account) {
    return <ConnectWalletButton {...props} />;
  }

  return <>{children}</>;
};
