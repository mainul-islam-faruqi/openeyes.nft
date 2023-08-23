import { RefObject } from "react";
import { IconButton } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { MaximizeIcon, Popover, TooltipText } from "uikit";

export interface ExpandButtonProps {
  imageRef: RefObject<HTMLDivElement>;
}

export const ExpandButton = ({ imageRef }: ExpandButtonProps) => {
  const { t } = useTranslation();

  const handleClick = () => {
    if (imageRef.current) {
      imageRef.current.requestFullscreen();
    }
  };

  return (
    <Popover label={<TooltipText>{t("Expand")}</TooltipText>}>
      <IconButton aria-label="Expand image" variant="ghost" onClick={handleClick} colorScheme="gray">
        <MaximizeIcon />
      </IconButton>
    </Popover>
  );
};
