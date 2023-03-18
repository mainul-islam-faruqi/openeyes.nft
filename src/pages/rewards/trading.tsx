import { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { NextSeo } from "next-seo";
import { dehydrate, QueryClient } from "react-query";
import { currentChainInfo } from "config/chains";
import { headers } from "config/server";
import { getCollectionLeaderboard } from "utils/graphql";
import { TradingView } from "views/rewards/TradingView";
import { collectionsKeys } from "hooks/graphql/collections";

const RewardsPage = () => {
  const { t } = useTranslation();
  return (
    <>
      <NextSeo
        title={t("Rewards")}
        openGraph={{
          title: t("{{pageTitle}} | OpenEyes.nft", { pageTitle: t("Rewards") }),
          url: `${currentChainInfo.appUrl}/rewards`,
        }}
      />
      <TradingView />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale, res }) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(collectionsKeys.collectionLeadboard(), () => getCollectionLeaderboard(headers));

  res.setHeader("Cache-Control", "public, s-maxage=15, stale-while-revalidate=60");
  return {
    props: {
      ...(await serverSideTranslations(locale!, ["common"])),
      locale,
      // Known issue with serializing undefined pageParams[0] in infiniteQuery prefetch https://github.com/tannerlinsley/react-query/issues/1458
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
};

export default RewardsPage;
