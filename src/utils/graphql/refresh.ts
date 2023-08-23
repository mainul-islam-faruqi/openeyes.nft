import { gql } from "graphql-request";
import { getAuthCookie } from "utils/cookies";
import { graphql } from "./graphql";

interface ReturnType {
  message: string;
  success: boolean;
}

export const refreshNft = async (collectionAddress: string, tokenId: string): Promise<ReturnType> => {
  const query = gql`
    mutation RefreshTokenMutation($tokenId: String!, $collection: Address!) {
      refreshToken(tokenId: $tokenId, collection: $collection) {
        success
        message
      }
    }
  `;

  const data = {
    tokenId,
    collection: collectionAddress,
  };

  const res: { refreshToken: ReturnType } = await graphql(query, data);
  return res.refreshToken;
};

export const refreshCollection = async (address: string, collectionAddress: string): Promise<ReturnType> => {
  const query = gql`
    mutation RefreshCollectionMutation($collection: Address!) {
      refreshCollection(collection: $collection) {
        success
        message
      }
    }
  `;

  const data = {
    collection: collectionAddress,
  };

  const authCookie = getAuthCookie(address);
  const requestHeaders = {
    Authorization: `Bearer ${authCookie}`,
  };

  const res: { refreshCollection: ReturnType } = await graphql(query, data, requestHeaders);
  return res.refreshCollection;
};
