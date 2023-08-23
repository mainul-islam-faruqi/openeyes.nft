import { forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { TabList, Tabs, Tab } from "@chakra-ui/react";
import Link from "next/link";
import { FilterLayoutStickyTabs } from "components/Layout/FilterLayout/FilterLayoutStickyTabs";

interface ExploreHeaderProps {
  tabIndex: number;
}

export const ExploreHeader = forwardRef(({ tabIndex }: ExploreHeaderProps, ref) => {
  const { t } = useTranslation();

  return (
    <FilterLayoutStickyTabs>
      <Tabs isManual defaultIndex={tabIndex} variant="blank" isLazy>
        <TabList ref={ref}>
          <Link href="/explore" passHref>
            <Tab as="a">{t("Items")}</Tab>
          </Link>
          <Link href="/explore/activity" passHref>
            <Tab as="a">{t("Activity")}</Tab>
          </Link>
        </TabList>
      </Tabs>
    </FilterLayoutStickyTabs>
  );
});

ExploreHeader.displayName = "ExploreHeader";
