import { Box, Flex, FlexProps, Grid, GridItem, Skeleton } from "@chakra-ui/react";
import { BigNumber } from "ethers";
import Link from "next/link";
import { Trans } from "next-i18next";
import { EthHalfIcon, HelpIcon, LogoPolygonIcon, Text, VerifiedIcon } from "uikit";
import { Avatar } from "components/Avatar";
import { useOsCollectionImages } from "views/collections/components/hooks/useOsCollectionImages";
import { CollectionLeaderboard } from "utils/graphql/collection";
import { useCoinPrices } from "hooks/useCoinPrices";
import { formatNumberToLocale, formatToSignificant, fromDecimals } from "utils/format";

interface CollectionAmountDisplayProps {
  label: string;
  total: string;
}

export const CollectionAmountDisplay = ({ label, total }: CollectionAmountDisplayProps) => (
  <Box display="inline-block">
    <Text color="text-03" textStyle="helper" mb={1}>
      {label}
    </Text>
    <Flex alignItems="center">
      <EthHalfIcon boxSize={14} height={4} width={2} />
      <Text textStyle="detail" color="text-02" mx={1}>
        {total}
      </Text>
      <HelpIcon boxSize={4} color="text-03" />
    </Flex>
  </Box>
);

interface ListingRewardDisplayProps extends FlexProps {
  points: number;
}

const ListingRewardDisplay = ({ points, ...props }: ListingRewardDisplayProps) => (
  <Trans i18nKey="listingReward24hsCollectionPointsPerListing">
    <Flex alignItems="center" {...props}>
      <LogoPolygonIcon color="purple.400" boxSize={4} mr={1} />
      <Text as="span" textStyle="detail" mr={1}>
        {/* {{ points }} */}
      </Text>
      <Text as="span" textStyle="helper" color="text-03">
        per listing
      </Text>
    </Flex>
  </Trans>
);

interface CollectionAvatarProps {
  collection: CollectionLeaderboard;
}

export const CollectionAvatar = ({ collection }: CollectionAvatarProps) => {
  const { isVerified, address, name, logo, points } = collection;
  const osCollectionImagesQuery = useOsCollectionImages(address, { enabled: !logo });
  const logoImg = (() => {
    if (logo) {
      return logo;
    }

    if (osCollectionImagesQuery.isSuccess && osCollectionImagesQuery.data.logo) {
      return osCollectionImagesQuery.data.logo;
    }

    return undefined;
  })();

  return (
    <Link href={`/collections/${address}`} passHref>
      <Flex as="a" alignItems="center">
        <Avatar size={40} src={logoImg?.src} address={address} mr={2} flexShrink={0} borderRadius="4px" />
        <Box>
          <Text as="span" textStyle="detail" bold mr={1}>
            {name}
          </Text>
          {isVerified && <VerifiedIcon boxSize={4} />}
          {points && <ListingRewardDisplay points={points} />}
        </Box>
      </Flex>
    </Link>
  );
};

export const ListingRewardLeaderRowSkeleton = () => (
  <Grid
    gridColumnGap={4}
    gridTemplateColumns={{ base: "24px 1fr 1fr auto", md: "24px 2fr 1fr 1fr 96px" }}
    py={6}
    borderBottom="1px solid"
    borderBottomColor="border-01"
    height="93px"
  >
    <GridItem>
      <Flex height={10} alignItems="center">
        <Skeleton width={5} height={5} />
      </Flex>
    </GridItem>
    <GridItem>
      <Flex>
        <Skeleton height={10} width={10} mr={2} />
        <Box>
          <Skeleton width="130px" height={4} mb={1} />
          <Skeleton width="80px" height={4} />
        </Box>
      </Flex>
    </GridItem>
    <GridItem>
      <Skeleton width="60px" height={4} mb={2} />
      <Skeleton width="80px" height={4} />
    </GridItem>
    <GridItem>
      <Skeleton width="60px" height={4} mb={2} />
      <Skeleton width="80px" height={4} />
    </GridItem>
    <GridItem>
      <Skeleton height={10} width="100%" />
    </GridItem>
  </Grid>
);

export const LooksRewardSkeleton = () => (
  <Flex alignItems="center">
    <Skeleton height={5} width={5} borderRadius="50%" mr={2} />
    <Skeleton height={4} width="80px" mr={2} />
    <Skeleton height={3} width="40px" />
  </Flex>
);

interface TokenWithPriceDisplayProps {
  amount?: BigNumber;
}

export const TokenWithPriceDisplay = ({ amount }: TokenWithPriceDisplayProps) => {
  const tokenPriceQuery = useCoinPrices();
  const amountInUsd =
    amount && tokenPriceQuery.isSuccess ? parseFloat(fromDecimals(amount)) * tokenPriceQuery.data.looks : 0;
  return (
    <Flex alignItems="center">
      <Text textStyle="detail" color="text-02" bold>
        {amount ? formatToSignificant(amount, 8) : "-"}
      </Text>
      {tokenPriceQuery.isLoading && <Skeleton height={4} width={10} />}
      {tokenPriceQuery.isSuccess && (
        <Text color="text-03" textStyle="helper" ml={1}>
          {`($${formatNumberToLocale(amountInUsd, 2, 2)})`}
        </Text>
      )}
    </Flex>
  );
};
