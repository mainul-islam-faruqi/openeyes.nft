// import { Flex, TagLabel, TagCloseButton } from "@chakra-ui/react";
// import { useTranslation } from "react-i18next";
// import { Button, Tag, Text } from "uikit";
// import { useEventTypeLabels } from "hooks/useEventTypeLabels";
// import { useActivityFilter } from "components/Filters";



import { Flex, TagLabel, TagCloseButton } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { Button } from "uikit/Button/Button";
import { Tag } from "uikit/Tag/Tag";
import { Text } from "uikit/Text/Text";
import { useEventTypeLabels } from "hooks/useEventTypeLabels";
import { useActivityFilter } from "../Filters/hooks/useActivityFilter";





interface ActivityFiltersProps {
  isMobileLayout?: boolean;
}
export const ActivityFilterList = ({ isMobileLayout }: ActivityFiltersProps) => {
  const { t } = useTranslation();
  const { filters, toggleFilterType, resetFilters } = useActivityFilter();
  const eventTypeLabels = useEventTypeLabels();

  return (
    <Flex alignItems="center" flexWrap="wrap" pb={isMobileLayout ? 0 : 2} bg={isMobileLayout ? "ui-01" : "ui-bg"}>
      <Text textStyle="detail" color="text-02" mr={2} mb={2} height={8} lineHeight={8}>
        {t("Filters")}:
      </Text>
      {filters.type &&
        filters.type.map((filterType) => {
          return (
            <Tag key={filterType} mr={2} mb={2} onClick={() => toggleFilterType(filterType)} cursor="pointer">
              <TagLabel>{eventTypeLabels[filterType]}</TagLabel>
              <TagCloseButton />
            </Tag>
          );
        })}
      {filters.type && filters.type.length > 0 && (
        <Button variant="outline" colorScheme="secondary" size="xs" mb={2} onClick={resetFilters}>
          {t("Clear All")}
        </Button>
      )}
    </Flex>
  );
};
