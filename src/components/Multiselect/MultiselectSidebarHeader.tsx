import { useTranslation } from "react-i18next";
import { PropertyGroupHeader } from "components/Property";
import { ChevronRight, ShoppingCartAndBadgeIcon } from "uikit";
import { FlexProps } from "@chakra-ui/react";

interface MultiselectSidebarHeaderProps extends FlexProps {
  isCollapsed: boolean;
  onToggle: () => void;
  selectedCount?: number;
}

export const MultiselectSidebarHeader = ({
  isCollapsed,
  onToggle,
  selectedCount,
  ...flexProps
}: MultiselectSidebarHeaderProps) => {
  const { t } = useTranslation();
  return (
    <PropertyGroupHeader
      bg="ui-bg"
      borderTop="1px solid"
      borderTopColor="border-01"
      label={t("Selection")}
      count={selectedCount}
      color="link-01"
      rightIcon={isCollapsed ? undefined : <ChevronRight boxSize={5} />}
      leftIcon={isCollapsed ? <ShoppingCartAndBadgeIcon boxSize={5} /> : undefined}
      onClick={onToggle}
      isCollapsed={isCollapsed}
      {...flexProps}
    />
  );
};
