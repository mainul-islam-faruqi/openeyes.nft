import { GetStaticProps } from "next";
import { NextSeo } from "next-seo";
import { dehydrate, QueryClient } from "react-query";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { headers } from "config/server";
import { currentChainInfo } from "config/chains";
import { getCollectionsBase } from "utils/graphql";
import { CollectionsSort } from "types/graphql";
import { collectionsKeys } from "hooks/graphql/collections";
import CollectionsView from "views/collections/CollectionsView";
import Page from "components/Layout/Page";

const CollectionsPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Page>
      <NextSeo
        title={t("Collections")}
        openGraph={{
          title: t("{{pageTitle}} | OpenEyes.nft", { pageTitle: t("Collections") }),
          url: `${currentChainInfo.appUrl}/collections`,
        }}
      />
      <CollectionsView />
    </Page>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const queryClient = new QueryClient();
  try {
    await queryClient.prefetchInfiniteQuery(
      collectionsKeys.infiniteCollections({ isVerified: true }, CollectionsSort.HIGHEST_24H, "base"),
      () => getCollectionsBase({ filter: { isVerified: true }, sort: CollectionsSort.HIGHEST_24H }, headers)
    );

    return {
      props: {
        ...(await serverSideTranslations(locale!, ["common"])),
        locale,
        // Known issue with serializing undefined pageParams[0] in infiniteQuery prefetch https://github.com/tannerlinsley/react-query/issues/1458
        dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }
};

export default CollectionsPage;
