import { BigNumber } from "ethers";
import { useQuery, UseQueryOptions } from "react-query";
import { baseQueryKeys } from "config";
import { totalSupply, balanceOf, getAllowance } from "utils/calls/erc20";
import { useActiveProvider } from "hooks/useActiveProvider";

export const erc20Keys = {
  ...baseQueryKeys("erc-20"),
  totalSupply: (tokenAddress: string) => [...erc20Keys.single(), "totalSupply", tokenAddress],
  balanceOf: (tokenAddress: string, account: string) => [...erc20Keys.single(), "balanceOf", tokenAddress, account],
  allowance: (tokenAddress: string, account: string, spender: string) => [
    ...erc20Keys.single(),
    "allowance",
    tokenAddress,
    account,
    spender,
  ],
};

export const useTotalSupply = (tokenAddress: string, options?: UseQueryOptions<BigNumber, any, BigNumber>) => {
  const library = useActiveProvider();
  return useQuery<BigNumber>(erc20Keys.totalSupply(tokenAddress), () => totalSupply(library, tokenAddress), {
    ...options,
  });
};

export const useBalanceOf = (
  tokenAddress: string,
  account: string,
  options?: UseQueryOptions<BigNumber, any, BigNumber>
) => {
  const library = useActiveProvider();
  return useQuery<BigNumber>(
    erc20Keys.balanceOf(tokenAddress, account),
    () => balanceOf(library, tokenAddress, account),
    {
      ...options,
    }
  );
};

export const useGetAllowance = (
  tokenAddress: string,
  account: string,
  spender: string,
  options?: UseQueryOptions<BigNumber, any, BigNumber>
) => {
  const library = useActiveProvider();
  return useQuery<BigNumber>(
    erc20Keys.allowance(tokenAddress, account, spender),
    () => getAllowance(library, tokenAddress, account, spender),
    {
      ...options,
    }
  );
};
