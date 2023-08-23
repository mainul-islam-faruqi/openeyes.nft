import { Flex } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { Button, Text, ExternalLink } from "uikit";
import { SWAP_URL, DOC_URL, addresses } from "config";

export const LooksCta = () => {
  const { t } = useTranslation();

  return (
    <Flex alignItems="center" justifyContent="center" flexDirection="column" width="290px" mx="auto">
      <Text as="h3" textStyle="display-03" bold mb={12}>
        {t("Get LOOKS")}
      </Text>
      <Button
        as={ExternalLink}
        id="looks-cta-buy-on-uniswap"
        href={`${SWAP_URL}?outputCurrency=${addresses.LOOKS}`}
        size="lg"
        width="100%"
        mb={6}
      >
        {t("Buy on Uniswap")}
      </Button>
      <Button
        id="looks-cta-learn-how-to-buy-looks"
        as={ExternalLink}
        href={`${DOC_URL}/about/buy-looks`}
        size="xs"
        variant="ghost"
      >
        {t("Learn more about LOOKS")}
      </Button>
    </Flex>
  );
};
