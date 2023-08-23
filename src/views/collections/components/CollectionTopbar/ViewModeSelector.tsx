import React from "react";
import { ButtonGroup, GridCompactIcon, GridRelaxedIcon, ListIcon } from "uikit";
import { ToggleListButton } from "components/Buttons";
import { useViewModeStore, ViewMode } from "hooks/useViewMode";
import { useBreakpointValueSsr } from "hooks/useBreakpointValueSsr";
import { usePageInfo } from "hooks/usePageInfo";

export const ViewModeSelector = () => {
  const { viewMode, setViewMode } = useViewModeStore();
  const handleChangeViewMode = (mode: ViewMode) => {
    if (viewMode !== mode) {
      setViewMode(mode);
    }
  };

  // Tableview view is currently limited to collection page on desktop
  const isGtLg = useBreakpointValueSsr({ base: false, lg: true });
  const isCollectionPage = usePageInfo().isCollectionPage;
  const shouldDisplaySelector = isCollectionPage && isGtLg;

  if (!shouldDisplaySelector) {
    return null;
  }

  return (
    <ButtonGroup isAttached size="md">
      <ToggleListButton
        px={0}
        onClick={() => handleChangeViewMode("table")}
        isActive={viewMode === "table"}
        data-id="collection-view-mode-set-mode-list"
      >
        <ListIcon />
      </ToggleListButton>

      <ToggleListButton
        px={0}
        data-id="collection-view-mode-set-mode-compact"
        onClick={() => handleChangeViewMode("compact")}
        isActive={viewMode === "compact"}
      >
        <GridCompactIcon />
      </ToggleListButton>

      <ToggleListButton
        px={0}
        data-id="collection-view-mode-set-mode-relaxed"
        onClick={() => handleChangeViewMode("relaxed")}
        isActive={viewMode === "relaxed"}
      >
        <GridRelaxedIcon />
      </ToggleListButton>
    </ButtonGroup>
  );
};
