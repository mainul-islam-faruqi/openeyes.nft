// import { createContext } from "react";
// import { useDisclosure, UseDisclosureReturn } from "@chakra-ui/react";
// import { navHeightResponsive } from "uikit/theme/global";




import { createContext } from "react";
import { useDisclosure, UseDisclosureReturn } from "@chakra-ui/react";
import { navHeightResponsive } from "uikit/theme/global";






export const DEFAULT_TRANSITION_DUR = "350ms";
export const SIDEBAR_WIDTH_COLLAPSED = 14;
export const SIDEBAR_WIDTH_OPEN = 80;
export const FILTER_LAYOUT_CONTENT_PADDING = {
  py: { base: 6 },
  px: { base: 4 },
};

export const SIDEBAR_MAX_HEIGHT = {
  base: `calc(100vh - ${navHeightResponsive.base} - 1px)`,
  md: `calc(100vh - ${navHeightResponsive.md} - 1px)`,
};

// tab zIndex must be higher than "docked" (10) Play Button in video TokenMedia
export const FILTER_LAYOUT_TAB_Z_INDEX = 11;
export const FILTER_LAYOUT_MOBILE_BUTTON_Z_INDEX = FILTER_LAYOUT_TAB_Z_INDEX + 1;

export interface FilterLayoutReturn extends UseDisclosureReturn {
  transitionDur: string;
  sidebarWidthCollapsed: number;
  sidebarWidthOpen: number;
}

export const FilterLayoutContext = createContext<FilterLayoutReturn | undefined>(undefined);

export const FilterLayoutProvider: React.FC<{ defaultIsOpen?: boolean }> = ({ children, defaultIsOpen = false }) => {
  const value = useDisclosure({ defaultIsOpen });
  return (
    <FilterLayoutContext.Provider
      value={{
        ...value,
        transitionDur: DEFAULT_TRANSITION_DUR,
        sidebarWidthCollapsed: SIDEBAR_WIDTH_COLLAPSED,
        sidebarWidthOpen: SIDEBAR_WIDTH_OPEN,
      }}
    >
      {children}
    </FilterLayoutContext.Provider>
  );
};
