import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { currentChainInfo } from "config/chains";
import { NextSeo } from "next-seo";
import { RewardsView } from "views/rewards/RewardsView";

const RewardsPage = () => {
  const { t } = useTranslation();
  return (
    <>
      <NextSeo
        title={t("Rewards")}
        openGraph={{
          title: t("{{pageTitle}} | LooksRare", { pageTitle: t("Rewards") }),
          url: `${currentChainInfo.appUrl}/rewards`,
        }}
      />
      <RewardsView />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, ["common"])),
      locale,
    },
  };
};

export default RewardsPage;
