import React, { useState } from "react";
import { Flex, Divider, useBreakpointValue, Stack, Box } from "@chakra-ui/react";
import { connectStateResults } from "react-instantsearch-dom";
import { StateResultsProvided } from "react-instantsearch-core";
import uniqueId from "lodash/uniqueId";
import { useTranslation } from "react-i18next";
import { ChevronDown, Text } from "uikit";
import { TextButton } from "../../../Buttons/TextButton";
import { formatHits } from "utils/algolia";
import CollectionHit, { CollectionHitPlaceholder, CollectionHitProps } from "./CollectionHit";

export const COLLECTION_HITS_FETCH_PER_PAGE = { base: 4, sm: 10 };
const COLLECTION_HITS_FIRST_RENDER = { base: 3, sm: 4 };

interface Props extends StateResultsProvided {
  onHitClick: () => void;
}

const CollectionsResults: React.FC<Props> = ({ onHitClick, isSearchStalled, searchState, searchResults }) => {
  const { t } = useTranslation();
  const numFirstRender = useBreakpointValue({
    base: COLLECTION_HITS_FIRST_RENDER.base,
    sm: COLLECTION_HITS_FIRST_RENDER.sm,
  });
  const numLoadMore = useBreakpointValue({
    base: COLLECTION_HITS_FETCH_PER_PAGE.base,
    sm: COLLECTION_HITS_FETCH_PER_PAGE.sm,
  });
  const [numHitsToShow, setNumHitsToShow] = useState(numFirstRender || COLLECTION_HITS_FIRST_RENDER.sm);

  const hits = searchResults?.hits as CollectionHitProps[] | [];
  const isQueryValid = (searchState?.query && hits && hits.length > 0) || isSearchStalled; // has a query string and has hits, OR is loading

  const hitsWithPositionsAndQueryID = searchResults && formatHits(hits, searchResults);

  const getResults = () => {
    if (isSearchStalled) {
      return (
        <>
          {[...Array(numFirstRender)].map(() => (
            <CollectionHitPlaceholder key={uniqueId()} />
          ))}
        </>
      );
    }
    return (
      <>
        {hitsWithPositionsAndQueryID.map((hit, i) => {
          if (i < numHitsToShow) {
            const collectionProps = {
              name: hit.name,
              address: hit.address,
              isVerified: hit.isVerified,
              isExplicit: hit.isExplicit,
              onClick: onHitClick,
            };

            return <CollectionHit key={hit.address} hit={hit} {...collectionProps} />;
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
                  {t("Collections")}
                </Text>
              </Box>
              <Divider my={2} />
              <Stack spacing={0}>
                {getResults()}
                {!isSearchStalled && hits && hits.length > numHitsToShow && (
                  <Flex justifyContent="center" width="100%">
                    <TextButton
                      size="sm"
                      onClick={() => setNumHitsToShow(numLoadMore || COLLECTION_HITS_FETCH_PER_PAGE.sm)}
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
                  {t("Collections")}
                </Text>
              </Box>
              <Stack spacing={0} width="100%" py={2} minWidth={0}>
                {getResults()}
                {!isSearchStalled && hits && hits.length > numHitsToShow && (
                  <Flex justifyContent="center" width="100%" mb={2}>
                    <TextButton
                      size="sm"
                      onClick={() => setNumHitsToShow(numLoadMore || COLLECTION_HITS_FETCH_PER_PAGE.sm)}
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

export default connectStateResults(CollectionsResults);
