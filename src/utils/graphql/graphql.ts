import request from "graphql-request";
import { currentChainInfo } from "config/chains";

/**
 * General wrapper around requests to the api & subgraph to centralize error handling
 *
 * @param query GraphQL query
 * @param params GraphQL params (via the gql function)
 * @param requestHeaders HeadersInit
 * @param url string url to query
 */
export const graphql = async (
  query: string,
  params?: Record<string, any>,
  requestHeaders?: HeadersInit,
  url = currentChainInfo.apiUrl
) => {
  try {
    const res = await request(url, query, params, requestHeaders);
    return res;
  } catch (error: any) {
    // If the API error returned is somewhow different than what we expect
    // throw whatever came back.
    if (!error || !error?.response) {
      throw error;
    }

    throw error.response;
  }
};
