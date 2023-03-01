import { useWeb3React } from "@web3-react/core";
import { USER_ACCOUNT_URI } from "config";
import { useRouter } from "next/router";

/**
 * Helper hook to get the address from the URL. In the case of "/accounts/me" it will return
 * the connected account
 *
 * @returns address
 */
export const useAddressFromQuery = () => {
  const { account } = useWeb3React();
  const { query } = useRouter();
  const routeAddress = query?.address as string | undefined;

  // Url is "/me"
  if (routeAddress === USER_ACCOUNT_URI && account) {
    return account;
  }

  // Url is "/me" but no connected account
  if (routeAddress === USER_ACCOUNT_URI && !account) {
    return undefined;
  }

  return routeAddress;
};
