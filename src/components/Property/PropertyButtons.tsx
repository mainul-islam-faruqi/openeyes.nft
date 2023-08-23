// @ts-nocheck
import { ReactText } from "react";
import { Grid, GridProps, GridItem, Box, Tag, TagLabel } from "@chakra-ui/react";
import { BigNumberish } from "ethers";
import { Trans } from "next-i18next";
import { useRouter } from "next/router";
import Link from "next/link";
import { LogoPolygonIcon, Text, VerifiedIcon } from "uikit";
import { formatAsCompactNumber, formatNumberToLocale } from "utils/format";
import { ImageData } from "types/graphql";
import { useOsCollectionImages } from "views/collections/components/hooks/useOsCollectionImages";
import { EthAmount } from "components/EthAmount";
import { Avatar } from "components/Avatar";
import { PropertyLabel } from "./styles";

interface PropertyButtonWrapperProps extends GridProps {
  isActive?: boolean;
  href?: string;
}

export const PropertyButtonWrapper = ({
  isActive = false,
  href,
  onClick,
  children,
  ...props
}: PropertyButtonWrapperProps) => {
  const isClickable = href || onClick;
  const inner = (
    <Grid
      alignItems="center"
      p={2}
      bg={isActive ? "interactive-02" : "transparent"}
      border="1px solid"
      borderColor="border-01"
      borderRadius="4px"
      cursor={isClickable ? "pointer" : "normal"}
      userSelect={isClickable ? "none" : "auto"}
      onClick={onClick}
      sx={{ _hover: isClickable ? { borderColor: "border-02" } : {} }}
      {...props}
    >
      {children}
    </Grid>
  );

  return href ? (
    <Link href={href} passHref>
      <a>{inner}</a>
    </Link>
  ) : (
    inner
  );
};

interface BasicPropertyButtonProps extends GridProps {
  label: ReactText;
  labelHeader?: ReactText;
  floorPrice?: string;
  count?: number;
  total?: number;
  isActive?: boolean;
  href?: string;
}

export const BasicPropertyButton = ({
  label,
  labelHeader,
  floorPrice,
  isActive = false,
  count,
  total,
  href,
  ...props
}: BasicPropertyButtonProps) => {
  const rarity = !!count && !!total && (count / total) * 100;
  const textColor = "text-02";

  return (
    <PropertyButtonWrapper
      gridTemplateColumns="110px repeat(2, 1fr)"
      columnGap={2}
      py={3}
      px={2}
      isActive={isActive}
      href={href}
      {...props}
    >
      <GridItem overflow="hidden">
        {labelHeader && (
          <Text textStyle="helper" lineHeight={4} isTruncated color="text-03">
            {labelHeader}
          </Text>
        )}
        <PropertyLabel isTruncated isActive={isActive}>
          {label}
        </PropertyLabel>
      </GridItem>
      {floorPrice && (
        <GridItem textAlign="right">
          <EthAmount as="span" textStyle="detail" amount={floorPrice} color={textColor} />
        </GridItem>
      )}
      {!!count && (
        <GridItem textAlign="right">
          <Text as="span" bold textStyle="detail" mr={1}>
            {`${count.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
          </Text>
          <Text as="span" textStyle="detail" color={textColor}>
            {`(${rarity ? formatNumberToLocale(rarity, 1, 2) : "-"}%)`}
          </Text>
        </GridItem>
      )}
    </PropertyButtonWrapper>
  );
};

interface CollectionPropertyButtonProps extends GridProps {
  address: string;
  name: string;
  count?: BigNumberish;
  logo?: ImageData;
  floorPrice?: string;
  last24hrVolume?: string;
  isVerified: boolean;
  isListingRewardsEligible?: boolean;
  isActive?: boolean;
}

export const CollectionPropertyButton = ({
  address,
  name,
  count,
  logo,
  floorPrice,
  last24hrVolume,
  isVerified,
  isListingRewardsEligible = false,
  isActive = false,
  ...props
}: CollectionPropertyButtonProps) => {
  const { locale } = useRouter();

  const osCollectionImagesQuery = useOsCollectionImages(address, { enabled: !logo });
  const logoImg = (() => {
    if (logo) {
      return logo;
    }

    if (osCollectionImagesQuery.isSuccess && osCollectionImagesQuery.data.logo) {
      return osCollectionImagesQuery.data.logo;
    }

    return undefined;
  })();

  return (
    <PropertyButtonWrapper
      isActive={isActive}
      gridTemplateColumns="32px 2fr 1fr auto"
      gridTemplateRows="1fr 1fr"
      columnGap={2}
      {...props}
    >
      <GridItem rowSpan={2} colSpan={1}>
        <Box height="100%" width="100%">
          <Avatar size={32} address={address} src={logoImg?.src} />
        </Box>
      </GridItem>
      <GridItem colSpan={count ? 2 : 3}>
        <PropertyLabel isActive={isActive}>{name}</PropertyLabel>
        {isVerified && <VerifiedIcon boxSize={3} ml={1} verticalAlign="baseline" />}
        {isListingRewardsEligible && <LogoPolygonIcon color="purple.400" boxSize={3} ml={1} />}
      </GridItem>
      {count && (
        <GridItem>
          <Tag px={1} py={0.5} borderRadius="8px" minH={0} minW={0} variant="outline" colorScheme="gray">
            <TagLabel>{formatAsCompactNumber(count, locale)}</TagLabel>
          </Tag>
        </GridItem>
      )}
      {last24hrVolume && (
        <GridItem overflow="hidden" whiteSpace="nowrap">
          <Trans i18nKey="Collection24HourVolume">
            <Text textStyle="helper" as="span" color="text-03">
              24h Vol:
            </Text>{" "}
            <Text as="span" textStyle="helper" color="text-02" isTruncated>
              Ξ{{ last24hrVolume }}
            </Text>
          </Trans>
        </GridItem>
      )}
      {floorPrice && (
        <GridItem overflow="hidden" whiteSpace="nowrap" colSpan={2}>
          <Trans i18nKey="CollectionFloorPrice">
            <Text textStyle="helper" as="span" color="text-03">
              Floor:
            </Text>{" "}
            <Text as="span" textStyle="helper" color="text-02" isTruncated>
              Ξ{{ floorPrice }}
            </Text>
          </Trans>
        </GridItem>
      )}
    </PropertyButtonWrapper>
  );
};
