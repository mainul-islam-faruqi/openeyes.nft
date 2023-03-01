import { StyleFunctionProps } from "@chakra-ui/theme-tools";
import { colors } from "../colors";

const Tag = {
  baseStyle: (props: StyleFunctionProps) => ({
    container: {
      cursor: props.isClickable ? "pointer" : "auto",
      fontWeight: 600,
      bg: "ui-02",
      borderRadius: "base",
    },
    closeButton: {
      opacity: 1,
    },
  }),
  variants: {
    solid: (props: StyleFunctionProps) => {
      const { isClickable } = props;
      // clickable tags behave like secondary button
      const interactiveStyles = isClickable
        ? {
            _hover: {
              bg: "hover-interactive-02",
            },
            _active: {
              bg: "onclick-interactive-02",
            },
          }
        : {};

      return {
        container: {
          bg: "ui-02",
          color: "link-02",
          ...interactiveStyles,
        },
      };
    },
    // note outline can be any color, not just our semantic colors
    outline: (props: StyleFunctionProps) => {
      const { colorScheme, colorMode, isClickable, round } = props;
      const isLightMode = colorMode === "light";
      const iconAndTextShade = isLightMode ? "400" : "300";
      const borderShade = isLightMode ? "200" : "600";

      const textColor = colors[colorScheme!][iconAndTextShade];

      return {
        color: textColor,
        container: {
          bg: "transparent",
          border: "1px solid",
          borderColor: colors[colorScheme][borderShade],
          color: textColor,
          borderRadius: round ? "8px" : "base",
          boxShadow: "none",
          _hover: isClickable
            ? {
                bg: "hover-ui",
              }
            : {},
          _active: isClickable
            ? {
                bg: "onclick-ui",
              }
            : {},
        },
      };
    },
  },
  sizes: {
    sm: {
      container: {
        textStyle: "helper",
      },
    },
    md: {
      container: {
        fontSize: "sm",
        lineHeight: "1.25rem",
        px: 2,
        py: "0.375rem",
      },
    },
  },
  defaultProps: {
    colorScheme: "gray",
    variant: "solid",
  },
};

export default Tag;
