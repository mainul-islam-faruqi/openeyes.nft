import { useRouter } from "next/router";
import { useWeb3React } from "@web3-react/core";
import { USER_ACCOUNT_URI } from "config";
import Page, { PageProps } from "components/Layout/Page";
import { ConnectWalletPlaceholderPage } from "components/Placeholders";

export const AccountPage: React.FC<PageProps> = (props) => {
  const { query } = useRouter();
  const routeAddress = query?.address as string;
  const { account } = useWeb3React();

  if (!account && routeAddress === USER_ACCOUNT_URI) {
    return <ConnectWalletPlaceholderPage />;
  }

  return <Page {...props} />;
};
