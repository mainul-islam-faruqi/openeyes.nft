import { Flex, Stack, useBreakpointValue } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { Index, Configure, connectStateResults } from "react-instantsearch-dom";
import { StateResultsProvided } from "react-instantsearch-core";
import { ALGOLIA_COLLECTIONS_INDEX, ALGOLIA_TOKENS_INDEX, ALGOLIA_USERS_INDEX } from "config/algolia";
import { APP_CHAIN_ID } from "config/chains";
// import { SectionPlaceholder, Text } from "uikit";
import { Text } from "uikit";
import TokenResults, { TOKEN_HITS_FETCH_PER_PAGE } from "./TokenResults";
import CollectionResults, { COLLECTION_HITS_FETCH_PER_PAGE } from "./CollectionResults";
import UserResults, { USER_HITS_FETCH_PER_PAGE } from "./UserResults";

interface Props extends StateResultsProvided {
  onClose: () => void;
}

const SearchResults: React.FC<Props> = ({ onClose, searchState, isSearchStalled, allSearchResults }) => {
  const { t } = useTranslation();

  const numTokensToFetch = useBreakpointValue({
    base: TOKEN_HITS_FETCH_PER_PAGE.base,
    sm: TOKEN_HITS_FETCH_PER_PAGE.sm,
  });
  const numCollectionsToFetch = useBreakpointValue({
    base: COLLECTION_HITS_FETCH_PER_PAGE.base,
    sm: COLLECTION_HITS_FETCH_PER_PAGE.sm,
  });
  const numUsersToFetch = useBreakpointValue({
    base: USER_HITS_FETCH_PER_PAGE.base,
    sm: USER_HITS_FETCH_PER_PAGE.sm,
  });

  const collectionsResults = allSearchResults && allSearchResults[ALGOLIA_COLLECTIONS_INDEX[APP_CHAIN_ID]];
  const tokensResults = allSearchResults && allSearchResults[ALGOLIA_TOKENS_INDEX[APP_CHAIN_ID]];
  const usersResults = allSearchResults && allSearchResults[ALGOLIA_USERS_INDEX[APP_CHAIN_ID]];
  const noHits =
    searchState.query &&
    !isSearchStalled &&
    collectionsResults?.nbHits === 0 &&
    usersResults?.nbHits === 0 &&
    tokensResults?.nbHits === 0; // has a query string, isn't loading and all queries' nbHits = 0

  return (
    <Flex flexDirection="column">
      {!searchState.query ? (
        <Text textStyle="detail" py={6} px={4}>
          {t("Start typing...")}
        </Text>
      ) : (
        <>
          {/* {noHits && (
            <SectionPlaceholder py={16}>
              <Text bold>{t("No results found")}</Text>
            </SectionPlaceholder>
          )} */}
          <Stack spacing={0}>
            <Index indexName={ALGOLIA_COLLECTIONS_INDEX[APP_CHAIN_ID]}>
              <Configure hitsPerPage={numCollectionsToFetch} />
              <CollectionResults onHitClick={onClose} />
            </Index>
            <Index indexName={ALGOLIA_USERS_INDEX[APP_CHAIN_ID]}>
              <Configure hitsPerPage={numUsersToFetch} />
              <UserResults onHitClick={onClose} />
            </Index>
            <Index indexName={ALGOLIA_TOKENS_INDEX[APP_CHAIN_ID]}>
              <Configure hitsPerPage={numTokensToFetch} />
              <TokenResults onHitClick={onClose} />
            </Index>
          </Stack>
        </>
      )}
    </Flex>
  );
};

export default connectStateResults(SearchResults);
