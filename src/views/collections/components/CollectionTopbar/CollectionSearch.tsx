import { ChangeEvent } from "react";
import { useTranslation } from "next-i18next";
import { IconButton, InputRightElement } from "@chakra-ui/react";
import { CloseIcon, TextInput, TextInputProps } from "uikit";
import { useCollectionSearchStore } from "views/collections/shared";

interface CollectionSearchProps extends Omit<TextInputProps, "value" | "onChange"> {
  onClearSuccess?: TextInputProps["onClear"];
  showCustomClearButton?: boolean;
}

interface CustomClearButtonProps {
  onClear: TextInputProps["onClear"];
}

// Necessary so the clear button shows all the time
const CustomClearButton = ({ onClear }: CustomClearButtonProps) => (
  <InputRightElement>
    <IconButton size="xs" onClick={onClear} variant="ghost" colorScheme="gray" aria-label="clear search">
      <CloseIcon color="text-01" />
    </IconButton>
  </InputRightElement>
);

export const CollectionSearch = ({
  onClearSuccess,
  showCustomClearButton = false,
  ...props
}: CollectionSearchProps) => {
  const { t } = useTranslation();
  const [term, clearTerm, setTerm] = useCollectionSearchStore((state) => [state.term, state.clearTerm, state.setTerm]);

  const handleClear = () => {
    clearTerm();
    if (onClearSuccess) {
      onClearSuccess();
    }
  };

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { value } = evt.target;
    setTerm(value);
  };

  return (
    <TextInput
      value={term}
      isActive={!!term}
      onChange={handleChange}
      wrapperProps={{ width: "100%" }}
      placeholder={t("Name, Token ID...")}
      variant="lowcontrast"
      size="md"
      InputRightElement={showCustomClearButton ? <CustomClearButton onClear={handleClear} /> : undefined}
      // Custom clear button handles the onClear behavior
      onClear={showCustomClearButton ? undefined : handleClear}
      {...props}
    />
  );
};
