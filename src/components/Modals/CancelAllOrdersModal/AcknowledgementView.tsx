// import { useState } from "react";
// import { useTranslation } from "react-i18next";
// import { Divider, Flex, Checkbox } from "@chakra-ui/react";
// import { Button, Text, ModalBody, ModalFooterGrid, DeleteIcon } from "uikit";





import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Divider, Flex, Checkbox } from "@chakra-ui/react";
import { Button } from "uikit/Button/Button";
import { Text } from "uikit/Text/Text";
import ModalBody from "uikit/Modal/ModalBody";
import { ModalFooterGrid } from "uikit/Modal/ModalFooterGrid";
import { DeleteIcon } from "uikit/index";







interface Props {
  onConfirm: () => void;
  onClose: () => void;
}

const AcknowledgementView: React.FC<Props> = ({ onConfirm, onClose }) => {
  const { t } = useTranslation();
  const [acknowledged, setAcknowledged] = useState(false);

  return (
    <>
      <ModalBody>
        <Flex flexDir="column">
          <DeleteIcon boxSize={14} color="text-error" mb={4} />
          <Text bold textStyle="display-body" color="text-error" mb={4}>
            {t("Cancel all?")}
          </Text>
          <Text bold textStyle="body" mb={4}>
            {t("You’re about to cancel all of your current listings and all the offers you’ve made.")}
          </Text>
          <Text textStyle="detail" color="text-03">
            {t("To cancel individual listings or offers instead, head to the Owned or Offers tab in your account.")}
          </Text>
          <Divider my={4} />
          <Checkbox isChecked={acknowledged} onChange={() => setAcknowledged((prev) => !prev)}>
            {t("I want to cancel it all")}
          </Checkbox>
          <Divider my={4} />
          <Text textStyle="helper" color="text-03">
            {t("This method saves tons of gas btw ;)")}
          </Text>
          <Text textStyle="helper" color="text-03">
            {t("More flexible cancelation options coming soon.")}
          </Text>
        </Flex>
      </ModalBody>

      <ModalFooterGrid>
        <Button tabIndex={1} variant="tall" colorScheme="gray" isFullWidth onClick={onClose}>
          {t("Cancel")}
        </Button>
        <Button tabIndex={2} variant="tall" colorScheme="red" isFullWidth disabled={!acknowledged} onClick={onConfirm}>
          {t("Confirm")}
        </Button>
      </ModalFooterGrid>
    </>
  );
};

export default AcknowledgementView;
