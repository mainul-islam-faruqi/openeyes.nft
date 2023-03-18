import { GetServerSideProps } from "next";
import { ethers } from "ethers";
import { NextSeo } from "next-seo";
import { useWeb3React } from "@web3-react/core";
import { getCloudinaryUrl } from "@looksrare/shared";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { currentChainInfo } from "config/chains";
import { seoBaseImage } from "config/seo";
import { headers } from "config/server";
import { NFT } from "types/graphql";
import { useTranslation } from "next-i18next";
import { getToken } from "utils/graphql";
import { isValidBigNumber } from "utils/guards";
import { getTokenOwnerFilter } from "utils/tokens";
import { useToken, useTokenOwners } from "hooks/graphql/tokens";
import { useEagerConnect } from "hooks/useEagerConnect";
import { SingleNftView } from "views/collections/SingleNftView";
import Page from "components/Layout/Page";

interface Props {
  collectionAddress: string;
  tokenId: string;
  initialNft: NFT;
}

const navProps = { borderBottom: "1px solid", borderBottomColor: "border-01" };

const AssetPage: React.FC<Props> = ({ collectionAddress, tokenId, initialNft }) => {
  const { t } = useTranslation();
  const { account } = useWeb3React();
  const hasTriedConnection = useEagerConnect();
  const { data } = useToken(
    {
      collection: collectionAddress,
      tokenId,
    },
    { initialData: initialNft }
  );

  const tokenOwnersQuery = useTokenOwners(
    {
      collection: collectionAddress,
      tokenId,
      ownerFilter: getTokenOwnerFilter({ connectedAccount: account, collectionType: initialNft.collection.type }),
    },
    { enabled: hasTriedConnection }
  );

  // Because we are supplying the useToken query with initial data we need to tell TS
  // that we know the data is available immediately
  const token = data!;

  const seoTokenImageSrc = token.image.src.replace(currentChainInfo.cdnUrl, "");
  const isVideo = token.image.contentType?.includes("video");
  const title = `${token.name} - ${token.collection.name}`;

  return (
    <Page navProps={navProps}>
      <NextSeo
        title={title}
        description={token.description}
        openGraph={{
          url: `${currentChainInfo.appUrl}/collections/${collectionAddress}/${tokenId}`,
          title: t("{{pageTitle}} | OpenEyes.nft", { pageTitle: title }),
          description: token.description,
          images: [
            isVideo
              ? seoBaseImage
              : {
                  url: getCloudinaryUrl({
                    src: seoTokenImageSrc,
                    width: 1200,
                    baseCloudinaryUrl: currentChainInfo.cloudinaryUrl,
                  }),
                  alt: token.name,
                  width: 1200,
                },
          ],
        }}
      />
      <SingleNftView nft={token} tokenOwnersQuery={tokenOwnersQuery} />
    </Page>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale, params, res }) => {
  try {
    const collectionAddress = ethers.utils.getAddress(params?.address as string);
    const tokenId = params?.tokenId as string;

    if (isValidBigNumber(tokenId) === false) {
      throw new Error("Invalid or out of range number");
    }

    const nft = await getToken({ collection: collectionAddress, tokenId }, headers);
    res.setHeader("Cache-Control", "public, s-maxage=15, stale-while-revalidate=60");
    return {
      props: {
        ...(await serverSideTranslations(locale!, ["common"])),
        collectionAddress,
        initialNft: nft,
        tokenId,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};

export default AssetPage;
