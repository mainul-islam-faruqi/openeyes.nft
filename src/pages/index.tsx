import { NextSeo } from "next-seo";
import orderBy from "lodash/orderBy";
import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { APP_CHAIN_ID } from "config/chains";
import { COLLECTIONS_TO_FETCH_FOR_HOME } from "config/constants";
// import { headers } from "config/server";
import { CollectionsParams, getCollectionsBase } from "utils/graphql/collection";
import { CollectionBase, CollectionsSort, TokenFlag, TokensSort } from "types/graphql";
import useLocalStorageSnooze from "hooks/useLocalStorageSnooze";
import { useTokens } from "hooks/graphql/tokens";
import { useEagerConnect } from "hooks/useEagerConnect";
import HomeView from "views/home";
import { ListingRewardBanner } from "views/rewards/components/ListingRewards/ListingRewardBanner";
import Page from "components/Layout/Page";

interface Props {
  topCollections: CollectionBase[];
}

const Home: React.FC<Props> = ({ topCollections }) => {
  const { t } = useTranslation();
  const hasTriedConnection = useEagerConnect();
  const { isSnoozed, handleSnooze } = useLocalStorageSnooze({
    baseKey: "listing-reward-banner",
    duration: { months: 1 },
  });
  const [topCollectionByChange24] = orderBy(topCollections, (collection) => collection.volume.change24h || 0, ["desc"]);

  const trendingNftQuery = useTokens({
    filter: {
      collection: topCollectionByChange24?.address,
      flag: [TokenFlag.NONE, TokenFlag.TRIAGE],
    },
    pagination: { first: 1 },
    sort: TokensSort.LAST_RECEIVED,
    ownerFilter: { addresses: [] },
  });

  return (
    // @ts-ignore
    <Page>
      <NextSeo
        title={t("OpenEyes.nft - NFT Marketplace")}
        openGraph={{
          title: t("OpenEyes.nft - NFT Marketplace"),
        }}
      />
      {hasTriedConnection && !isSnoozed && <ListingRewardBanner onDismiss={handleSnooze} />}
      <HomeView trendingNft={trendingNftQuery.data && trendingNftQuery.data[0]} topCollections={topCollections} />
    </Page>
  );
};

const COLLECTIONS_PARAMS: CollectionsParams = {
  pagination: { first: COLLECTIONS_TO_FETCH_FOR_HOME },
  sort: CollectionsSort.HIGHEST_24H,
  filter: { isVerified: true, isWithRoyalty: APP_CHAIN_ID === 31337 ? false : true }, // don't apply isWithRoyalty on hardhat
};

// export const getStaticProps: GetStaticProps = async ({ locale }) => {
//   // const topCollections = await getCollectionsBase(COLLECTIONS_PARAMS, headers);
//   const topCollections:any = [];

//   try {
//     return {
//       props: {
//         topCollections,
//         ...(await serverSideTranslations(locale!, ["common"])),
//         locale,
//       },
//       revalidate: 600, // 10 mins
//     };
//   } catch {
//     return {
//       props: {
//         ...(await serverSideTranslations(locale!, ["common"])),
//         locale,
//       },
//     };
//   }
// };
export default Home;
