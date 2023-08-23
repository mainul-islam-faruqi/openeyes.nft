import Link from "next/link";
import { Box, Tab, TabList, Tabs, useColorModeValue } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { Container } from "components/Layout/Container";
import { LooksApyCallout } from "./LooksApyCallout";

interface RewardHeaderProps {
  tabIndex?: number;
}

export const RewardHeader = ({ tabIndex = 0 }: RewardHeaderProps) => {
  const { t } = useTranslation();
  const bigLooksUrl = `url('/images/${useColorModeValue("biglooks-light.svg", "biglooks-dark.svg")}')`;

  return (
    <Box borderBottom="1px solid" borderBottomColor="border-01">
      <Container
        maxWidth="1200px"
        backgroundImage={bigLooksUrl}
        backgroundPosition="right top"
        backgroundRepeat="no-repeat"
        backgroundSize="50%"
      >
        <Box py={32}>
          <LooksApyCallout />
        </Box>
        <Tabs index={tabIndex} variant="blank" isLazy>
          <TabList>
            <Link href="/rewards" passHref>
              <Tab as="a">{t("Staking")}</Tab>
            </Link>
            <Link href="/rewards/trading" passHref>
              <Tab as="a">{t("Listing & Trading")}</Tab>
            </Link>
          </TabList>
        </Tabs>
      </Container>
    </Box>
  );
};
