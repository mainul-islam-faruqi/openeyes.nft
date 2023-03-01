import { Flex } from "@chakra-ui/layout";
import { useTranslation } from "react-i18next";
import { Text, ModalBody, Modal, Link } from "uikit";
import { DOC_URL } from "config";

interface ModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VerifiedModal: React.FC<ModalWrapperProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  return (
    <Modal size="sm" isOpen={isOpen} onClose={onClose} showCloseButton title={t("Verified")}>
      <ModalBody borderTopWidth="1px" borderTopColor="border-01">
        <Flex flexDirection="column">
          <Text textStyle="detail" color="text-02" mb={4}>
            {t(
              "Collections with the Verified mark have been verified as legitimate and high-volume or otherwise notable."
            )}
          </Text>
          <Link
            textStyle="detail"
            href={`${DOC_URL}/guides/collection-management/collection-verification#what-does-it-mean-when-a-collection-is-verified`}
            isExternal
            color="link-01"
          >
            {t("Learn More")}
          </Link>
        </Flex>
      </ModalBody>
    </Modal>
  );
};
