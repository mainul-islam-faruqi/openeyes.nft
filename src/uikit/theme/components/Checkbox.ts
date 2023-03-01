const Checkbox = {
  baseStyle: {
    // Text
    label: {
      ml: 3,
      color: "link-02",
      _disabled: {
        opacity: 1,
        color: "text-disabled",
      },
    },
    // Check box
    control: {
      p: 2,
      borderColor: "link-02",
      bg: "transparent",
      color: "text-inverse",
      _checked: {
        borderColor: "link-02",
        bg: "link-02",
        color: "text-inverse",
        _hover: {
          bg: "hover-ui-inverse",
          borderColor: "hover-ui-inverse",
        },
      },
      _indeterminate: {
        bg: "link-02",
        borderColor: "link-02",
        _hover: {
          bg: "hover-ui-inverse",
          borderColor: "hover-ui-inverse",
        },
      },
      _disabled: {
        borderColor: "text-disabled",
        bg: "transparent",
        color: "text-inverse",
        _checked: {
          bg: "text-disabled",
          color: "text-inverse",
          _hover: {
            borderColor: "text-disabled",
          },
        },
        _indeterminate: {
          color: "text-inverse",
        },
      },
      _hover: {
        bg: "hover-ui",
      },
    },
  },
};

export default Checkbox;
