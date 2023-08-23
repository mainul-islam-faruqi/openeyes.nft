import { NextSeo } from "next-seo";
import { GetStaticPaths, GetStaticProps } from "next";
import { dehydrate, QueryClient } from "react-query";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { currentChainInfo } from "config";
import { headers } from "config/server";
import { getCanonicalAndLanguageAlternates, seoBaseImage } from "config/seo";
import { getCollectionStaticData, getTopCollectionAddresses } from "utils/graphql";
import { getCloudinaryUrl } from "utils/mediaLoaders";
import { getTraitTypes } from "utils/graphql/traits";
import { PageDataFetchError } from "utils/errors";
import { traitKeys } from "hooks/graphql/traits";
import { CollectionStaticData, TokenFilter } from "types/graphql";
import CollectionItemsViewWithProviders from "views/collections/SingleCollectionView/ItemsView";
import Page from "components/Layout/Page";
import { safeGetAddress } from "utils/safeGetAddress";

interface Props {
  collection: CollectionStaticData;
  initialTokenFilter: TokenFilter;
}

const CollectionPage: React.FC<React.PropsWithChildren<Props>> = ({ collection }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const seoBannerImageSrc = collection.banner?.src && collection.banner.src.replace(currentChainInfo.cdnUrl, "");
  const { canonical, languageAlternates } = getCanonicalAndLanguageAlternates(
    `/collections/${safeGetAddress(collection.address)}`,
    router
  );
  const removeIndex = !collection.isVerified;

  return (
    <Page>
      <NextSeo
        noindex={removeIndex}
        nofollow={removeIndex}
        title={collection.name}
        description={collection.description}
        openGraph={{
          title: t("{{pageTitle}} | LooksRare", { pageTitle: collection.name }),
          description: collection.description,
          url: canonical,
          images: [
            seoBannerImageSrc
              ? {
                  url: getCloudinaryUrl({
                    src: seoBannerImageSrc,
                    width: 1200,
                    baseCloudinaryUrl: currentChainInfo.cloudinaryUrl,
                  }),
                  width: 1200,
                  alt: collection.name,
                }
              : seoBaseImage,
          ],
        }}
        canonical={canonical}
        languageAlternates={languageAlternates}
      />
      <CollectionItemsViewWithProviders collection={collection} />
    </Page>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale = "en", params }) => {
  const queryClient = new QueryClient();

  try {
    const address = safeGetAddress(params?.address as string);
    if (!address) {
      return { notFound: true };
    }

    const collection = await getCollectionStaticData(address, headers);
    if (!collection) {
      return {
        notFound: true,
      };
    }
    await queryClient.prefetchInfiniteQuery(traitKeys.infiniteTraitTypes(address), () =>
      getTraitTypes({ collectionAddress: address, requestHeaders: headers })
    );
    return {
      props: {
        ...(await serverSideTranslations(locale)),
        locale,
        collection,
        // Known issue with serializing undefined pageParams[0] in infiniteQuery prefetch https://github.com/tannerlinsley/react-query/issues/1458
        dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
      },
      revalidate: 60,
    };
  } catch (e) {
    throw new PageDataFetchError(`/collections/${params?.address || "[address]"}`, e);
  }
};

export const getStaticPaths: GetStaticPaths<{ address: string }> = async () => {
  // Top verified collections
  const collections = await getTopCollectionAddresses(headers);
  const paths = collections.map(({ address }) => ({ params: { address } }));
  return {
    paths,
    fallback: "blocking",
  };
};
export default CollectionPage;
