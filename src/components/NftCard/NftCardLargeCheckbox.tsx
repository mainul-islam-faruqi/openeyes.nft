import { IconButton } from "@chakra-ui/react";
import { CheckboxCheckedFilledIcon, CheckboxOutlineIcon } from "uikit";

interface NftCardLargeCheckboxProps {
  isChecked: boolean;
}

export const NftCardLargeCheckbox: React.FC<NftCardLargeCheckboxProps> = ({ isChecked }) => {
  return (
    <IconButton
      size="sm"
      aria-label="Card select checkbox"
      variant={isChecked ? "solid" : "ghost"}
      colorScheme={isChecked ? "primary" : "secondary"}
    >
      {isChecked ? <CheckboxCheckedFilledIcon /> : <CheckboxOutlineIcon />}
    </IconButton>
  );
};
