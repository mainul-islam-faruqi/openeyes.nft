import { ButtonProps } from "uikit/Button";

// @TODO add black colorScheme
function getOutlineBorder(colorScheme?: string) {
  switch (colorScheme) {
    case "danger":
    case "red":
      return "support-error";
    case "secondary":
    case "gray":
      return "border-02";
    case "white":
      return "white";
    case "primary":
    case "green":
    default:
      return "interactive-01";
  }
}

function getPrimaryTextColor(variant?: string) {
  switch (variant) {
    case "outline":
    case "ghost":
      return "link-01";
    case "solid":
    default:
      return "text-primarybutton";
  }
}

function getPrimaryBgColors(variant?: string) {
  switch (variant) {
    case "outline":
    case "ghost":
      return {
        default: "transparent",
        hover: "hover-ui",
        active: "onclick-ui",
        focus: "transparent",
      };
    case "solid":
    default:
      return {
        default: "interactive-01",
        hover: "hover-interactive-01",
        active: "onclick-interactive-01",
        focus: "interactive-01",
      };
  }
}

function getSecondaryTextColor(variant?: string) {
  switch (variant) {
    case "outline":
    case "ghost":
      return "link-02";
    case "solid":
    default:
      return "link-02";
  }
}
function getSecondaryBgColors(variant?: string) {
  switch (variant) {
    case "outline":
    case "ghost":
      return {
        default: "transparent",
        hover: "hover-interactive-02",
        active: "onclick-interactive-02",
        focus: "transparent",
      };
    case "solid":
    default:
      return {
        default: "interactive-02",
        hover: "hover-interactive-02",
        active: "onclick-interactive-02",
        focus: "interactive-02",
      };
  }
}

function getDangerTextColor(variant?: string) {
  switch (variant) {
    case "outline":
    case "ghost":
      return "text-error";
    case "solid":
    default:
      return "link-02";
  }
}

function getDangerBgColors(variant?: string) {
  switch (variant) {
    case "outline":
    case "ghost":
      return {
        default: "transparent",
        hover: "hover-ui",
        active: "onclick-ui",
        focus: "transparent",
      };
    case "solid":
    default:
      return {
        default: "support-error-inverse",
        hover: "hover-error",
        active: "onclick-error",
        focus: "support-error-inverse",
      };
  }
}

function applyColorScheme(colorScheme?: string, variant?: string) {
  const { default: primaryDefaultBg, hover: primaryHoverBg, active: primaryActiveBg } = getPrimaryBgColors(variant);
  const {
    default: secondaryDefaultBg,
    hover: secondaryHoverBg,
    active: secondaryActiveBg,
  } = getSecondaryBgColors(variant);
  const { default: dangerDefaultBg, hover: dangerHoverBg, active: dangerActiveBg } = getDangerBgColors(variant);

  switch (colorScheme) {
    case "green":
    case "primary":
      return {
        bg: primaryDefaultBg,
        bgColor: primaryDefaultBg,
        color: getPrimaryTextColor(variant),
        _hover: {
          bg: primaryHoverBg,
          bgColor: primaryHoverBg,
          textDecoration: "none",
          _disabled: {
            bg: secondaryDefaultBg,
            bgColor: secondaryDefaultBg,
          },
        },
        _active: {
          bg: primaryActiveBg,
          bgColor: primaryActiveBg,
          border: "1px solid",
          borderColor: "focus",
        },
      };
    case "gray":
    case "secondary":
      return {
        background: secondaryDefaultBg,
        bg: secondaryDefaultBg,
        bgColor: secondaryDefaultBg,
        color: getSecondaryTextColor(variant),
        _hover: {
          bg: secondaryHoverBg,
          bgColor: secondaryHoverBg,
          textDecoration: "none",
          _disabled: {
            bg: secondaryDefaultBg,
            bgColor: secondaryDefaultBg,
          },
        },
        _active: {
          bg: secondaryActiveBg,
          bgColor: secondaryActiveBg,
          border: "1px solid",
          borderColor: "focus",
        },
      };
    case "red":
    case "danger":
      return {
        background: dangerDefaultBg,
        bg: dangerDefaultBg,
        bgColor: dangerDefaultBg,
        color: getDangerTextColor(variant),
        _hover: {
          bg: dangerHoverBg,
          bgColor: dangerHoverBg,
          textDecoration: "none",
          _disabled: {
            bg: secondaryDefaultBg,
            bgColor: secondaryDefaultBg,
          },
        },
        _active: {
          bg: dangerActiveBg,
          bgColor: dangerActiveBg,
          border: "1px solid",
          borderColor: "focus",
        },
      };
    case "white":
      return {
        background: "ui-inverse",
        bg: "ui-inverse",
        bgColor: "ui-inverse",
        color: "text-inverse",
        _hover: {
          bg: "ui-inverse",
          bgColor: "ui-inverse",
          textDecoration: "none",
          _disabled: {
            bg: secondaryDefaultBg,
            bgColor: secondaryDefaultBg,
          },
        },
        _active: {
          bg: "ui-inverse",
          bgColor: "ui-inverse",
          border: "1px solid",
          borderColor: "focus",
        },
      };
    case "black":
      // note black is only used on banners (forced-dark-mode scheme)
      return {
        _hover: {
          bg: "rgba(0, 0, 0, 0.12)",
          textDecoration: "none",
        },
        _active: {
          bg: "rgba(0, 0, 0, 0.18)",
          textDecoration: "none",
        },
      };
    default:
      // this applies chakra's default colorScheme
      return {};
  }
}

