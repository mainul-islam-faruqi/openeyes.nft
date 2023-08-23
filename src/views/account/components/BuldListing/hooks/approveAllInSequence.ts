import { useWeb3React } from "@web3-react/core";
import { tokenStandardConfig } from "config";
import { useState } from "react";
import { NFTCardCollection } from "types/graphql";
import { isApprovedForAll, setApprovalForAll } from "utils/calls/nft";

type CollectionApprovalState = "approved" | "txNeedsConfirmation" | "txPending" | "needsApproval" | "txDeclined";
type SortedCollections = Record<CollectionApprovalState, NFTCardCollection[]>;
type StatusMap = Record<NFTCardCollection["address"], CollectionApprovalState>;
interface MultiApprovalReturn {
  sortedCollections: SortedCollections;
  handleApproveCollections: (index?: number) => void;
}

export const useApproveAllInSequence = (collections: NFTCardCollection[]): MultiApprovalReturn => {
  const { library, account } = useWeb3React();

  const [statusMap, setStatusMap] = useState(
    collections.reduce<StatusMap>((acc, collection) => {
      acc[collection.address] = "needsApproval";
      return acc;
    }, {})
  );

  const handleApproveCollections = async (index = 0): Promise<void> => {
    if (!collections[index]) {
      return;
    }
    const collection = collections[index];
    const { type: collectionType, address: collectionAddress } = collection;

    if (account) {
      const config = tokenStandardConfig[collectionType];
      const isCollectionApproved = await isApprovedForAll(
        library,
        config.abi,
        collectionAddress,
        account,
        config.transferManagerAddress
      );

      if (isCollectionApproved) {
        setStatusMap((state) => ({
          ...state,
          [collection.address]: "approved",
        }));
        return handleApproveCollections(index + 1);
      } else {
        setStatusMap((state) => ({
          ...state,
          [collection.address]: "txNeedsConfirmation",
        }));
        try {
          // prompt for approval. catch "rejected" below
          const response = await setApprovalForAll(
            library,
            config.abi,
            collectionAddress,
            account,
            config.transferManagerAddress
          );
          setStatusMap((state) => ({
            ...state,
            [collection.address]: "txPending",
          }));

          // kick off next approval
          handleApproveCollections(index + 1);

          const receipt = await response.wait();
          if (receipt.status) {
            setStatusMap((state) => ({
              ...state,
              [collection.address]: "approved",
            }));
          } else {
            // @NOTE declined is not really accurate. the tx was sent by the user and errored
            setStatusMap((state) => ({
              ...state,
              [collection.address]: "txDeclined",
            }));

            throw new Error(`${receipt.transactionHash} failed`);
          }
        } catch (error) {
          // user declined transaction
          setStatusMap((state) => ({
            ...state,
            [collection.address]: "txDeclined",
          }));
          return Promise.reject();
        }
      }
    }
  };

  /**
   * As the state StatusMap updates, collections are sorted into the appropriate bucket for rendering
   */
  const sortedCollections = collections.reduce(
    (acc, collection) => {
      acc[statusMap[collection.address]].push(collection);
      return acc;
    },
    {
      needsApproval: [],
      txNeedsConfirmation: [],
      txPending: [],
      approved: [],
      txDeclined: [],
    } as SortedCollections
  );

  return {
    handleApproveCollections,
    sortedCollections,
  };
};
