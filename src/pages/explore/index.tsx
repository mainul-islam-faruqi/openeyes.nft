
import { NextSeo } from "next-seo";
import { GetServerSideProps } from "next";
import { dehydrate, QueryClient } from "react-query";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { currentChainInfo } from "config/chains";
import { TOKENS_PER_PAGE } from "config/constants"
// import { headers } from "config/server";
import { getCollectionsFilters } from "utils/graphql/collection"
import { getTokens } from "utils/graphql/getTokens";
import { collectionsKeys } from "hooks/graphql/collections";
import ExploreView from "views/explore/ExploreView";
import { CollectionsSort, NFTCard, TokenFilter, TokensSort } from "types/graphql";
import Page from "components/Layout/Page";
import { getTokenFilterQuery } from "components/Filters/hooks/useTokenFilterQuery";

const navProps = {
  borderBottom: "1px solid",
  borderBottomColor: { base: "border-01", sm: "transparent" },
};

interface ExplorePageProps {
  initialTokenFilter: TokenFilter;
  initialTokens: NFTCard[];
}

const ExplorePage: React.FC<ExplorePageProps> = ({ initialTokenFilter, initialTokens }) => {
  const { t } = useTranslation();

  return (
    <Page navProps={navProps}>
      <h1> Explore </h1>
      <NextSeo
        title={t("Explore")}
        description={t(
          "Explore and trade popular NFT collections such as CryptoPunks and Bored Ape Yacht Club, on the LooksRare NFT Marketplace."
        )}
        openGraph={{
          url: `${currentChainInfo.appUrl}/explore`,
          title: t("{{pageTitle}} | LooksRare", { pageTitle: t("Explore") }),
          description: t(
            "Explore and trade popular NFT collections such as CryptoPunks and Bored Ape Yacht Club, on the LooksRare NFT Marketplace."
          ),
        }}
      />
      <ExploreView tabIndex={0} initialTokenFilter={initialTokenFilter} initialTokens={initialTokens} />
    </Page>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale, query, res }) => {
  const queryClient = new QueryClient();
  const collectionsFiltersSort: CollectionsSort = CollectionsSort.HIGHEST_24H;

  try {
    await queryClient.prefetchInfiniteQuery(collectionsKeys.collectionsFilters({ sort: collectionsFiltersSort }), () =>
      getCollectionsFilters({ sort: collectionsFiltersSort }, ) // headers
    );
    const initialTokenFilter: TokenFilter = { ...getTokenFilterQuery(query) };
    const defaultSort: TokensSort = TokensSort.LAST_RECEIVED;

    const initialTokens = await getTokens({
      filter: initialTokenFilter,
      pagination: { first: TOKENS_PER_PAGE },
      sort: defaultSort,
      // there is no connected account during SSR - empty array returns no owner data. we refetch clientside if there is an account
      ownerFilter: { addresses: [] },
      requestHeaders:  '', // headers
    });
    res.setHeader("Cache-Control", "public, s-maxage=15, stale-while-revalidate=60");

    return {
      props: {
        ...(await serverSideTranslations(locale!, ["common"])),
        locale,
        initialTokenFilter,
        initialTokens,
        // Known issue with serializing undefined pageParams[0] in infiniteQuery prefetch https://github.com/tannerlinsley/react-query/issues/1458
        dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};
export default ExplorePage;
