import { useWeb3React } from "@web3-react/core";
import { useEffect } from "react";
import { useQueryClient } from "react-query";
import usePreviousValue from "./usePreviousValue";

export const useQueryClientListener = () => {
  const { account } = useWeb3React();
  const queryClient = useQueryClient();
  const previousAccount = usePreviousValue(account);

  useEffect(() => {
    // Checking if account is undefined prevents the resetQuery from happening on first load
    if (account && previousAccount && account !== previousAccount) {
      queryClient.resetQueries();
    }
  }, [account, previousAccount, queryClient]);
};
