import { Box, BoxProps, Stack, Flex } from "@chakra-ui/react";
import { SIDEBAR_MAX_HEIGHT } from "components/Layout/FilterLayout";
import { navHeightResponsive } from "uikit/theme/global";
import { useMultiselect } from "./hooks/useMultiselect";
import { MultiselectSidebarHeader } from "./MultiselectSidebarHeader";

/**
 * NOTE this module is heavily copied from FilterLayoutSidebar. Factoring opportunities abound
 */

interface ButtonColumnOverlayProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

/**
 * While collapsed, the entire column below the MultiselectSidebarHeader becomes a clickable area to expand the sidebar
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

export const MultiselectSidebar: React.FC<BoxProps> = ({ children, ...props }) => {
  const { onToggle, sidebarWidthCollapsed, sidebarWidthOpen, transitionDur, isCollapsed, selectedItems } =
    useMultiselect();

  return (
    <Box
      bg="ui-01"
      transition="width"
      transitionDuration={transitionDur}
      transitionTimingFunction="ease"
      width={isCollapsed ? sidebarWidthCollapsed : sidebarWidthOpen}
      flexShrink={0}
      display={{ base: "none", md: "block" }}
      position="sticky"
      top={navHeightResponsive}
      left={0}
      zIndex="docked"
      height={SIDEBAR_MAX_HEIGHT}
      maxHeight={SIDEBAR_MAX_HEIGHT}
      pb={6}
      overflowX="hidden"
      overflowY="auto"
      sx={{
        scrollbarWidth: "none",
        "::-webkit-scrollbar": {
          display: "none",
        },
      }}
      borderLeft="1px solid"
      borderColor="border-01"
      {...props}
    >
      <Flex zIndex={3} position="sticky" top={0} bg="ui-bg" borderBottom="1px solid" borderColor="border-01">
        <MultiselectSidebarHeader
          isCollapsed={isCollapsed}
          onToggle={onToggle}
          selectedCount={selectedItems.length}
          mb="1px"
        />
      </Flex>
      <ButtonColumnOverlay isCollapsed={isCollapsed} onToggle={onToggle} />
      <Stack direction="column" spacing={0}>
        {children}
      </Stack>
    </Box>
  );
};
