import { RadioProps } from "@chakra-ui/radio";

const Radio = {
  baseStyle: (props: RadioProps) => {
    const { isDisabled } = props;
    return {
      container: {
        cursor: !isDisabled && "pointer",
        _hover: {
          bg: !isDisabled && "ui-01",
        },
      },
      // Text
      label: {
        ml: 3,
        color: "text-01",
        _disabled: {
          opacity: 1,
          color: "text-03",
        },
      },
      // Radio box
      control: {
        color: "text-01",
        borderColor: "text-01",
        _checked: {
          bg: "black",
          borderColor: "text-01",
          color: "text-01",
          _hover: {
            bg: "black",
            borderColor: "text-01",
          },
        },
        _disabled: {
          borderColor: "border-02",
          bg: "black",
          _checked: {
            bg: "black",
            color: "text-03",
            borderColor: "border-02",
          },
        },
      },
    };
  },
};

export default Radio;
