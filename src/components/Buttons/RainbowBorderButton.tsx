import { Flex, FlexProps } from "@chakra-ui/react";
import { Button, ButtonProps } from "uikit/Button/Button";

interface RainbowBorderButtonProps extends ButtonProps {
  boxProps?: FlexProps;
}

export const RainbowBorderButton: React.FC<RainbowBorderButtonProps> = ({ children, boxProps, ...props }) => {
  const rainbowButtonProps = {
    border: "none",
    backgroundImage: "linear-gradient(90deg, #EE5396 0%, #F1C21B 32.04%, #49CD7A 66%, #4589FF 100%)",
    p: "1px",
  };
  return (
    <Button
      borderRadius="5px"
      height="fit-content"
      sx={{
        bosSizing: "border-box",
        _hover: {
          textDecoration: "none",
        },
        _active: {
          border: "none",
        },
      }}
      {...rainbowButtonProps}
      {...props}
    >
      <Flex
        px={3}
        py={2}
        borderRadius={props.round ? 24 : "4px"}
        background="ui-01"
        justifyContent="center"
        alignItems="center"
        whiteSpace="normal"
        sx={{
          _hover: { background: "ui-bg" },
          transitionProperty: "var(--lr-transition-property-common)",
          transitionDuration: "var(--lr-transition-duration-normal)",
        }}
        {...boxProps}
      >
        {children}
      </Flex>
    </Button>
  );
};

RainbowBorderButton.defaultProps = {
  colorScheme: "gray",
};
