import { Box, Tab, TabList, Tabs } from "@chakra-ui/react";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { Text } from "uikit";
import { Container } from "components/Layout/Container";

export const RankingsHeader = ({ tabIndex }: { tabIndex: number }) => {
  const { t } = useTranslation();

  const bgGradient = "linear(to-b, ui-bg, ui-01)";

  return (
    <Box bgGradient={bgGradient}>
      <Container>
        <Text as="h1" textStyle="display-01" bold py={12}>
          {t("Rankings")}
        </Text>
        <Tabs variant="line" index={tabIndex} isLazy>
          <TabList>
            <Link href="/collections" passHref>
              <Tab as="a">{t("All Collections")}</Tab>
            </Link>
            <Link href="/watchlists/me" passHref>
              <Tab as="a" data-id="my-watchlists-tab">
                {t("My Watchlists")}
              </Tab>
            </Link>
          </TabList>
        </Tabs>
      </Container>
    </Box>
  );
};
