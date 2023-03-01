import { colors } from "../colors";

const Textarea = {
  variants: {
    filled: {
      bg: "field-02",
      border: "none",
      borderRadius: 0,
      boxShadow: `inset 0px -1px 0px ${colors.gray[500]}`,
      _hover: {
        bg: "field-02",
      },
      _invalid: {
        boxShadow: `0 0 0 2px ${colors.red[500]}`,
      },
      _readOnly: {
        // Removing !important on the Chakra version so we can override it in the date picker
        boxShadow: "none",
      },
    },
  },
  defaultProps: {
    variant: "filled",
  },
};

export default Textarea;
