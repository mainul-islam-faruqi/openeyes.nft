import { useState } from "react";
import { useTranslation } from "react-i18next";
import { connectStateResults } from "react-instantsearch-dom";
import { StateResultsProvided } from "react-instantsearch-core";
import { Flex, Divider, useBreakpointValue, Stack, Box } from "@chakra-ui/react";
import uniqueId from "lodash/uniqueId";
import { ChevronDown, Text } from "uikit";
import { formatHits } from "utils/algolia";
import { useSetUserProfilesFromSearchHits } from "hooks/useUserProfileDisplay";
import { TextButton } from "../../../Buttons/TextButton";
import UserHit, { UserHitPlaceholder, UserHitProps } from "./UserHit";

export const USER_HITS_FETCH_PER_PAGE = { base: 4, sm: 10 };
const USER_HITS_FIRST_RENDER = { base: 3, sm: 4 };

interface Props extends StateResultsProvided {
  onHitClick: () => void;
}

const UserResults: React.FC<Props> = ({ onHitClick, searchState, isSearchStalled, searchResults }) => {
  const { t } = useTranslation();
  const numFirstRender = useBreakpointValue({
    base: USER_HITS_FIRST_RENDER.base,
    sm: USER_HITS_FIRST_RENDER.sm,
  });
  const numLoadMore = useBreakpointValue({
    base: USER_HITS_FETCH_PER_PAGE.base,
    sm: USER_HITS_FETCH_PER_PAGE.sm,
  });
  const [numHitsToShow, setNumHitsToShow] = useState(numFirstRender || USER_HITS_FIRST_RENDER.sm);

  const hits = (searchResults?.hits || []) as UserHitProps[] | [];
  const isQueryValid = (searchState?.query && hits && hits.length > 0) || isSearchStalled; // has a query string and has results, OR is loading

  const hitsWithPositionsAndQueryID = searchResults && formatHits(hits, searchResults);

  // this fetches any new ENS names and preps the user profile cache, which is consumed in the UserHit child
  const setUserProfilesFromSearchHits = useSetUserProfilesFromSearchHits();
  setUserProfilesFromSearchHits(hits);

  const getResults = () => {
    if (isSearchStalled) {
      return (
        <>
          {[...Array(numFirstRender)].map(() => (
            <UserHitPlaceholder key={uniqueId()} />
          ))}
        </>
      );
    }
    return (
      <>
        {hitsWithPositionsAndQueryID.map((hit, i) => {
          if (i < numHitsToShow) {
            const userProps = {
              name: hit.name,
              address: hit.address,
              isVerified: hit.isVerified,
              onClick: onHitClick,
            };

            return (
              <UserHit
                key={hit.address}
                hit={hit} // required by search-insights
                {...userProps}
              />
            );
          }
        })}
      </>
    );
  };

  return (
    <>
      {isQueryValid && (
        <>
          <Box display={{ base: "block", md: "none" }}>
            <Flex flexDirection="column">
              <Box px={4}>
                <Text textStyle="detail" color="text-03">
                  {t("Profiles")}
                </Text>
              </Box>
              <Divider my={2} />
              <Stack spacing={0}>{getResults()}</Stack>
              {!isSearchStalled && hits && hits.length > numHitsToShow && (
                <Flex justifyContent="center" my={2}>
                  <TextButton
                    size="sm"
                    onClick={() => setNumHitsToShow(numLoadMore || USER_HITS_FETCH_PER_PAGE.sm)}
                    variant="ghost"
                    colorScheme="gray"
                    rightIcon={<ChevronDown />}
                    sx={{ _hover: { bg: "ui-bg" } }}
                    width="100%"
                    height={12}
                  >
                    {t("More")}
                  </TextButton>
                </Flex>
              )}
            </Flex>
          </Box>

          {/* md+ */}
          <Box display={{ base: "none", md: "block" }}>
            <Flex flexDirection="row" borderTop="1px solid" borderTopColor="border-01">
              <Box p={4} width="128px" borderRight="1px solid" borderRightColor="border-01" flexShrink={0}>
                <Text textStyle="detail" color="text-03">
                  {t("Profiles")}
                </Text>
              </Box>
              <Stack spacing={0} width="100%" py={2} minWidth={0}>
                {getResults()}
                {!isSearchStalled && hits && hits.length > numHitsToShow && (
                  <Flex justifyContent="center" width="100%" mb={2}>
                    <TextButton
                      size="sm"
                      onClick={() => setNumHitsToShow(numLoadMore || USER_HITS_FETCH_PER_PAGE.sm)}
                      variant="ghost"
                      colorScheme="gray"
                      rightIcon={<ChevronDown />}
                      sx={{ _hover: { bg: "ui-bg" } }}
                      width="100%"
                      height={12}
                    >
                      {t("More")}
                    </TextButton>
                  </Flex>
                )}
              </Stack>
            </Flex>
          </Box>
        </>
      )}
    </>
  );
};

export default connectStateResults(UserResults);
