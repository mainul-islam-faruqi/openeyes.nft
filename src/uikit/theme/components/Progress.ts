const Progress = {
  baseStyle: {
    filledTrack: {
      bgColor: "interactive-01",
    },
    track: {
      bg: "interactive-02",
    },
  },
  variants: {
    rainbow: {
      filledTrack: {
        bg: "linear-gradient(90deg, #EE5396 0%, #F1C21B 32.04%, #49CD7A 66%, #4589FF 100%)",

        backgroundSize: "200% 100%",
        animation: "hue 6s infinite alternate",
        "@keyframes hue": {
          "0%": {
            WebkitFilter: "hue-rotate(0deg)",
          },
          "100%": {
            WebkitFilter: "hue-rotate(-1turn)",
          },
        },
      },
    },
  },
  defaultProps: {
    colorScheme: "green",
  },
};

export default Progress;
