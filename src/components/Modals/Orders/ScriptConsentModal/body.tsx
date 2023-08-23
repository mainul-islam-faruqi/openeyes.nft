import { Divider, Flex, useDisclosure, VStack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { LOCAL_STORAGE_ALLOW_SCRIPTS_CONSENT } from "config";
import { Button, Checkbox, ModalBody, Text, WarningIcon } from "uikit";
import { setLocalStorageItem } from "utils/localStorage";

interface Props {
  onConfirm: () => void;
  onClose: () => void;
}

export const ScriptConsentModalBody: React.FC<Props> = ({ onConfirm, onClose }) => {
  const { t } = useTranslation();
  const { isOpen: dontWarnAgain, onToggle } = useDisclosure();

  const handleContinue = () => {
    if (dontWarnAgain) {
      setLocalStorageItem(LOCAL_STORAGE_ALLOW_SCRIPTS_CONSENT, 1);
    }
    onConfirm();
  };

  return (
    <ModalBody>
      <VStack spacing={6} alignItems="flex-start">
        <WarningIcon color="support-warning" boxSize={15} width="60px" height="60px" />
        <Text color="text-01" bold>
          {t("This content contains HTML or JavaScript. ")}
        </Text>
        <Text textStyle="detail" color="text-02">
          {t(
            "The creator may be able to implement a tracking script or gather information about your device, including your IP Address. View anyway?"
          )}
        </Text>
        <Divider />
        <Flex alignItems="center">
          <Checkbox mr={2} isChecked={dontWarnAgain} onChange={onToggle} />
          <Text textStyle="detail" cursor="pointer" onClick={onToggle}>
            {t("Remember my choice")}
          </Text>
        </Flex>
        {dontWarnAgain && (
          <Text textStyle="helper" color="text-03">
            {t("We’ll show you HTML and JavaScript content in future. Clear your browser cache to reset this setting!")}
          </Text>
        )}
        <Flex flexDir="column" width="100%">
          <Button mb={2} colorScheme="secondary" onClick={handleContinue}>
            {t("Allow Full Content")}
          </Button>
          <Button colorScheme="secondary" onClick={onClose}>
            {t("Close")}
          </Button>
        </Flex>
      </VStack>
    </ModalBody>
  );
};
