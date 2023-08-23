import { AlertProps, AlertStatus } from "@chakra-ui/react";

const darkBackgroundVariant = ({ status = "info" }: AlertProps) => {
  const statusColors: Record<AlertStatus, string> = {
    info: "support-info",
    warning: "support-warning",
    success: "support-success-inverse",
    error: "support-error",
  };

  const bgColors: Record<AlertStatus, string> = {
    info: "support-info-bg",
    warning: "support-warning-bg",
    success: "support-success-bg",
    error: "support-error-bg",
  };

  const statusColor = statusColors[status];
  const bg = bgColors[status];

  return {
    container: {
      bg,
      borderStartColor: statusColor,
    },
    title: {
      color: "text-01",
    },
    icon: {
      color: statusColor,
    },
  };
};

const highContrastVariant = ({ status = "info" }: AlertProps) => {
  const statusColors: Record<AlertStatus, string> = {
    info: "support-info-inverse",
    warning: "support-warning-inverse",
    success: "support-success-inverse",
    error: "support-error-inverse",
  };

  const contrastBgColors: Record<AlertStatus, string> = {
    info: "support-info-bg-inverse",
    warning: "support-warning-bg-inverse",
    success: "support-success-bg-inverse",
    error: "support-error-bg-inverse",
  };

  const statusColor = statusColors[status];
  const bg = contrastBgColors[status];

  return {
    container: {
      bg,
      borderStartColor: statusColor,
      borderInlineStartWidth: "4px",
    },
    description: {
      color: "text-inverse",
    },
    title: {
      color: "text-inverse",
    },
    icon: {
      color: statusColor,
    },
  };
};

const Alert = {
  baseStyle: {
    title: {
      color: "text-01",
      textStyle: "detail",
      fontWeight: 600,
    },
    description: {
      mt: 2.5,
      textStyle: "detail",
    },
    icon: {
      alignSelf: "start",
    },
    container: {
      border: "1px solid",
      borderColor: "border-01",
    },
  },
  variants: {
    "left-accent": darkBackgroundVariant,
    "left-accent-contrast": highContrastVariant,
  },
  defaultProps: {
    variant: "left-accent",
  },
};

export default Alert;
