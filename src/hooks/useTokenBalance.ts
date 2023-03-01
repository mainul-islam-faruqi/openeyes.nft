import { useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import { BigNumber } from "ethers";
import { useQuery, useQueryClient, UseQueryOptions } from "react-query";
import { balanceOf } from "utils/calls/erc20";
import { addresses } from "config/addresses";
import { CONTRACT_BALANCE_INTERVAL } from "config/constants"

type TokenBalanceQueryOptions = UseQueryOptions<BigNumber, any, BigNumber>;

export const BASE_TOKEN_BALANCE_KEY = "token-balance";

export const useTokenBalance = (contractAddress: string, address: string, queryOptions?: TokenBalanceQueryOptions) => {
  const { library } = useWeb3React();
  return useQuery<BigNumber>(
    [BASE_TOKEN_BALANCE_KEY, contractAddress, address],
    () => balanceOf(library, contractAddress, address),
    {
      refetchInterval: CONTRACT_BALANCE_INTERVAL,
      ...queryOptions,
    }
  );
};

export const useInvalidateTokenBalance = () => {
  const queryClient = useQueryClient();
  return useCallback(() => {
    queryClient.invalidateQueries(BASE_TOKEN_BALANCE_KEY);
  }, [queryClient]);
};

export const useWethBalance = (address: string, queryOptions?: TokenBalanceQueryOptions) => {
  return useTokenBalance(addresses.WETH, address, queryOptions);
};

export const useLooksBalance = (address: string, queryOptions?: TokenBalanceQueryOptions) => {
  return useTokenBalance(addresses.LOOKS, address, queryOptions);
};

export const useLooksLpBalance = (address: string, queryOptions?: TokenBalanceQueryOptions) => {
  return useTokenBalance(addresses.LOOKS_LP, address, queryOptions);
};
