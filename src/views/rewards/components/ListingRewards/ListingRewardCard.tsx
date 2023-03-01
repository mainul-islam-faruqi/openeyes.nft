import { Box, Grid, GridItem } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { ConnectWalletButton } from "components/Buttons";
import { useTranslation } from "next-i18next";
import { LooksIcon, Text } from "uikit";
import { ListingRewardCollectionPane } from "./ListingRewardCollectionPane";

export const ListingRewardCard = () => {
  const { t } = useTranslation();
  const { account } = useWeb3React();
  return (
    <Box border="1px solid" borderColor="border-01" borderRadius="lg">
      <Grid gridTemplateColumns="1fr 40px" gridColumnGap={4} p={4}>
        <GridItem>
          <Text as="h3" textStyle="detail" color="text-02">
            {t("Listing & Trading Rewards")}
          </Text>
          <Text textStyle="helper" color="text-03">
            {t("Earn LOOKS!")}
          </Text>
        </GridItem>
        <LooksIcon color="text-03" boxSize={10} />
      </Grid>
      {account ? (
        <ListingRewardCollectionPane />
      ) : (
        <ConnectWalletButton
          isFullWidth
          colorScheme="gray"
          color="link-01"
          borderTopLeftRadius={0}
          borderTopRightRadius={0}
        />
      )}
    </Box>
  );
};
