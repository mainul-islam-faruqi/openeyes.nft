import { Flex } from "@chakra-ui/layout";
import { navHeightResponsive } from "uikit/theme/global";
import { FILTER_LAYOUT_TAB_Z_INDEX } from "./context";

export const FilterLayoutStickyTabs: React.FC = ({ children, ...props }) => {
  return (
    <Flex
      zIndex={FILTER_LAYOUT_TAB_Z_INDEX}
      position="sticky"
      top={navHeightResponsive}
      bg="ui-bg"
      justifyContent="start"
      width="100%"
      borderBottom="1px solid"
      borderTop="1px solid"
      borderBottomColor="border-01"
      borderColor="border-01"
      overflowX="auto" // note "scroll" will force a scrollbar in some browsers
      {...props}
    >
      {children}
    </Flex>
  );
};
