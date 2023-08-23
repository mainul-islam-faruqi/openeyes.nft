import { GetStaticPaths, GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { NextSeo } from "next-seo";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { currentChainInfo } from "config";
import { getCanonicalAndLanguageAlternates, seoBaseImage } from "config/seo";
import { headers } from "config/server";
import { getCloudinaryUrl } from "utils/mediaLoaders";
import { ServerSideNft, getServerSideToken } from "utils/graphql";
import { isValidBigNumber } from "utils/guards";
import { safeGetAddress } from "utils/safeGetAddress";
import { PageDataFetchError } from "utils/errors";
import { useGetWindowHash } from "hooks/useGetWindowHash";
import { BulkListingView } from "views/account/BulkListingView";
import Page from "components/Layout/Page";
import TokenView from "views/collections/components/SingleNftView/TokenView";

interface Props {
  collectionAddress: string;
  tokenId: string;
  serverSideNft: ServerSideNft;
}

const AssetPage: React.FC<React.PropsWithChildren<Props>> = ({ collectionAddress, tokenId, serverSideNft }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const seoTokenImageSrc = serverSideNft.image.src.replace(currentChainInfo.cdnUrl, "");
  const isVideo = serverSideNft.image.contentType?.includes("video");
  const title = `${serverSideNft.name} - ${serverSideNft.collection.name}`;
  const { canonical, languageAlternates } = getCanonicalAndLanguageAlternates(
    `/collections/${safeGetAddress(collectionAddress)}/${tokenId}`,
    router
  );
  const removeIndex = !serverSideNft.collection.isVerified;

  const hash = useGetWindowHash();

  return (
    <Page>
      <NextSeo
        noindex={removeIndex}
        nofollow={removeIndex}
        title={title}
        description={serverSideNft.description}
        openGraph={{
          url: canonical,
          title: t("{{pageTitle}} | LooksRare", { pageTitle: title }),
          description: serverSideNft.description,
          images: [
            isVideo
              ? seoBaseImage
              : {
                  url: getCloudinaryUrl({
                    src: seoTokenImageSrc,
                    width: 1200,
                    baseCloudinaryUrl: currentChainInfo.cloudinaryUrl,
                  }),
                  alt: serverSideNft.name,
                  width: 1200,
                },
          ],
        }}
        canonical={canonical}
        languageAlternates={languageAlternates}
      />
      {hash === "#sell" && <BulkListingView />}
      {hash !== "#sell" && (
        <TokenView serverSideNft={serverSideNft} tokenId={tokenId} collectionAddress={collectionAddress} />
      )}
    </Page>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale = "en", params }) => {
  try {
    const collectionAddress = safeGetAddress(params?.address as string);
    if (!collectionAddress) {
      return { notFound: true };
    }
    const tokenId = params?.tokenId as string;

    if (isValidBigNumber(tokenId) === false) {
      throw new Error("Invalid or out of range number");
    }

    const nft = await getServerSideToken({ collection: collectionAddress, tokenId }, headers);
    if (!nft) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        ...(await serverSideTranslations(locale)),
        collectionAddress,
        serverSideNft: nft,
        tokenId,
      },
      revalidate: 10,
    };
  } catch (e) {
    throw new PageDataFetchError(`/collections/${params?.address || "[address]"}/${params?.tokenId || ["tokenId"]}`, e);
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [], // No pages created at build time
    fallback: "blocking",
  };
};

export default AssetPage;
