import { Box, Flex, Spinner, Divider } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { Modal, ModalBody, Text, MisuseAltIcon } from "uikit";
import { ModalProps } from "uikit/Modal/Modal"
import { SignInStatus } from "hooks/useSignInHandler";
import { TextButton } from "components/Buttons/TextButton";

export interface SignInModalProps {
  isOpen: ModalProps["isOpen"];
  onClose: ModalProps["onClose"];
  txStatus: SignInStatus;
  signInHandler: () => void;
}

export const SignInModal = ({ isOpen, onClose, txStatus, signInHandler }: SignInModalProps) => {
  const { t } = useTranslation();
  const isTrouble = [SignInStatus.UNAUTHORIZED, SignInStatus.ERROR].includes(txStatus);

  const getStatusText = () => {
    switch (txStatus) {
      case SignInStatus.SIGNING_IN:
        return (
          <Text textStyle="detail" textAlign="right" bold>
            {t("Waiting for you to sign in")}
          </Text>
        );
      case SignInStatus.ERROR:
        return (
          <Text textStyle="detail" textAlign="right" color="text-error" bold>
            {t("An error occurred")}
          </Text>
        );
      case SignInStatus.UNAUTHORIZED:
        return (
          <Text textStyle="detail" textAlign="right" color="text-error" bold>
            {t("You declined the signature")}
          </Text>
        );
      default:
        return null;
    }
  };

  const getIcon = () => {
    switch (txStatus) {
      case SignInStatus.UNAUTHORIZED:
      case SignInStatus.ERROR:
        return <MisuseAltIcon boxSize={12} color="text-error" />;
      case SignInStatus.SIGNING_IN:
      default:
        return <Spinner color="interactive-01" size="xl" />;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" motionPreset="none">
      <ModalBody>
        <Flex alignItems="center" height={14} mb={6}>
          {getIcon()}
        </Flex>
        <Text as="h3" textStyle="display-body" bold mb={4}>
          {t("Sign in Wallet")}
        </Text>
        <Text as="p" textStyle="detail" color="text-02">
          {t("Sign the message in your wallet to complete this action.")}
        </Text>
      </ModalBody>
      <Divider mb={6} />
      <Flex justifyContent="space-between" px={4} height="72px">
        <Text color="text-02" textStyle="detail">
          {t("Status")}
        </Text>
        <Box textAlign="right">
          {getStatusText()}
          {isTrouble && (
            <TextButton variant="ghost" size="xs" color="link-01" onClick={signInHandler} autoFocus>
              {t("Try Again")}
            </TextButton>
          )}
        </Box>
      </Flex>
    </Modal>
  );
};
