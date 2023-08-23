import { ChevronDown, ChevronUpIcon, Text } from "uikit";
import { ButtonProps  } from "uikit/Button/Button";
import { TextProps } from "uikit/Text/Text"
import { TextButton } from "components/Buttons/TextButton";

interface PropertyLabelProps extends TextProps {
  isActive?: boolean;
}

export const PropertyLabel: React.FC<PropertyLabelProps> = ({ isActive = false, ...props }) => (
  <Text as="span" textStyle="detail" color={isActive ? "link-01" : "text-02"} bold flex={1} {...props} />
);

export interface PropertyHeaderProps extends ButtonProps {
  isSelected?: boolean;
  sortDir?: "asc" | "desc";
}

export const PropertyHeader: React.FC<PropertyHeaderProps> = ({ isSelected = false, sortDir, ...props }) => {
  const getSortIcon = () => {
    if (!sortDir) {
      return undefined;
    }

    return sortDir === "asc" ? <ChevronUpIcon boxSize={4} /> : <ChevronDown boxSize={4} />;
  };

  return (
    <TextButton
      variant="ghost"
      size="xs"
      color={isSelected ? "interactive-03" : "text-02"}
      rightIcon={getSortIcon()}
      {...props}
    />
  );
};
