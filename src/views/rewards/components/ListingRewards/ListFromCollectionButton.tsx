import Link from "next/link";
import { useWeb3React } from "@web3-react/core";
import { useTranslation } from "next-i18next";
import { Button, ButtonProps } from "uikit";
import { ConnectWalletButton } from "components/Buttons";

interface ListFromCollectionButtonProps extends ButtonProps {
  collectionAddress: string;
  hasTokenInCollection: boolean;
}

export const ListFromCollectionButton: React.FC<ListFromCollectionButtonProps> = ({
  collectionAddress,
  hasTokenInCollection,
  ...props
}) => {
  const { t } = useTranslation();
  const { account } = useWeb3React();

  if (!account) {
    return <ConnectWalletButton variant="ghost">{t("Connect")}</ConnectWalletButton>;
  }

  if (!hasTokenInCollection) {
    return (
      <Button disabled {...props}>
        {t("List")}
      </Button>
    );
  }

  const collectionFilter = {
    collection: collectionAddress,
  };

  return (
    <Link href={`/accounts/me?filters=${JSON.stringify(collectionFilter)}`} passHref>
      <Button as="a" {...props}>
        {t("List")}
      </Button>
    </Link>
  );
};
