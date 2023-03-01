const lineVariant = {
  tab: {
    color: "text-02",
    borderColor: "border-01",
    _hover: {
      bg: "hover-ui",
    },
    _selected: {
      color: "text-01",
      borderColor: "interactive-01",
      _active: {
        bg: "onclick-ui",
      },
    },
    _active: {
      bg: "onclick-ui",
    },
  },
};

const blankVariant = {
  tab: {
    ...lineVariant.tab,
    borderBottomWidth: "2px",
    borderColor: "transparent",
  },
};

const enclosedVariant = {
  tab: {
    bg: "ui-01",
    borderBottom: 0,
    borderLeft: "1px solid",
    borderLeftColor: "border-01",
    borderRadius: 0,
    borderRight: 0,
    color: "text-01",
    mb: 0,
    _selected: {
      bg: "ui-bg",
      borderBottom: 0,
      borderLeft: "1px solid",
      borderLeftColor: "border-01",
      borderRight: 0,
      borderTop: "2px solid",
      borderTopColor: "interactive-01",
      color: "text-01",
      _hover: {
        bg: "hover-ui",
      },
      _active: {
        bg: "onclick-ui",
      },
    },
    _active: {
      bg: "onclick-ui",
    },
    ":first-of-type": {
      borderLeft: 0,
    },
    _hover: {
      bg: "hover-ui",
    },
  },
  tablist: {
    border: 0,
    mb: 0,
  },
};

const enclosedInvertedVariant = {
  ...enclosedVariant,
  tab: {
    ...enclosedVariant.tab,
    borderTopWidth: "2px",
    borderTopColor: "ui-bg",
    bg: "ui-bg",
    _hover: {
      bg: "hover-ui",
      borderTopColor: "hover-ui",
    },
    _selected: {
      ...enclosedVariant.tab._selected,
      bg: "ui-01",
      _hover: {
        bg: "hover-ui",
        borderTopColor: "interactive-01",
      },
    },
  },
};

const Tabs = {
  sizes: {
    md: {
      tab: {
        minHeight: 12,
      },
    },
  },
  baseStyle: {
    tab: {
      whiteSpace: "nowrap",
    },
  },
  variants: {
    line: lineVariant,
    blank: blankVariant,
    enclosed: enclosedVariant,
    "enclosed-inverted": enclosedInvertedVariant,
  },
  defaultProps: {
    colorScheme: "green",
  },
};

export default Tabs;
