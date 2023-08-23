import React from "react";
import { GetServerSideProps } from "next";
import { isAddress } from "ethers/lib/utils";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Account from "views/account";
import { useUser } from "hooks/graphql/user";
import { useAddressFromQuery } from "views/account/hooks/useAddressFromQuery";
import AccountSeo from "views/account/components/AccountSeo";
import { USER_ACCOUNT_URI } from "config/urls";

const AccountPage = () => {
  const address = useAddressFromQuery();
  const { data: user, isLoading } = useUser(address!, { enabled: !!address, refetchOnWindowFocus: false });

  return (
    <>
      <AccountSeo user={user} />
      <Account user={user} isLoading={isLoading} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale, query }) => {
  const address = query?.address as string;
  const isValidAddress = address === USER_ACCOUNT_URI || isAddress(address ?? "");

  if (!isValidAddress) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...(await serverSideTranslations(locale!, ["common"])),
      locale,
    },
  };
};

export default AccountPage;
