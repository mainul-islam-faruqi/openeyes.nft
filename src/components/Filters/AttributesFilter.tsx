// import { useTranslation } from "react-i18next";
// import { BigNumber } from "ethers";
// import { useDisclosure } from "@chakra-ui/hooks";
// import { Box, Flex, GridItem, Collapse, Fade, Grid } from "@chakra-ui/react";
// import capitalize from "lodash/capitalize";
// import findIndex from "lodash/findIndex";
// import { ChevronDown, ChevronUp, ListIcon, Button, Popover, HelpIcon, TooltipText } from "uikit";
// import { Attribute, AttributeFilter } from "types/graphql";
// import { useFilterLayout } from "components/Layout/FilterLayout/hooks";
// import { BasicPropertyButton, PropertyGroupHeader, PropertyHeader } from "components/Property";
// import { formatToSignificant } from "utils/format";





import { useTranslation } from "react-i18next";
import { BigNumber } from "ethers";
import { useDisclosure } from "@chakra-ui/hooks";
import { Box, Flex, GridItem, Collapse, Fade, Grid } from "@chakra-ui/react";
import capitalize from "lodash/capitalize";
import findIndex from "lodash/findIndex";
import ChevronDown from "uikit/Icons/components/ChevronDown";
import ChevronUp from "uikit/Icons/components/ChevronUp";
import { ListIcon, HelpIcon } from "uikit";
import { Button } from "uikit/Button/Button";
import Popover from "uikit/Popover/Popover";
import { TooltipText } from "uikit/Text/Text";
import { Attribute, AttributeFilter } from "types/graphql";
import { useFilterLayout } from "../Layout/FilterLayout/hooks";
import { BasicPropertyButton } from "../Property/PropertyButtons";
import { PropertyGroupHeader } from "../Property/PropertyGroupHeader";
import { PropertyHeader } from "../Property/styles";
import { formatToSignificant } from "utils/format";





interface AttributeFilterProps {
  selectedAttributes?: AttributeFilter[];
  addAttributeFilter: (attribute: Attribute) => void;
  removeAttributeFilter: (attribute: Attribute) => void;
  clearAllOfTraitType: (traitType: string) => void;
  traitType: string;
  attributes: Attribute[];
  totalSupply?: number;
  isMobileLayout?: boolean;
  defaultIsOpen?: boolean;
}

export const AttributesFilter: React.FC<AttributeFilterProps> = ({
  selectedAttributes,
  addAttributeFilter,
  removeAttributeFilter,
  clearAllOfTraitType,
  traitType,
  attributes,
  totalSupply,
  isMobileLayout,
  defaultIsOpen = false,
}) => {
  const { t } = useTranslation();
  const { isCollapsed, onToggle } = useFilterLayout();
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen });

  const handleHeaderClick = () => {
    if (isCollapsed) {
      onToggle();
      return;
    }
    if (isOpen) {
      onClose();
      return;
    }
    onOpen();
    return;
  };

  return (
    <Box>
      <PropertyGroupHeader
        width="100%"
        label={capitalize(traitType)}
        color="text-01"
        leftIcon={<ListIcon />}
        rightIcon={isOpen ? <ChevronUp color="text-03" /> : <ChevronDown color="text-03" />}
        onClick={handleHeaderClick}
        isCollapsed={isMobileLayout ? false : isCollapsed}
      />

      <Fade unmountOnExit in={!isCollapsed}>
        <Collapse unmountOnExit in={isOpen}>
          <Box px={4} pt={4} pb={2} whiteSpace="nowrap" bg="ui-bg">
            <Flex pb={4} justifyContent="flex-end" alignItems="center">
              <Button
                onClick={() => clearAllOfTraitType(traitType)}
                variant="outline"
                colorScheme="gray"
                size="xs"
                mr={2}
              >
                {t("Clear")}
              </Button>
              <Popover
                strategy="fixed"
                label={
                  <Box whiteSpace="normal">
                    <TooltipText display="inline" bold>
                      {t("Count")}:{" "}
                    </TooltipText>
                    <TooltipText display="inline">{t("Total number of items with this property")}</TooltipText>
                  </Box>
                }
              >
                <Box>
                  <HelpIcon boxSize={6} />
                </Box>
              </Popover>
            </Flex>
            <Grid px={2} gridTemplateColumns="110px repeat(2, 1fr)" columnGap={2} pb={2}>
              <GridItem>
                <PropertyHeader>{t("Name")}</PropertyHeader>
              </GridItem>
              <GridItem textAlign="right">
                <PropertyHeader>{t("Lowest")}</PropertyHeader>
              </GridItem>
              <GridItem textAlign="right">
                <PropertyHeader>{t("Count")}</PropertyHeader>
              </GridItem>
            </Grid>
            <Box
              maxHeight="298px"
              overflowY="auto"
              sx={{
                scrollbarWidth: "none",
                "::-webkit-scrollbar": {
                  display: "none",
                },
              }}
            >
              {attributes.map((attribute) => {
                const { traitType: _traitType, value, count, floorOrder } = attribute;
                const indexOfSelectedTraitType = findIndex(
                  selectedAttributes,
                  (selectedAttribute) => selectedAttribute.traitType === _traitType
                );
                const selectedTraitType = selectedAttributes && selectedAttributes[indexOfSelectedTraitType];
                const isAttributeSelected = selectedTraitType && selectedTraitType.values.includes(value);

                return (
                  <BasicPropertyButton
                    onClick={() =>
                      isAttributeSelected ? removeAttributeFilter(attribute) : addAttributeFilter(attribute)
                    }
                    key={_traitType + value}
                    isActive={isAttributeSelected}
                    label={value}
                    mb={2}
                    count={count}
                    total={totalSupply}
                    floorPrice={floorOrder ? formatToSignificant(BigNumber.from(floorOrder.price), 4) : "-"}
                  />
                );
              })}
            </Box>
          </Box>
        </Collapse>
      </Fade>
    </Box>
  );
};
