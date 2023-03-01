import Link, { LinkProps } from "next/link";
import { Box, BoxProps } from "@chakra-ui/react";

const defaultActiveStyles = {
  bg: "ui-01",
  borderColor: "border-01",
  ".quick-action": {
    bg: "ui-01",
    visibility: "visible",
    pointerEvents: "auto",
  },
};

const getSx = (isActive: boolean, isMultiselectActive: boolean, isSelected: boolean, canListForSale: boolean) => {
  if (isMultiselectActive) {
    if (isSelected) {
      return {
        borderColor: "interactive-01",
        bg: "onclick-ui",
        _hover: {},
      };
    }

    if (canListForSale) {
      return {
        _hover: { bg: "ui-01", borderColor: "border-01" },
        _active: { bg: "onclick-ui" },
      };
    }

    // multiselect, but cannot list for sale
    return {
      opacity: 0.2,
      pointerEvents: "none",
    };
  }

  // not multiselect (default)
  return {
    ...(isActive && defaultActiveStyles),
    _active: { ...defaultActiveStyles, bg: "onclick-ui" },
    _hover: { ":not(:active)": defaultActiveStyles },
    transition: "all 200ms ease-out",
  };
};

interface NftCardContainerProps extends LinkProps {
  canListForSale?: boolean;
  isActive: boolean;
  isMultiselectActive?: boolean;
  isSelected?: boolean;
  onActive: () => void;
  onInactive: () => void;
  anchorProps?: BoxProps;
}

export const NftCardContainer: React.FC<NftCardContainerProps> = ({
  isActive,
  isMultiselectActive = false,
  isSelected = false,
  canListForSale = true,
  onActive,
  onInactive,
  children,
  anchorProps,
  ...props
}) => {
  const sx = getSx(isActive, isMultiselectActive, isSelected, canListForSale);

  return (
    <Link passHref {...props}>
      <Box
        as="a"
        display="block"
        border="1px solid"
        borderColor="ui-01"
        sx={sx}
        borderRadius="lg"
        width="100%"
        onTouchStart={onActive}
        onTouchEnd={onInactive}
        onMouseEnter={onActive}
        onMouseLeave={onInactive}
        {...anchorProps}
      >
        {children}
      </Box>
    </Link>
  );
};
