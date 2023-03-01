import { Box, Flex, FlexProps } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { EthHalfIcon, HelpIcon, LogoPolygonIcon, Popover, Text, VerifiedIcon } from "uikit";
import { CollectionFloor, ImageData } from "types/graphql";
import { getGlobalFloor } from "utils/floorPricePercentHelpers";
import { formatToSignificant } from "utils/format";
import { Image } from "components/Image";
import { FloorTooltipText } from "../../../TooltipText/GlobalTooltipText";

interface Props extends FlexProps {
  tokenName: string;
  tokenImage: ImageData;
  collectionName: string;
  isVerified?: boolean;
  points?: number | null;
  collectionFloor?: CollectionFloor;
}

const NftMeta: React.FC<Props> = ({
  tokenName,
  tokenImage,
  collectionName,
  isVerified,
  points,
  collectionFloor,
  ...props
}) => {
  const { t } = useTranslation();
  const isListingRewardsEligible = points ? points > 0 : false;
  const { globalFloor, floorPrice, floorPriceOs } = getGlobalFloor(collectionFloor);

  return (
    <Flex {...props}>
      <Flex flexShrink={0}>
        <Image
          src={tokenImage.src}
          contentType={tokenImage.contentType}
          alt={tokenName}
          objectFit="contain"
          width={48}
          height={48}
          priority
        />
      </Flex>
      <Flex flexDirection="column" ml={4} whiteSpace="nowrap" overflow="hidden">
        <Text isTruncated bold mb={2}>
          {tokenName}
        </Text>
        <Box lineHeight={4}>
          <Text as="span" textStyle="helper" bold color="text-01">
            {collectionName}
          </Text>
          {isVerified && <VerifiedIcon boxSize={4} ml={1} />}
          {isListingRewardsEligible && <LogoPolygonIcon color="purple.400" boxSize={3} ml={1} />}
        </Box>
        {collectionFloor && (
          <Popover placement="right" label={<FloorTooltipText amountLr={floorPrice} amountOs={floorPriceOs} />}>
            <Flex alignItems="center" mt={2}>
              <Text textStyle="helper" color="text-03" mr={1}>
                {t("Global Floor")}
              </Text>
              <EthHalfIcon boxSize={14} height={4} width={2} mr={1} />
              <Text textStyle="helper" color="text-02" bold mr={1}>
                {formatToSignificant(globalFloor, 2)}
              </Text>
              <HelpIcon boxSize={4} color="text-03" />
            </Flex>
          </Popover>
        )}
      </Flex>
    </Flex>
  );
};

export default NftMeta;
