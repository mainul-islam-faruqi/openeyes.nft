import { Skeleton, Tab, TabList, Tabs } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { useTokenFilter } from "components/Filters";
import { FilterLayoutStickyTabs } from "components/Layout/FilterLayout/FilterLayoutStickyTabs";
import { formatNumberToLocale } from "utils/format";

interface Props {
  collectionsCount: number;
  isLoading: boolean;
  tabIndex: number;
}

export const AccountViewTabs: React.FC<Props> = ({ collectionsCount, isLoading, tabIndex }) => {
  const { t } = useTranslation();
  const { clearAllFilters } = useTokenFilter();

  // Clear any filters when changing tabs
  const handleClick = () => {
    clearAllFilters();
  };

  return (
    <FilterLayoutStickyTabs>
      <Tabs variant="blank" index={tabIndex} isLazy>
        <TabList justifyContent={{ base: "flex-start", lg: "center" }}>
          <Tab as="a" href="#owned">
            {isLoading ? (
              <>
                {t("Owned")}
                <Skeleton ml={2} height="20px" width="24px" />
              </>
            ) : (
              t("Owned")
            )}
          </Tab>
          <Tab as="a" href="#activity" onClick={handleClick}>
            {t("Activity")}
          </Tab>
          <Tab as="a" href="#offers" onClick={handleClick}>
            {t("Offers")}
          </Tab>
          <Tab as="a" href="#collections" onClick={handleClick}>
            {isLoading ? (
              <>
                {t("Collections")}
                <Skeleton ml={2} height="20px" width="24px" />
              </>
            ) : (
              t("Collections ({{total}})", {
                total: formatNumberToLocale(collectionsCount, 0, 0),
              })
            )}
          </Tab>
        </TabList>
      </Tabs>
    </FilterLayoutStickyTabs>
  );
};
