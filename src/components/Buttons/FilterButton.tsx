// import { Flex, Slide } from "@chakra-ui/react";
// import { useTranslation } from "react-i18next";
// import { Button, FilterIcon } from "uikit";
// import { FILTER_LAYOUT_MOBILE_BUTTON_Z_INDEX } from "components/Layout/FilterLayout";



import { Flex, Slide } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { Button } from "uikit/Button/Button";
import { FilterIcon } from "uikit";
import { FILTER_LAYOUT_MOBILE_BUTTON_Z_INDEX } from "../Layout/FilterLayout/context";



interface FilterButtonProps {
  showFilterButton?: boolean;
  onClick: () => void;
}

export const FilterButton: React.FC<FilterButtonProps> = ({ showFilterButton = true, onClick }) => {
  const { t } = useTranslation();

  return (
    <Slide direction="bottom" in={showFilterButton} style={{ zIndex: FILTER_LAYOUT_MOBILE_BUTTON_Z_INDEX }}>
      <Flex justifyContent="center" px={4} pb={5}>
        <Button width="66%" colorScheme="secondary" onClick={onClick} leftIcon={<FilterIcon boxSize={5} />} round>
          {t("Filter")}
        </Button>
      </Flex>
    </Slide>
  );
};
