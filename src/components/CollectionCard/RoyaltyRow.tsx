// import { Box, Flex, FlexProps } from "@chakra-ui/react";
// import { useTranslation } from "next-i18next";
// import { addresses } from "config";
// import { Royalty } from "types/graphql";
// import { EthHalfIcon, ExternalLink, Text, WethHalfIcon } from "uikit";
// import { timeAgo } from "utils/date";
// import { formatToSignificant } from "utils/format";
// import { getExplorerLink } from "utils/chains";
// import { Image } from "components/Image";




import { Box, Flex, FlexProps } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { addresses } from "config/addresses";
import { Royalty } from "types/graphql";
import { EthHalfIcon, WethHalfIcon } from "uikit";
import { ExternalLink } from "uikit/Link/Link";
import { Text } from "uikit/Text/Text";
import { timeAgo } from "utils/date";
import { formatToSignificant } from "utils/format";
import { getExplorerLink } from "utils/chains";
import { Image } from "../Image";




export interface RoyaltyRowProps extends FlexProps {
  royalty: Royalty;
}

export const RoyaltyRow = ({ royalty, ...props }: RoyaltyRowProps) => {
  const { t } = useTranslation();
  const { token, amount, createdAt, currency, hash } = royalty;
  const Icon = currency === addresses.WETH ? WethHalfIcon : EthHalfIcon;

  return (
    <Flex alignItems="center" p={4} borderBottom="1px solid" flexWrap="wrap" borderBottomColor="border-01" {...props}>
      <Flex alignItems="center" flex={1}>
        <Box flexShrink={0}>
          <Image src={token.image.src} contentType={token.image.contentType} height={48} width={48} alt="nft image" />
        </Box>
        <Text bold ml={4} isTruncated>
          {token.name}
        </Text>
      </Flex>
      <Flex alignItems="center" flexWrap="wrap" justifyContent={{ base: "start", md: "end" }}>
        <Box mr={4}>
          <Text as="span" color="text-03" textStyle="detail">
            {t("Fee Earned")}
          </Text>
          <Icon ml={2} />
          <Text as="span" textStyle="detail" bold>
            {formatToSignificant(amount, 6)}
          </Text>
        </Box>
        <Flex alignItems="center">
          <Text as="span" color="text-03" textStyle="detail">
            {t("Payout")}
          </Text>
          <ExternalLink href={getExplorerLink(hash, "transaction")} ml={2} textStyle="detail">
            {timeAgo(new Date(createdAt))}
          </ExternalLink>
        </Flex>
      </Flex>
    </Flex>
  );
};
