import algoliasearch from "algoliasearch";
import { Configure, InstantSearch as AlgoliaInstantSearch } from "react-instantsearch-dom";
import { MultipleQueriesQuery } from "@algolia/client-search";
import { APP_CHAIN_ID } from "config/chains";
import { ALGOLIA_COLLECTIONS_INDEX } from "config/algolia";

const algoliaClient = algoliasearch(process.env.ALGOLIA_APP_ID || "", process.env.ALGOLIA_SEARCH_API_KEY || "");

// @ts-ignore
const AlgoliaSearchClient: React.FC = ({ children }) => {
  /**
   * Custom search resolver to prevent searches when the request query is an empty string
   */
  const searchClient = {
    ...algoliaClient,
    search(requests: MultipleQueriesQuery[]) {
      if (requests.every((request) => !request.params?.query)) {
        return Promise.resolve({
          results: requests.map(() => ({
            hits: [],
            nbHits: 0,
            nbPages: 0,
            page: 0,
            processingTimeMS: 0,
          })),
        });
      }

      return algoliaClient.search(requests);
    },
  };

  return (
    <AlgoliaInstantSearch searchClient={searchClient} indexName={ALGOLIA_COLLECTIONS_INDEX[APP_CHAIN_ID]}>
      <Configure clickAnalytics />
      {children}
    </AlgoliaInstantSearch>
  );
};

export default AlgoliaSearchClient;
