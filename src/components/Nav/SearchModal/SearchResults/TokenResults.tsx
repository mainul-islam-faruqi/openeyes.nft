import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { connectStateResults } from "react-instantsearch-dom";
import { StateResultsProvided } from "react-instantsearch-core";
import { Flex, Divider, useBreakpointValue, Box, Stack } from "@chakra-ui/react";
import uniqueId from "lodash/uniqueId";
import { ChevronDown, Text } from "uikit";
import { formatHits } from "utils/algolia";
import { TextButton } from "../../../Buttons/TextButton";
import TokenHit, { TokenHitPlaceholder, TokenHitProps } from "./TokenHit";

export const TOKEN_HITS_FETCH_PER_PAGE = { base: 4, sm: 10 };
const TOKEN_HITS_FIRST_RENDER = { base: 3, sm: 4 };

interface Props extends StateResultsProvided {
  onHitClick: () => void;
}

const TokenResults: React.FC<Props> = ({ onHitClick, searchState, isSearchStalled, searchResults }) => {
  const { t } = useTranslation();
  const numPlaceholdersToShow = useBreakpointValue({
    base: TOKEN_HITS_FIRST_RENDER.base,
    sm: TOKEN_HITS_FIRST_RENDER.sm,
  });
  const numLoadMore = useBreakpointValue({
    base: TOKEN_HITS_FETCH_PER_PAGE.base,
    sm: TOKEN_HITS_FETCH_PER_PAGE.sm,
  });

  const [numHitsToShow, setNumHitsToShow] = useState(numPlaceholdersToShow || TOKEN_HITS_FIRST_RENDER.sm);

  const hits = searchResults?.hits as TokenHitProps[] | [];
  const isQueryValid = (searchState?.query && hits && hits.length > 0) || isSearchStalled; // has a query string and has results, OR is loading

  const hitsWithPositionsAndQueryID = searchResults && formatHits(hits, searchResults);

  const getResults = () => {
    if (isSearchStalled) {
      return (
        <>
          {[...Array(numPlaceholdersToShow)].map(() => (
            <TokenHitPlaceholder key={uniqueId()} />
          ))}
        </>
      );
    }
    return (
      <>
        {hitsWithPositionsAndQueryID.map((hit, i) => {
          if (i < numHitsToShow) {
            const tokenProps = {
              name: hit.name,
              tokenId: hit.tokenId,
              image: hit.image,
              collection: hit.collection,
              onClick: onHitClick,
            };

            return (
              <TokenHit
                key={hit.image}
                hit={hit} // required by search-insights
                {...tokenProps}
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
          {/* Mobile thru md */}
          <Box display={{ base: "block", md: "none" }}>
            <Flex flexDirection="column">
              <Box px={4}>
                <Text textStyle="detail" color="text-03">
                  {t("Items")}
                </Text>
              </Box>
              <Divider my={2} />
              <Stack spacing={0}>
                {getResults()}
                {!isSearchStalled && hits && hits.length > numHitsToShow && (
                  <Flex justifyContent="center" width="100%">
                    <TextButton
                      size="sm"
                      onClick={() => setNumHitsToShow(numLoadMore || TOKEN_HITS_FETCH_PER_PAGE.sm)}
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

          {/* md+ */}
          <Box display={{ base: "none", md: "block" }}>
            <Flex flexDirection="row" borderTop="1px solid" borderTopColor="border-01">
              <Box p={4} width="128px" borderRight="1px solid" borderRightColor="border-01" flexShrink={0}>
                <Text textStyle="detail" color="text-03">
                  {t("Items")}
                </Text>
              </Box>
              <Stack spacing={0} width="100%" py={2} minWidth={0}>
                {getResults()}
                {!isSearchStalled && hits && hits.length > numHitsToShow && (
                  <Flex justifyContent="center" width="100%" mb={2}>
                    <TextButton
                      size="sm"
                      onClick={() => setNumHitsToShow(numLoadMore || TOKEN_HITS_FETCH_PER_PAGE.sm)}
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

export default connectStateResults(TokenResults);
