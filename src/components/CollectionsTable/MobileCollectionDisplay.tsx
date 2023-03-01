// import { Box, Flex, FlexProps, IconButton, useDisclosure } from "@chakra-ui/react";
// import PercentChangeLabel from "components/PercentChangeLabel";
// import { useTranslation } from "next-i18next";
// import { CollectionBase } from "types/graphql";
// import { ChevronDown, ChevronUp, Text } from "uikit";
// import { formatNumberToLocale, formatToSignificant } from "utils/format";
// import { useOsCollectionImages } from "views/collections/components/hooks/useOsCollectionImages";
// import { Amount } from "./Amount";
// import { MobileCollectionLink } from "./MobileCollectionLink";




import { Box, Flex, FlexProps, IconButton, useDisclosure } from "@chakra-ui/react";
import PercentChangeLabel from "../PercentChangeLabel";
import { useTranslation } from "next-i18next";
import { CollectionBase } from "types/graphql";
import ChevronDown from "uikit/Icons/components/ChevronDown";
import ChevronUp from "uikit/Icons/components/ChevronUp";
import { Text } from "uikit/Text/Text";
import { formatNumberToLocale, formatToSignificant } from "utils/format";
import { useOsCollectionImages } from "views/collections/components/hooks/useOsCollectionImages";
import { Amount } from "./Amount";
import { MobileCollectionLink } from "./MobileCollectionLink";




interface MobileCollectionDisplayProps extends FlexProps {
  isExpanded?: boolean;
  collection: CollectionBase;
  rank: number;
}

export const MobileCollectionDisplay = ({ isExpanded, collection, rank, ...props }: MobileCollectionDisplayProps) => {
  const { t } = useTranslation();
  const expandedDisclosure = useDisclosure({ defaultIsOpen: isExpanded });

  const { address, name, logo, isVerified, floor, volume, countOwners, totalSupply } = collection;
  const { floorPrice, floorChange24h } = floor || {};
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
    <Box
      cursor="pointer"
      onClick={expandedDisclosure.onToggle}
      pt={3}
      sx={{ _hover: { bg: "hover-ui" }, _active: { bg: "onclick-ui" } }}
      mx={-4}
      {...props}
    >
      <Flex alignItems="center" width="100%" pr={4}>
        <Box flex={1}>
          <MobileCollectionLink
            rank={rank}
            collectionAddress={address}
            name={name}
            logo={logoImg}
            isVerified={isVerified}
          />
        </Box>
        <IconButton variant="ghost" colorScheme="gray" aria-label="toggle" size="sm">
          {expandedDisclosure.isOpen ? <ChevronUp /> : <ChevronDown />}
        </IconButton>
      </Flex>
      <Box pl="44px">
        <Box borderBottom="1px solid" borderBottomColor="border-01" pl="48px" pb={3}>
          <Flex alignItems="center" mb={1}>
            <Text textStyle="helper" color="text-03" minWidth="80px">
              {t("Floor")}
            </Text>
            {!!floorPrice ? (
              <Amount amount={formatToSignificant(floorPrice, 4)} textProps={{ textStyle: "helper" }} />
            ) : (
              "-"
            )}
            {!!floorChange24h && <PercentChangeLabel value={floorChange24h} textStyle="helper" />}
          </Flex>
          <Flex alignItems="center">
            <Text textStyle="helper" color="text-03" minWidth="80px">
              {t("24h Vol")}
            </Text>
            {volume.volume24h ? (
              <Amount
                amount={formatToSignificant(volume.volume24h, 2)}
                textProps={{ bold: false, color: "text-03", textStyle: "helper" }}
              />
            ) : (
              "-"
            )}
            {volume.change24h && <PercentChangeLabel value={volume.change24h} textStyle="helper" />}
          </Flex>
          {expandedDisclosure.isOpen && (
            <>
              <Flex alignItems="center" my={1}>
                <Text textStyle="helper" color="text-03" minWidth="80px">
                  {t("Total Vol")}
                </Text>
                {volume.volumeAll ? (
                  <Amount
                    amount={formatToSignificant(volume.volumeAll, 0)}
                    textProps={{ bold: false, color: "text-03", textStyle: "helper" }}
                  />
                ) : (
                  "-"
                )}
              </Flex>
              <Flex alignItems="center" mb={1}>
                <Text textStyle="helper" color="text-03" minWidth="80px">
                  {t("Owners")}
                </Text>
                {countOwners ? (
                  <Text textStyle="helper" color="text-03">
                    {formatNumberToLocale(countOwners, 0, 0)}
                  </Text>
                ) : (
                  "-"
                )}
              </Flex>
              <Flex alignItems="center">
                <Text textStyle="helper" color="text-03" minWidth="80px">
                  {t("Items")}
                </Text>
                {totalSupply ? (
                  <Text textStyle="helper" color="text-03">
                    {formatNumberToLocale(totalSupply, 0, 0)}
                  </Text>
                ) : (
                  "-"
                )}
              </Flex>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};
