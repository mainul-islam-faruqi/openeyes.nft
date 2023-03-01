// import { ReactElement } from "react";
// import { useDisclosure } from "@chakra-ui/hooks";
// import { GridProps, Collapse, Fade, Grid, Box } from "@chakra-ui/react";
// import { ChevronDown, ChevronUp, ListIcon } from "uikit";
// import { useFilterLayout } from "components/Layout/FilterLayout/hooks";
// import { PropertyGroupHeader } from "components/Property";




import { ReactElement } from "react";
import { useDisclosure } from "@chakra-ui/hooks";
import { GridProps, Collapse, Fade, Grid, Box } from "@chakra-ui/react";
import ChevronDown from "uikit/Icons/components/ChevronDown";
import ChevronUp from "uikit/Icons/components/ChevronUp";
import { ListIcon } from "uikit";
import { useFilterLayout } from "../Layout/FilterLayout/hooks";
import { PropertyGroupHeader } from "../Property/PropertyGroupHeader";







interface ButtonTogglesFilterProps extends GridProps {
  label: string;
  LeftIcon?: ReactElement;
  defaultIsOpen?: boolean;
  isMobileLayout?: boolean;
}

export const ButtonTogglesFilter: React.FC<ButtonTogglesFilterProps> = ({
  label,
  LeftIcon = <ListIcon boxSize={5} />,
  defaultIsOpen,
  isMobileLayout,
  children,
}) => {
  const { isCollapsed, onToggle } = useFilterLayout();
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen });

  const handleHeaderClick = () => {
    if (isCollapsed) {
      onToggle();
      return;
    }
    if (isOpen) {
      onClose();
      return;
    }
    onOpen();
    return;
  };

  return (
    <Box borderBottom="1px solid" borderBottomColor="border-01">
      <PropertyGroupHeader
        width="100%"
        label={label}
        color="text-01"
        leftIcon={LeftIcon}
        rightIcon={isOpen ? <ChevronUp color="text-03" /> : <ChevronDown color="text-03" />}
        onClick={() => handleHeaderClick()}
        isCollapsed={isMobileLayout ? false : isCollapsed}
      />
      <Fade unmountOnExit in={!isCollapsed}>
        <Collapse unmountOnExit in={isOpen}>
          <Grid bg="ui-bg" p={4} templateColumns="1fr 1fr" rowGap={2} columnGap={2} display="grid" whiteSpace="nowrap">
            {children}
          </Grid>
        </Collapse>
      </Fade>
    </Box>
  );
};
