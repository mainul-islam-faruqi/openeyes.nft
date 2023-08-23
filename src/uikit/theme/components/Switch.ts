import { SwitchProps } from "@chakra-ui/switch";

const Switch = {
  baseStyle: {
    track: {
      p: 0,
      bg: "interactive-02",
      display: "flex",
      alignItems: "center",
      _checked: {
        bg: "blue.400",
        _disabled: {
          bg: "interactive-02",
        },
      },
      _disabled: {
        bg: "interactive-02",
      },
    },
    label: {
      _hover: {
        bg: "transparent",
      },
    },
    thumb: {
      bg: "text-02",
      _checked: {
        bg: "white",
      },
      _disabled: {
        bg: "text-disabled",
      },
    },
  },
  sizes: {
    md: (props: SwitchProps) => {
      const { isDisabled } = props;
      return {
        container: {
          cursor: isDisabled ? "not-allowed" : "pointer",
          transition: "background-color 0.1s ease-out",
          py: "12px",
        },
        track: {
          pl: "3.25px",
          w: "48px",
          h: "24px",
        },
        thumb: {
          w: "17.5px",
          h: "17.5px",
          _checked: {
            transform: `translateX(26px)`,
          },
        },
      };
    },
    sm: (props: SwitchProps) => {
      const { isDisabled } = props;
      return {
        container: {
          cursor: isDisabled ? "not-allowed" : "pointer",
          transition: "background-color 0.1s ease-out",
          py: "8px",
        },
        track: {
          pl: "2.75px",
          w: "32px",
          h: "16px",
        },
        thumb: {
          w: "10.5px",
          h: "10.5px",
          _checked: {
            transform: `translateX(18px)`,
          },
        },
      };
    },
  },
};

export default Switch;
