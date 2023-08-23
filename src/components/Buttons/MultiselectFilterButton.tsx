// import { Flex, IconButton, Slide } from "@chakra-ui/react";
// import { useTranslation } from "react-i18next";
// import { Button, FilterIcon, ShoppingCartIcon } from "uikit";
// import { FILTER_LAYOUT_MOBILE_BUTTON_Z_INDEX } from "components/Layout/FilterLayout";



import { Flex, IconButton, Slide } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
// import { Button, FilterIcon, ShoppingCartIcon } from "uikit";
import { Button } from "uikit/Button/Button";
import { FilterIcon, ShoppingCartIcon } from "uikit";
import { FILTER_LAYOUT_MOBILE_BUTTON_Z_INDEX } from "../Layout/FilterLayout/context";



interface MultiselectFilterButtonProps {
  showFilterButton?: boolean;
  selectionCount: number;
  onClickFilter: () => void;
  onClickViewSelection: () => void;
}

export const MultiselectFilterButton: React.FC<MultiselectFilterButtonProps> = ({
  showFilterButton = true,
  onClickFilter,
  onClickViewSelection,
  selectionCount,
}) => {
  const { t } = useTranslation();

  return (
    <Slide direction="bottom" in={showFilterButton} style={{ zIndex: FILTER_LAYOUT_MOBILE_BUTTON_Z_INDEX }}>
      <Flex width="100%" justifyContent="center" px={4} pb={5} gap={4}>
        <IconButton isRound colorScheme="secondary" onClick={onClickFilter} aria-label={"Toggle-show-filters"}>
          <FilterIcon boxSize={5} />
        </IconButton>
        <Button
          flexGrow={1}
          colorScheme="primary"
          onClick={onClickViewSelection}
          leftIcon={<ShoppingCartIcon boxSize={5} />}
          round
        >
          {t("View Selections ({{selectionCount}})", { selectionCount })}
        </Button>
      </Flex>
    </Slide>
  );
};
