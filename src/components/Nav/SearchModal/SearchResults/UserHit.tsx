import { Flex, Box, Skeleton } from "@chakra-ui/react";
import { connectHitInsights } from "react-instantsearch-dom";
import { ConnectHitInsightsProvided } from "react-instantsearch-core";
import Link from "next/link";
import SearchInsights from "search-insights";
import { Text, VerifiedIcon } from "uikit";
import { APP_CHAIN_ID } from "config/chains";
import { ALGOLIA_USERS_INDEX } from "config/algolia";
import { useUserProfileDisplay } from "hooks/useUserProfileDisplay";
import { AlgoliaEventNames } from "hooks/useSendAlgoliaEvent";
import { Avatar } from "components/Avatar";

export type UserHitProps = {
  name: string;
  address: string;
  isVerified: boolean;
};

interface Props extends ConnectHitInsightsProvided, UserHitProps {
  onClick: () => void;
}

export const UserHitPlaceholder = () => (
  <Box minWidth={0}>
    <Flex px={4} py={1.5} alignItems="center">
      <Skeleton rounded="50%" width="32px" height="32px" mr={4} />
      <Flex flexDir="column">
        <Skeleton height="14px" my="3px" width="48px" />
        <Skeleton height="0.75rem" mt={1.5} mb={0.5} width="92px" />
      </Flex>
    </Flex>
  </Box>
);

const UserHit: React.FC<Props> = ({ name, address, isVerified, onClick, insights, hit }) => {
  const userProfileDisplayQuery = useUserProfileDisplay(address);

  return (
    <Box minWidth={0}>
      <Link href={`/accounts/${address}?queryID=${hit.__queryID}&queryIndex=${ALGOLIA_USERS_INDEX[APP_CHAIN_ID]}`}>
        <a
          onClick={() => {
            onClick();
            insights("clickedObjectIDsAfterSearch", {
              eventName: AlgoliaEventNames.USER_HIT_CLICKED,
            });
          }}
        >
          <Flex px={4} py={1.5} alignItems="center" transition="background 200ms ease" sx={{ _hover: { bg: "ui-bg" } }}>
            <Box flexShrink={0}>
              <Avatar src={userProfileDisplayQuery.data?.image?.src} address={address} size={32} mr={4} />
            </Box>
            <Flex flexDirection="column" overflow="hidden">
              <Flex alignItems="center">
                <Text textStyle="detail" bold wordBreak="break-all">
                  {name || address}
                </Text>
                {isVerified && <VerifiedIcon boxSize={4} ml={1} />}
              </Flex>
              {(name || userProfileDisplayQuery.data?.ensDomain) && (
                <Text color="text-03" textStyle="helper" wordBreak="break-all">
                  {userProfileDisplayQuery.data?.ensDomain || address}
                </Text>
              )}
            </Flex>
          </Flex>
        </a>
      </Link>
    </Box>
  );
};

export default connectHitInsights(SearchInsights)(UserHit);
