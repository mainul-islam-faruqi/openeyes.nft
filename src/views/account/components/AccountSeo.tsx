import { NextSeo } from "next-seo";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { seoBaseDescription } from "config/seo";
import { currentChainInfo, USER_ACCOUNT_URI } from "config";
import { formatAddress } from "utils/format";
import { User } from "types/graphql";

interface Props {
  user?: User;
}

const AccountSeo: React.FC<Props> = ({ user }) => {
  const { query } = useRouter();
  const { t } = useTranslation();

  const isMe = query.address === USER_ACCOUNT_URI;
  const queryAddress = (query.address as string) || "";

  return (
    <>
      {isMe ? (
        <NextSeo
          noindex
          nofollow
          title={t("Your account")}
          openGraph={{
            title: t("{{pageTitle}} | OpenEyes.nft", { pageTitle: t("Your Account") }),
            url: `${currentChainInfo.appUrl}/accounts/me`,
          }}
        />
      ) : (
        <NextSeo
          noindex
          nofollow
          title={user?.name || formatAddress(queryAddress)}
          description={user?.biography || seoBaseDescription}
          openGraph={{
            title: t("{{pageTitle}} | OpenEyes.nft", { pageTitle: user?.name || formatAddress(queryAddress) }),
            description: user?.biography || seoBaseDescription,
            url: `${currentChainInfo.appUrl}/accounts/${queryAddress}`,
          }}
        />
      )}
    </>
  );
};

export default AccountSeo;
