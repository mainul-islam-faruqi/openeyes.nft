// import { useRef } from "react";
// import { Box, BoxProps, useOutsideClick, useBreakpointValue, Stack, Divider, Flex } from "@chakra-ui/react";
// import { navHeightResponsive } from "uikit/theme/global";
// import { useFilterLayout } from "./hooks";
// import { FilterHeader, SIDEBAR_MAX_HEIGHT } from ".";




import { useRef } from "react";
import { Box, BoxProps, useOutsideClick, useBreakpointValue, Stack, Divider, Flex } from "@chakra-ui/react";
import { navHeightResponsive } from "uikit/theme/global";
import { useFilterLayout } from "./hooks";
// import { FilterHeader, SIDEBAR_MAX_HEIGHT } from ".";
import {FilterHeader} from "./FilterHeader"
import {SIDEBAR_MAX_HEIGHT} from "components/Layout/FilterLayout/context"






interface ButtonColumnOverlayProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

/**
 * While collapsed, the entire column below the FilterHeader becomes a clickable area to expand the filters sidebar
 */
const ButtonColumnOverlay = ({ isCollapsed, onToggle }: ButtonColumnOverlayProps) => {
  return (
    <Box
      onClick={onToggle}
      sx={{
        cursor: "pointer",
        position: "absolute",
        height: "100%",
        width: "100%",
        bg: "ui-01",
        _hover: {
          bg: "hover-ui",
        },
        _active: {
          bg: "onclick-ui",
        },
      }}
      transition="opacity"
      transitionDuration="350ms"
      opacity={isCollapsed ? 1 : 0}
      display={isCollapsed ? "block" : "none"}
      zIndex={2}
    />
  );
};

export const FilterLayoutSidebar: React.FC<BoxProps> = ({ children, ...props }) => {
  const ref = useRef(null);
  const { isCollapsed, onToggle, sidebarWidthCollapsed, sidebarWidthOpen, transitionDur } = useFilterLayout();
  const isEnabledAtBreakpoint = useBreakpointValue({ base: false, sm: true, md: false });
  useOutsideClick({
    ref: ref,
    enabled: !isCollapsed && isEnabledAtBreakpoint,
    handler: () => onToggle(),
  });

  return (
    <Box
      ref={ref}
      bg="ui-01"
      transition="width"
      transitionDuration={transitionDur}
      transitionTimingFunction="ease"
      width={isCollapsed ? sidebarWidthCollapsed : sidebarWidthOpen}
      flexShrink={0}
      display={{ base: "none", sm: "block" }}
      position="sticky"
      top={navHeightResponsive}
      left={0}
      zIndex="docked"
      height={SIDEBAR_MAX_HEIGHT}
      maxHeight={SIDEBAR_MAX_HEIGHT}
      pb={6}
      overflowX="hidden"
      overflowY="scroll"
      sx={{
        scrollbarWidth: "none",
        "::-webkit-scrollbar": {
          display: "none",
        },
      }}
      borderRight="1px solid"
      borderColor="border-01"
      {...props}
    >
      <Flex zIndex={3} position="sticky" top={0} bg="ui-bg" borderBottom="1px solid" borderColor="border-01">
        <FilterHeader />
      </Flex>
      <ButtonColumnOverlay isCollapsed={isCollapsed} onToggle={onToggle} />
      <Stack direction="column" spacing={0} divider={<Divider />}>
        {children}
      </Stack>
    </Box>
  );
};
