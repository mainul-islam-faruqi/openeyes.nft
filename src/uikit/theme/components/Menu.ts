import { colors } from "../colors";

const Menu = {
  baseStyle: {
    gutter: 1,
    button: {
      textStyle: "detail",
      bg: "field-02",
      color: "text-01",
      width: "14rem",
      px: 4,
      py: 3,
      span: {
        textAlign: "left",
      },
      boxShadow: `inset 0px -1px 0px ${colors.gray[500]}`,
      _hover: {
        bg: "hover-ui",
      },
    },
    list: {
      zIndex: 5,
      py: 1,
      borderRadius: 0,
      border: "1px solid",
      borderColor: "ui-inverse",
      bg: "ui-02",
    },
    item: {
      textStyle: "detail",
      px: 4,
      py: 2,
      _hover: {
        bg: "hover-ui",
        _active: {
          bg: "onclick-ui",
        },
      },
    },
    divider: {
      borderColor: "border-02",
      my: 1,
      opacity: 1,
    },
  },
  sizes: {
    sm: {
      button: {
        py: 2,
      },
    },
    md: {
      button: {
        py: 3,
      },
    },
  },
  defaultProps: {
    size: "sm",
  },
};

export default Menu;
