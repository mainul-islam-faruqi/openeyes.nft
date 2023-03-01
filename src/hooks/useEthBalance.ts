import { BigNumber } from "ethers";
import { useWeb3React } from "@web3-react/core";
import { useQuery, UseQueryOptions } from "react-query";

export const fetcher = async (provider: any, address: string): Promise<BigNumber> => {
  const balance = await provider.getBalance(address);
  return balance;
};

export const useEthBalance = (address: string, queryOptions?: UseQueryOptions<BigNumber, any, BigNumber>) => {
  const { library } = useWeb3React();
  return useQuery<BigNumber>(["wallet-balance", address], () => fetcher(library, address), queryOptions);
};
