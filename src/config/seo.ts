import { DefaultSeoProps } from "next-seo";
import { currentChainInfo } from "./chains";

const title = "OpenEyes.nft";
export const seoBaseDescription =
  "OpenEyes.nft is a next generation NFT market. Buy NFTs, sell NFTs… or just HODL: Collectors, traders, and creators alike earn passive income! 👀💎";
export const seoBaseImage = {
  url: `${currentChainInfo.appUrl}/images/meta-2.png`,
  width: 1200,
  height: 675,
  alt: title,
};

const defaultSeo: DefaultSeoProps = {
  title,
  titleTemplate: `%s | ${title}`,
  description: seoBaseDescription,
  twitter: {
    handle: "@looksrarenft",
    site: "https://twitter.com/looksrarenft",
    cardType: "summary_large_image",
  },
  openGraph: {
    type: "website",
    url: currentChainInfo.appUrl,
    title,
    description: seoBaseDescription,
    images: [seoBaseImage],
    site_name: title,
  },
  additionalLinkTags: [
    { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
    { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
    { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
    { rel: "manifest", href: "/manifest.json" },
  ],
};

export default defaultSeo;
