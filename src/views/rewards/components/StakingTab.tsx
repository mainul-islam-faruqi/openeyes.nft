import { Box } from "@chakra-ui/react";
import { Container } from "components/Layout/Container";
import { useTranslation } from "next-i18next";
import { Text } from "uikit";
import { AggregatorPanel } from "./AggregatorPanel";
import { LooksCta } from "./LooksCta";
import { StakingPanel } from "./StakingPanel";

export const StakingTab = () => {
  const { t } = useTranslation();

  return (
    <Container maxWidth="1200px" pt={24} mb={12}>
      <Box mb={24}>
        <AggregatorPanel />
      </Box>
      <Box mb={24}>
        <StakingPanel />
      </Box>
      <Box mb={24}>
        <LooksCta />
      </Box>
      <Text mt={8} textAlign="center" color="text-03" textStyle="detail">
        {t(
          "The rates shown on this page are only provided for your reference: APR and APY are calculated based on current ROI. The actual rates will fluctuate a lot according to many different factors, including token prices, trading volume, liquidity, amount staked, and more."
        )}
      </Text>
    </Container>
  );
};
