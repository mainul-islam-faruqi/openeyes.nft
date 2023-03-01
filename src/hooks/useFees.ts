import { useWeb3React } from "@web3-react/core";
import { BigNumber } from "ethers";
import {
  viewProtocolFee,
  viewCollectionSetterStatus,
  viewCollectionRoyaltyInfo,
  viewCreatorFee,
} from "utils/calls/fees";
import { useQuery, UseQueryOptions } from "react-query";
import { useActiveProvider } from "./useActiveProvider";

export const BASE_CREATOR_KEY = "collection-creator-fee";
export const BASE_PROTOCOL_KEY = "protocol-fee";
export const BASE_COLLECTION_STATUS_KEY = "setter-status";
export const BASE_ROYALTY_INFO_KEY = "royalty-info";

const staleTime = 10 * 60 * 1000; // 10 minutes

export interface RoyaltyInfo {
  setter: string;
  receiver: string;
  fee: BigNumber;
}

export const useCollectionRoyaltyInfo = (
  collectionAddress: string,
  queryOptions?: UseQueryOptions<RoyaltyInfo, any, RoyaltyInfo>
) => {
  const { account, library } = useWeb3React();
  return useQuery<RoyaltyInfo>(
    [BASE_ROYALTY_INFO_KEY, account, collectionAddress],
    () => viewCollectionRoyaltyInfo(library, collectionAddress),
    {
      staleTime,
      refetchOnWindowFocus: false,
      ...queryOptions,
    }
  );
};

export const useCollectionCreatorFee = (
  collectionAddress: string,
  queryOptions?: UseQueryOptions<BigNumber, any, BigNumber>
) => {
  const { library } = useWeb3React();
  return useQuery<BigNumber>([BASE_CREATOR_KEY, collectionAddress], () => viewCreatorFee(library, collectionAddress), {
    staleTime,
    refetchOnWindowFocus: false,
    ...queryOptions,
  });
};

export const useProtocolFee = (strategyAddress: string, queryOptions?: UseQueryOptions<BigNumber, any, BigNumber>) => {
  const library = useActiveProvider();
  return useQuery<BigNumber>([BASE_PROTOCOL_KEY, strategyAddress], () => viewProtocolFee(library, strategyAddress), {
    staleTime,
    refetchOnWindowFocus: false,
    ...queryOptions,
  });
};

export const useCollectionSetterStatus = (
  collectionAddress: string,
  queryOptions?: UseQueryOptions<number, any, number>
) => {
  const { account, library } = useWeb3React();
  return useQuery<number>(
    [BASE_COLLECTION_STATUS_KEY, account, collectionAddress],
    () => viewCollectionSetterStatus(library, collectionAddress),
    {
      staleTime,
      refetchOnWindowFocus: false,
      ...queryOptions,
    }
  );
};