/**
 * Applied to every Button
 * These properties get overridden by supplying a `variant`
 */
const baseStyle = (props: ButtonProps) => {
  const { colorScheme, variant } = props;

  return {
    borderRadius: "0.25rem",
    fontWeight: "600",
    borderWidth: "1px",
    borderColor: "transparent",
    _disabled: {
      opacity: 1,
    },
    ...applyColorScheme(colorScheme, variant),
  };
};

const solidDisabled = {
  bg: "interactive-02",
  bgColor: "interactive-02",
  color: "text-disabled",
  _hover: {
    bg: "interactive-02",
    bgColor: "interactive-02",
  },
};

const transparentDisabled = {
  color: "text-disabled",
  borderColor: "border-01",
  _hover: {
    bg: "transparent",
    bgColor: "transparent",
  },
};

/**
 * Base button changes
 */
const solidVariant = (props: ButtonProps) => ({
  ...applyColorScheme(props.colorScheme, props.variant),
  _disabled: solidDisabled,
});

const tallVariant = (props: ButtonProps) => {
  return {
    ...solidVariant(props),
    alignItems: "flex-start",
    borderRadius: 0,
    justifyContent: "space-between",
    minHeight: "5rem",
    height: "auto",
    pt: 3,
    "& > span": {
      alignSelf: "flex-start",
      mt: "-3px",
    },
  };
};

const ghostVariant = (props: ButtonProps) => ({
  ...applyColorScheme(props.colorScheme, props.variant),
  _disabled: transparentDisabled,
  _active: {
    borderColor: "transparent",
  },
});

const outlineVariant = ({ colorScheme, variant }: ButtonProps) => ({
  ...applyColorScheme(colorScheme, variant),
  borderColor: getOutlineBorder(colorScheme),
  borderTopColor: getOutlineBorder(colorScheme),
  borderLeftColor: getOutlineBorder(colorScheme),
  borderRightColor: getOutlineBorder(colorScheme),
  borderBottomColor: getOutlineBorder(colorScheme),
  _disabled: transparentDisabled,
});

// Legacy button colors are "green" | "gray" | "red"
// Semantic button colors = "primary" | "secondary" | "danger"
const Button = {
  baseStyle,
  // @TODO use "tall" as a size rather than a variant; note we did not not implement size="tall" yet
  sizes: {
    lg: {
      height: "3.5rem",
      minWidth: "3.5rem",
      fontSize: "md",
    },
    md: {
      height: "3rem",
      minWidth: "3rem",
      fontSize: "sm",
    },
    sm: {
      height: "2.5rem",
      minWidth: "2.5rem",
      fontSize: "sm",
    },
    xs: {
      height: "2rem",
      minWidth: "2rem",
      fontSize: "sm",
    },
  },
  // @TODO remove "tall" variant type. tall should be a size applicable to any variant
  variants: {
    solid: solidVariant,
    tall: tallVariant,
    ghost: ghostVariant,
    outline: outlineVariant,
  },
  defaultProps: {
    variant: "solid",
    colorScheme: "primary",
  },
};

export default Button;
