import React from "react";
import { Flex, Box, Skeleton } from "@chakra-ui/react";
import Link from "next/link";
import { connectHitInsights } from "react-instantsearch-dom";
import { ConnectHitInsightsProvided } from "react-instantsearch-core";
import SearchInsights from "search-insights";
import { Text, VerifiedIcon } from "uikit";
import { ALGOLIA_TOKENS_INDEX } from "config/algolia";
import { APP_CHAIN_ID } from "config/chains";
import { AlgoliaEventNames } from "hooks/useSendAlgoliaEvent";
import { useOsCollectionImages } from "views/collections/components/hooks/useOsCollectionImages";
import { Avatar } from "components/Avatar";

export type CollectionHitProps = {
  name: string;
  address: string;
  isVerified: boolean;
  isExplicit: boolean;
};

interface Props extends ConnectHitInsightsProvided, CollectionHitProps {
  onClick: () => void;
}

const CollectionHit: React.FC<Props> = ({ onClick, name, isVerified, address, insights, hit }) => {
  // This code is temporary and is mitigated on our end by 24 hr caching
  const osCollectionImagesQuery = useOsCollectionImages(address);
  const logoImg = (osCollectionImagesQuery.isSuccess && osCollectionImagesQuery.data.logo) || undefined;

  return (
    <Box minWidth={0}>
      <Link href={`/collections/${address}?queryID=${hit.__queryID}&queryIndex=${ALGOLIA_TOKENS_INDEX[APP_CHAIN_ID]}`}>
        <a
          onClick={() => {
            onClick();
            insights("clickedObjectIDsAfterSearch", {
              eventName: AlgoliaEventNames.COLLECTION_HIT_CLICKED,
            });
          }}
        >
          <Flex
            px={4}
            py={2}
            alignItems="center"
            transition="background 200ms ease"
            sx={{ _hover: { bg: "ui-bg" } }}
            minHeight={12}
          >
            <Avatar borderRadius="4px" address={address} src={logoImg?.src} size={32} mr={4} flexShrink={0} />
            <Flex overflow="hidden" flexDirection="column">
              <Flex alignItems="center">
                <Text textStyle="detail" bold wordBreak="break-all">
                  {name}
                </Text>
                {isVerified && <VerifiedIcon boxSize={4} ml={1} />}
              </Flex>
            </Flex>
          </Flex>
        </a>
      </Link>
    </Box>
  );
};

export default connectHitInsights(SearchInsights)(CollectionHit);

export const CollectionHitPlaceholder = () => (
  <Box minWidth={0}>
    <Flex px={4} py={2} alignItems="center">
      <Skeleton rounded="4px" width="32px" height="32px" mr={4} />
      <Flex flexDirection="column">
        <Skeleton height="14px" my="3px" width="84px" />
        <Skeleton height="0.75rem" mt={1.5} mb={0.5} width="92px" />
      </Flex>
    </Flex>
  </Box>
);
