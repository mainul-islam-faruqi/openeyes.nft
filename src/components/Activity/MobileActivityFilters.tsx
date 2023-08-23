// import { Box, BoxProps, Divider } from "@chakra-ui/react";
// import MobileFilterModal from "components/Modals/MobileFilterModal";
// import { ActivityFilterList, ActivityFilters } from ".";






import { Box, BoxProps, Divider } from "@chakra-ui/react";
import MobileFilterModal from "../Modals/MobileFilterModal";
import {ActivityFilterList} from "./ActivityFilterList"
import {ActivityFilters} from "./ActivityFilters"




interface MobileActivityFiltersProps extends BoxProps {
  onFilterModalOpen(): void;
  isFilterModalOpen: boolean;
  onFilterModalClose(): void;
  resetFilters(): void;
}
export const MobileActivityFilters: React.FC<MobileActivityFiltersProps> = ({
  isFilterModalOpen,
  onFilterModalClose,
  resetFilters,
  ...props
}) => {
  return (
    <Box display={{ base: "block", sm: "none" }} {...props}>
      <MobileFilterModal isOpen={isFilterModalOpen} onClose={onFilterModalClose} onResetAll={resetFilters}>
        <Box p={4} pb={2} bg="ui-01">
          <ActivityFilterList isMobileLayout />
        </Box>
        <Divider />
        <ActivityFilters isMobileLayout />
      </MobileFilterModal>
    </Box>
  );
};
