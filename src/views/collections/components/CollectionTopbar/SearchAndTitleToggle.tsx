import { useState } from "react";
import { Box, Fade, Flex, IconButton } from "@chakra-ui/react";
import { GemIcon, SearchIcon, Text } from "uikit";
import { Collection } from "types/graphql";
import { Avatar } from "components/Avatar";
import VerifiedButton from "components/Modals/VerifiedModal/VerifiedButton";
import { WatchlistStarButton } from "components/Buttons";
import { CollectionSearch } from "./CollectionSearch";

type SearchProps = Pick<Collection, "address" | "logo" | "name" | "isVerified" | "isEligible">;

export const SearchAndTitleToggle = ({ address, name, isVerified, isEligible, logo }: SearchProps) => {
  const [showSearch, setShowSearch] = useState(false);

  const handleClearSuccess = () => {
    setShowSearch(false);
  };

  return (
    <Flex position="relative" width="100%">
      <IconButton
        variant="outline"
        colorScheme="gray"
        aria-label="show search"
        onClick={() => setShowSearch(true)}
        mr={3}
      >
        <SearchIcon />
      </IconButton>
      <Fade in={!showSearch} unmountOnExit>
        <Flex alignItems="center" height="100%" width="100%">
          <Avatar borderRadius="button" src={logo?.src} size={32} address={address} priority mr={2} />
          <Flex alignItems="center">
            <Text bold textStyle="body" as="h1" color="text-02" noOfLines={1} title={name}>
              {name}
            </Text>
            <VerifiedButton isVerified={isVerified} buttonProps={{ ml: 1 }} />
            {isEligible && <GemIcon boxSize={5} ml={1} />}
            <WatchlistStarButton
              collectionAddress={address}
              isCollectionPage
              size="sm"
              ml={1}
              data-id="collection-topbar-watchlist-star"
            />
          </Flex>
        </Flex>
      </Fade>
      <Fade in={showSearch} unmountOnExit>
        <Box position="absolute" top={0} left={0} width="100%" height="100%">
          <CollectionSearch showCustomClearButton onClearSuccess={handleClearSuccess} autoFocus />
        </Box>
      </Fade>
    </Flex>
  );
};
