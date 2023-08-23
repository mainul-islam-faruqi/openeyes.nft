import { useTranslation } from "next-i18next";
import { Divider, HStack, Stack } from "@chakra-ui/layout";
import { ToggleListButton } from "components/Buttons";
import { useTokenFilter, AccountCollectionsFilter, BasicFilter } from "components/Filters";

interface AccountCollectionNftsFiltersProps {
  account: string;
  isMobileLayout?: boolean;
}

const AccountNftsFilters: React.FC<AccountCollectionNftsFiltersProps> = ({ isMobileLayout, account }) => {
  const { t } = useTranslation();
  const { setCollection, toggleWithAskOnly, toggleWithoutAskOnly, filter } = useTokenFilter();

  return (
    <Stack divider={<Divider />} spacing={0}>
      <BasicFilter bg="ui-01">
        <HStack justifyContent="space-between" spacing={3} py={3}>
          <ToggleListButton isActive={filter.withAskOnly} size="sm" onClick={toggleWithAskOnly} flex={1}>
            {t("Listed")}
          </ToggleListButton>
          <ToggleListButton isActive={filter.withoutAskOnly} size="sm" onClick={toggleWithoutAskOnly} flex={1}>
            {t("Unlisted")}
          </ToggleListButton>
        </HStack>
      </BasicFilter>
      <AccountCollectionsFilter
        handleSetCollectionAddress={(collectionAddress) => setCollection(collectionAddress)}
        handleClearCollectionAddress={() => setCollection()}
        isMobileLayout={isMobileLayout}
        account={account}
      />
    </Stack>
  );
};

export default AccountNftsFilters;
