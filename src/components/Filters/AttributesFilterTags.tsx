// import { Flex, TagLabel, TagCloseButton } from "@chakra-ui/react";
// import { Button, Tag } from "uikit";
// import { useTranslation } from "react-i18next";
// import { useTokenFilter } from ".";



import { Flex, TagLabel, TagCloseButton } from "@chakra-ui/react";
import { Button } from "uikit/Button/Button";
import { Tag } from "uikit/Tag/Tag";
import { useTranslation } from "react-i18next";
import { useTokenFilter } from "./hooks/useTokenFilter";





export const AttributesFilterTags: React.FC = () => {
  const { t } = useTranslation();
  const { clearAttributes, removeAttributeFilter, filter } = useTokenFilter();

  return (
    <Flex flexWrap="wrap">
      {filter.attributes &&
        filter.attributes.map((filterAttribute) => {
          return (
            filterAttribute.values &&
            filterAttribute.values.map((value) => (
              <Tag key={value + filterAttribute.traitType} mr={2} mb={2}>
                <TagLabel>{value}</TagLabel>
                <TagCloseButton
                  onClick={() => removeAttributeFilter({ traitType: filterAttribute.traitType, value })}
                />
              </Tag>
            ))
          );
        })}
      {filter.attributes && filter.attributes.length > 0 && (
        <Button size="xs" variant="outline" onClick={() => clearAttributes()}>
          {t("Clear all")}
        </Button>
      )}
    </Flex>
  );
};
