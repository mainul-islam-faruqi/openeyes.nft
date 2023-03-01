import { useCallback } from "react";
import { useRouter } from "next/router";
import SearchInsights, { InsightsMethodMap } from "search-insights";
import { ALGOLIA_COLLECTIONS_INDEX, ALGOLIA_TOKENS_INDEX, ALGOLIA_USERS_INDEX } from "config/algolia";
import { APP_CHAIN_ID } from "config/chains";

export enum AlgoliaEventNames {
  TOKEN_HIT_CLICKED = "Token Hit Clicked",
  COLLECTION_HIT_CLICKED = "Collection Hit Clicked",
  USER_HIT_CLICKED = "User Hit Clicked",
  ASK_EXECUTED = "Ask Executed",
  STANDARD_BID_EXECUTED = "Standard Bid Executed",
  COLLECTION_BID_EXECUTED = "Collection Bid Executed",
}

type SupportedInsightMethods = Pick<InsightsMethodMap, "clickedObjectIDs" | "convertedObjectIDs">;

const getTokenObjectID = (collectionAddress: string, tokenId: string) => `${collectionAddress}:${tokenId}`;
const getCollectionObjectID = (collectionAddress: string) => collectionAddress;
const getUserObjectID = (userAddress: string) => userAddress;

/**
 * Construct Algolia objectID based on Index
 */
const getObjectId = ({
  index,
  collectionAddress,
  tokenId,
  userAddress,
}: {
  index: string;
  collectionAddress?: string;
  tokenId?: string;
  userAddress?: string;
}) => {
  if (index === ALGOLIA_USERS_INDEX[APP_CHAIN_ID] && userAddress) {
    return getUserObjectID(userAddress);
  }

  if (index === ALGOLIA_TOKENS_INDEX[APP_CHAIN_ID] && collectionAddress && tokenId) {
    return getTokenObjectID(collectionAddress, tokenId);
  }

  if (index === ALGOLIA_COLLECTIONS_INDEX[APP_CHAIN_ID] && collectionAddress) {
    return getCollectionObjectID(collectionAddress);
  }

  return "";
};

/**
 * Return index from query param if it exists - if not, return index based on arguments passed to hook
 */
const getIndex = ({
  collectionAddress,
  tokenId,
  userAddress,
  queryIndex,
}: {
  collectionAddress?: string;
  tokenId?: string;
  userAddress?: string;
  queryIndex?: string;
}) => {
  if (queryIndex) {
    return queryIndex;
  } else {
    if (collectionAddress && tokenId) {
      return ALGOLIA_TOKENS_INDEX[APP_CHAIN_ID];
    }

    if (collectionAddress) {
      return ALGOLIA_COLLECTIONS_INDEX[APP_CHAIN_ID];
    }

    if (userAddress) {
      return ALGOLIA_USERS_INDEX[APP_CHAIN_ID];
    }
  }
  return ALGOLIA_TOKENS_INDEX[APP_CHAIN_ID];
};

const useSendAlgoliaEvent = ({
  tokenId,
  collectionAddress,
  userAddress,
  eventName,
  insightsMethodName,
}: {
  tokenId?: string;
  collectionAddress?: string;
  userAddress?: string;
  eventName: AlgoliaEventNames;
  insightsMethodName: keyof SupportedInsightMethods;
}) => {
  const router = useRouter();
  const { queryID, queryIndex } = router.query;

  const index = getIndex({ collectionAddress, tokenId, userAddress, queryIndex: queryIndex as string | undefined });
  const objectId = getObjectId({ collectionAddress, tokenId, userAddress, index });

  const sendEvent = useCallback(() => {
    let userToken;
    // Get Algolia user token
    SearchInsights("getUserToken", null, (err, algoliaUserToken) => {
      if (err) {
        console.error(err);
        return;
      }
      userToken = algoliaUserToken;
    });
    // Send AfterSearch event if Algolia queryID exists
    if (queryID) {
      SearchInsights(`${insightsMethodName}AfterSearch`, {
        eventName,
        userToken,
        objectIDs: [objectId],
        index,
        queryID: queryID as string,
      });
    } else {
      // Send event without queryID
      SearchInsights(`${insightsMethodName}`, {
        eventName,
        userToken,
        objectIDs: [objectId],
        index,
      });
    }
  }, [eventName, index, insightsMethodName, objectId, queryID]);

  return sendEvent;
};

export default useSendAlgoliaEvent;
