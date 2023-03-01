import { SearchResults, Hit } from "react-instantsearch-core";

// https://github.com/algolia/react-instantsearch/blob/6f868ee388bb47ba0ef1cea3e15e658f1859fe9d/packages/react-instantsearch-core/src/core/utils.ts#L66
export const addAbsolutePositions = (hits: any[], hitsPerPage: number, page: number) => {
  return hits.map((hit, index) => ({
    ...hit,
    __position: hitsPerPage * page + index + 1,
  }));
};

// https://github.com/algolia/react-instantsearch/blob/6f868ee388bb47ba0ef1cea3e15e658f1859fe9d/packages/react-instantsearch-core/src/core/utils.ts#L73
export const addQueryID = (hits: any[], queryID?: string) => {
  if (!queryID) {
    return hits;
  }
  return hits.map((hit) => ({
    ...hit,
    __queryID: queryID,
  }));
};

/**
 * https://github.com/algolia/react-instantsearch/issues/3085
 *
 * When using connectStateResults (which we use to access searchState in all of our results components), Algolia clickAnalytics is unable to infer the queryID.
 * This function helps construct complete hit objects so that they can be used for Algolia events and clickAnalytics
 */
export const formatHits = (hits: any[], searchResults: SearchResults): Hit[] => {
  const hitsWithPositions = addAbsolutePositions(hits, searchResults.hitsPerPage, searchResults.page);
  const hitsWithPositionsAndQueryID = addQueryID(hitsWithPositions, searchResults.queryID);
  return hitsWithPositionsAndQueryID;
};
