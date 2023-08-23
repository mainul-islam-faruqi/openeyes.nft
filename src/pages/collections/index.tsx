import { FC, PropsWithChildren } from "react";
import { GetStaticProps } from "next";
import { NextSeo } from "next-seo";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { headers } from "config/server";
import { getCollectionsBase } from "utils/graphql";
import { CollectionBase } from "types/graphql";
import { PageDataFetchError } from "utils/errors";
import CollectionsView from "views/collections/CollectionsView";
import Page from "components/Layout/Page";
import { RealtimeDataStatusProvider } from "components/RealtimeData/context";
import { getCanonicalAndLanguageAlternates } from "config/seo";
import { DEFAULT_IS_VERIFIED, DEFAULT_SORT, DEFAULT_TERM } from "views/collections/shared";
import { COLLECTIONS_PAGINATION_FIRST } from "hooks/graphql/collections";

type Props = {
  collections: CollectionBase[];
};
const CollectionsPage: FC<PropsWithChildren<Props>> = ({ collections }) => {
  const { t } = useTranslation();
  const router = useRouter();

  const { canonical, languageAlternates } = getCanonicalAndLanguageAlternates("/collections", router);

  return (
    <Page>
      <NextSeo
        title={t("Collections")}
        openGraph={{
          title: t("{{pageTitle}} | LooksRare", { pageTitle: t("Collections") }),
          url: canonical,
        }}
        canonical={canonical}
        languageAlternates={languageAlternates}
      />
      <RealtimeDataStatusProvider>
        <CollectionsView initialData={collections} />
      </RealtimeDataStatusProvider>
    </Page>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  try {
    const collections = await getCollectionsBase(
      {
        filter: { isVerified: DEFAULT_IS_VERIFIED },
        sort: DEFAULT_SORT,
        search: { term: DEFAULT_TERM },
        pagination: { first: COLLECTIONS_PAGINATION_FIRST },
      },
      headers
    );

    return {
      props: {
        ...(await serverSideTranslations(locale)),
        locale,
        collections,
      },
      revalidate: 60,
    };
  } catch (e) {
    throw new PageDataFetchError("/collections", e);
  }
};

export default CollectionsPage;
