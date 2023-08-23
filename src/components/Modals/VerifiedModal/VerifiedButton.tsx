import { useDisclosure } from "@chakra-ui/hooks";
import { Box, BoxProps } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { VerifiedIcon, Popover, TooltipText } from "uikit";
import { VerifiedModal } from "./VerifiedModal";

interface VerifiedButtonProps {
  boxProps?: BoxProps;
  isVerified?: boolean;
}

const VerifiedButton: React.FC<VerifiedButtonProps> = ({ boxProps, isVerified }) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();

  if (!isVerified) {
    return null;
  }

  return (
    <>
      <VerifiedModal isOpen={isOpen} onClose={onClose} />
      <Popover label={<TooltipText>{t("Verified Collection")}</TooltipText>}>
        <Box {...boxProps}>
          <VerifiedIcon onClick={onOpen} cursor="pointer" aria-label="Verified collection" />
        </Box>
      </Popover>
    </>
  );
};

export default VerifiedButton;
