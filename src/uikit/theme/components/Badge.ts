import { BadgeProps } from "@chakra-ui/layout";
import { getColor, mode, SystemStyleFunction } from "@chakra-ui/theme-tools";

const outlineVariant: SystemStyleFunction = (props) => {
  if (props.colorScheme === "gray") {
    const lightColor = getColor(props.theme, "gray.200");
    const darkColor = getColor(props.theme, "gray.600");
    const boxShadowColor = mode(lightColor, darkColor)(props);
    return {
      boxShadow: `inset 0 0 0px 1px ${boxShadowColor}`,
      color: "text-03",
    };
  }
  return {};
};

const Badge = {
  baseStyle: {
    borderRadius: "lg",
    textTransform: "normal",
    fontSize: "0.6875rem", // 11px...sigh
  },
  variants: {
    solid: (props: BadgeProps) => {
      return {
        bg: `${props.colorScheme}.300`,
        color: props.colorScheme === "black" ? "text-01" : "text-inverse",
      };
    },
    outline: outlineVariant,
  },
  defaultProps: {
    colorScheme: "green",
    variant: "solid",
  },
};

export default Badge;
