import { GridItem } from "@chakra-ui/react";
import { BigNumberish } from "ethers";
import { useTranslation } from "react-i18next";
import { MakerOrderWithSignatureAndHash } from "types/orders";
import { ModalFooterGrid, ModalBody, Button, Modal } from "uikit";
import { ConnectWalletModalGuard } from "../shared/ConnectWalletModalGuard";
import { ListingCancellationRow } from "./ListingCancellationRow";

interface Props {
  orders: MakerOrderWithSignatureAndHash[];
  collectionFloorOrderPrice?: BigNumberish;
  onClose: () => void;
  isOpen: boolean;
}

const MultipleListingCancellationModal: React.FC<Props> = ({
  orders,
  collectionFloorOrderPrice,
  onClose,
  ...props
}) => {
  const { t } = useTranslation();

  return (
    <Modal size="sm" title={t("Select Listing")} onClose={onClose} closeOnOverlayClick={false} {...props}>
      <ConnectWalletModalGuard>
        <ModalBody p={0}>
          {orders.map((order) => (
            <ListingCancellationRow
              key={order.hash}
              makerOrder={order}
              collectionFloorOrderPrice={collectionFloorOrderPrice}
              onCancelSuccess={onClose}
            />
          ))}
        </ModalBody>
        <ModalFooterGrid>
          <GridItem colStart={2}>
            <Button width="100%" colorScheme="gray" tabIndex={2} variant="tall" onClick={() => onClose()}>
              {t("Close")}
            </Button>
          </GridItem>
        </ModalFooterGrid>
      </ConnectWalletModalGuard>
    </Modal>
  );
};

export default MultipleListingCancellationModal;
