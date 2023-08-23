import { useEffect } from "react";
import noop from "lodash/noop";
import { useTranslation } from "react-i18next";
import { Flex, GridItem } from "@chakra-ui/react";
import { Button, ModalBody, ModalFooterGrid, PersonDissatisfied } from "uikit";

interface Props {
  onClose: () => void;
  signer?: string;
  invalidateOrdersCallback?: () => void;
}

const InvalidOrderView: React.FC<Props> = ({ onClose, invalidateOrdersCallback = noop, children }) => {
  const { t } = useTranslation();

  // Fire memoised invalidate bids / asks callback if passed
  useEffect(() => {
    invalidateOrdersCallback();
  }, [invalidateOrdersCallback]);

  return (
    <>
      <ModalBody>
        <Flex flexDirection="column" py={3}>
          <PersonDissatisfied color="text-error" boxSize={14} mb={6} />
          {children}
        </Flex>
      </ModalBody>
      <ModalFooterGrid>
        <GridItem colStart={2}>
          <Button isFullWidth tabIndex={1} variant="tall" onClick={onClose}>
            {t("Got it :(")}
          </Button>
        </GridItem>
      </ModalFooterGrid>
    </>
  );
};

export default InvalidOrderView;
