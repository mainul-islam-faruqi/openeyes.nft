import LazyLoad from "react-lazyload";
import { useTranslation } from "react-i18next";
import { AlertTitle, AlertDescription } from "@chakra-ui/react";
import { Flex, Box } from "@chakra-ui/layout";
import { Alert, Button, Link } from "uikit";
import uniqueId from "lodash/uniqueId";
import { Text, SectionPlaceholder } from "uikit";
import { TOKENS_WITH_BIDS_PER_PAGE } from "config";
import NftOfferCollapsable from "components/OrderRows/NftOfferCollapsable";
import NftOfferCardLoadingSkeleton from "components/OrderRows/NftOfferCardLoadingSkeleton";
import { useUserTokensWithBids } from "hooks/useUserTokensWithBids";

interface Props {
  address: string;
}

export const OffersReceived: React.FC<Props> = ({ address }) => {
  const { t } = useTranslation();

  const { data: nftsRes, isFetching, isSuccess, hasNextPage, fetchNextPage } = useUserTokensWithBids(address);

  return (
    <>
      <Alert status="info" variant="left-accent-contrast" mb={4}>
        <Flex justifyContent="space-between" flexDirection={{ base: "column", md: "row" }} flexGrow={1}>
          <Box mb={{ base: 4, md: 0 }} mr={{ base: 0, md: 4 }}>
            <AlertTitle fontWeight="bold" mb={2}>
              {t("Earn LOOKS Tokens by accepting offers!")}
            </AlertTitle>
            <AlertDescription>
              <div>{t("You earn LOOKS Trading Rewards every time you sell an item on OpenEyes.nft!")}</div>
              <div>{t("Rewards are distributed once daily. (Private sales excluded)")}</div>
            </AlertDescription>
          </Box>
          <Button
            as={Link}
            href="https://docs.looksrare.org/about/rewards/trading-rewards"
            isExternal
            size="xs"
            colorScheme="gray"
            alignSelf="start"
          >
            {t("Learn More")}
          </Button>
        </Flex>
      </Alert>
      {isSuccess &&
        (nftsRes && nftsRes.length > 0 ? (
          nftsRes.map((nft) => <NftOfferCollapsable key={nft.tokenId + nft.collection.address} nft={nft} />)
        ) : (
          <SectionPlaceholder>
            <Text bold>{t("No offers found")}</Text>
          </SectionPlaceholder>
        ))}
      {isFetching && (
        <>
          {[...Array(TOKENS_WITH_BIDS_PER_PAGE)].map(() => (
            <LazyLoad key={uniqueId()} placeholder={<NftOfferCardLoadingSkeleton />} style={{ width: "100%" }}>
              <NftOfferCardLoadingSkeleton />
            </LazyLoad>
          ))}
        </>
      )}
      {hasNextPage && (
        <Flex justifyContent="center" pt={6}>
          <Button isLoading={isFetching} disabled={isFetching} onClick={() => fetchNextPage()}>
            {t("Load More")}
          </Button>
        </Flex>
      )}
    </>
  );
};
