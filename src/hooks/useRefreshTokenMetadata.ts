import { useCallback } from "react";
import { useQueryClient } from "react-query";
import { refreshNft } from "utils/graphql/refresh";
import { tokenKeys } from "./graphql/tokens";
import { useToast } from "./useToast";

export const useRefreshTokenMetadata = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  return useCallback(
    async (collectionAddress: string, tokenId: string) => {
      const res = await refreshNft(collectionAddress, tokenId);
      if (res.success) {
        toast({ title: "Refreshing", description: "Metadata refreshing. Check back in a few moments." });
        queryClient.invalidateQueries(tokenKeys.token(collectionAddress, tokenId));
      } else {
        toast({ title: "Can't refresh", description: res.message, status: "error" });
      }
    },
    [toast, queryClient]
  );
};
