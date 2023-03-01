// import { useTranslation } from "react-i18next";
// import { PropertyGroupHeader } from "components/Property";
// import { ChevronLeft, FilterIcon } from "uikit";
// import { useFilterLayout } from "./hooks";



import { useTranslation } from "react-i18next";
import { PropertyGroupHeader } from "../../Property/PropertyGroupHeader";
import ChevronLeft from "uikit/Icons/components/ChevronLeft";
import { FilterIcon } from "uikit";
import { useFilterLayout } from "./hooks";





export const FilterHeader = () => {
  const { t } = useTranslation();
  const { isCollapsed, onToggle } = useFilterLayout();

  return (
    <PropertyGroupHeader
      bg="ui-bg"
      borderTop="1px solid"
      borderTopColor="border-01"
      label={t("Filters")}
      color="link-01"
      leftIcon={isCollapsed ? <FilterIcon boxSize={5} /> : <ChevronLeft boxSize={5} />}
      hideRightIcon
      onClick={onToggle}
      isCollapsed={isCollapsed}
      mb="1px"
    />
  );
};
