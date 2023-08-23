import React from "react";
import Link from "next/link";
import { Flex, Skeleton, Box } from "@chakra-ui/react";
import { CHAIN_INFO } from "@looksrare/sdk";
import { ConnectHitInsightsProvided } from "react-instantsearch-core";
import { connectHitInsights } from "react-instantsearch-dom";
import SearchInsights from "search-insights";
import { Text, VerifiedIcon } from "uikit";
import { APP_CHAIN_ID } from "config/chains";
import { ALGOLIA_TOKENS_INDEX } from "config/algolia";
import { AlgoliaEventNames } from "hooks/useSendAlgoliaEvent";
import { Avatar } from "components/Avatar";

export type TokenHitProps = {
  name: string;
  tokenId: string;
  image: string;
  collection: {
    name: string;
    address: string;
    isVerified: string;
    isExplicit: string;
  };
};

interface Props extends ConnectHitInsightsProvided, TokenHitProps {
  onClick: () => void;
}

const TokenHit: React.FC<Props> = ({ onClick, name, collection, image, tokenId, insights, hit }) => {
  const src = `${CHAIN_INFO[APP_CHAIN_ID].cdnUrl}/${image}`;

  return (
    <Box minWidth={0}>
      <Link
        href={`/collections/${collection.address}/${tokenId}?queryID=${hit.__queryID}&queryIndex=${ALGOLIA_TOKENS_INDEX[APP_CHAIN_ID]}`}
      >
        <a
          onClick={() => {
            onClick();
            insights("clickedObjectIDsAfterSearch", {
              eventName: AlgoliaEventNames.TOKEN_HIT_CLICKED,
            });
          }}
        >
          <Flex px={4} py={1.5} alignItems="center" transition="background 200ms ease" sx={{ _hover: { bg: "ui-bg" } }}>
            <Avatar borderRadius="4px" src={src} address={image} size={32} mr={4} flexShrink={0} />
            <Flex textStyle="detail" overflow="hidden" flexDirection="column">
              <Text textStyle="detail" bold wordBreak="break-all">
                {name}
              </Text>
              {collection && (
                <Flex alignItems="center">
                  <Text color="text-03" textStyle="helper" wordBreak="break-all">
                    {collection.name}
                  </Text>
                  {collection.isVerified && <VerifiedIcon boxSize={3} ml={1} />}
                </Flex>
              )}
            </Flex>
          </Flex>
        </a>
      </Link>
    </Box>
  );
};

export default connectHitInsights(SearchInsights)(TokenHit);

export const TokenHitPlaceholder = () => (
  <Box minWidth={0}>
    <Flex px={4} py={1.5} alignItems="center">
      <Skeleton width="32px" height="32px" mr={4} />
      <Flex flexDirection="column">
        <Skeleton height="14px" my="3px" width="84px" />
        <Skeleton height="0.75rem" mt={1.5} mb={0.5} />
      </Flex>
    </Flex>
  </Box>
);
