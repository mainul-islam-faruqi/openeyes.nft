import { colors } from "../colors";

const Modal = {
  baseStyle: {
    dialog: {
      borderRadius: "0",
      bg: "ui-01",
      border: "1px solid",
      borderColor: "border-01",
    },
    header: {
      color: "text-01",
      minHeight: "48px",
      px: 4,
      py: 3,
      borderBottom: "1px solid",
      borderBottomColor: "border-01",
    },
    body: {
      color: "text-02",
      py: 6,
      px: 4,
    },
    footer: {
      p: 0,
    },
    closeButton: {
      top: 3,
      right: 2.5,
      _hover: {
        bg: "hover-ui",
      },
    },
  },
  variants: {
    standard: {
      overlay: {
        bg: `${colors.purple[900]}D9`,
        backdropFilter: "blur(8px)",
      },
    },
    rainbow: {
      overlay: {
        bg: "conic-gradient(from 90deg at 50% 51.52%, #4589FFE6 0deg, #FF7EB6E6 141.23deg, #F1C21BE6 231.23deg, #49CD7AE6 287.48deg, #4589FFE6 360deg);",
        filter: "blur(8px)",
        transform: "matrix(1, 0, 0, -1, 0, 0)",
        width: "150%",
        height: "150%",
        left: "-50%",
        top: "-25%",
      },
    },
  },
  sizes: {
    sm: {
      dialog: {
        maxWidth: "360px",
      },
      header: {
        h4: {
          fontSize: "16px",
          lineHeight: "24px",
        },
      },
    },
    md: {
      dialog: {
        maxWidth: "512px",
      },
      header: {
        h4: {
          fontSize: "20px",
          lineHeight: "32px",
        },
      },
    },
  },
  defaultProps: {
    variant: "standard",
  },
};

export default Modal;
