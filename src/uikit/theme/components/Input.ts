import { StyleFunctionProps } from "@chakra-ui/theme-tools";
import { colors } from "../colors";

const Input = {
  baseStyle: {
    field: {
      bg: "field-02",
      borderRadius: 0,
      _placeholder: { color: "text-placeholder" },
      _disabled: { color: "text-disabled" },
    },
  },
  sizes: {
    lg: {
      field: {
        borderRadius: 0,
        height: "3.5rem",
      },
      addon: {
        height: "3.5rem",
      },
    },
    md: {
      field: {
        borderRadius: 0,
        height: "3rem",
      },
      addon: {
        height: "3rem",
      },
    },
    sm: {
      field: {
        borderRadius: 0,
        height: "2rem",
      },
      addon: {
        height: "2rem",
      },
    },
  },
  variants: {
    flushed: ({ colorMode }: StyleFunctionProps) => ({
      field: {
        bg: "field-02",
        border: "none",
        boxShadow: `inset 0px -1px 0px ${colorMode === "light" ? colors.gray[200] : colors.gray[600]}`, // border-01
        px: 4,
        _hover: {
          bg: "field-02",
        },
        _invalid: {
          border: "1px solid",
          borderTopColor: "support-error",
          borderBottomColor: "support-error",
          borderLeftColor: "support-error",
          borderRightColor: "support-error",
          boxShadow: "none",
        },
        _readOnly: {
          // Removing !important on the Chakra version so we can override it in the date picker
          boxShadow: "none",
        },
      },
    }),
  },
  defaultProps: {
    variant: "flushed",
  },
};

export default Input;
