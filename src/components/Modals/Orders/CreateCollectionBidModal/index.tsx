import { Modal } from "uikit";
import { useTranslation } from "react-i18next";
import { BigNumberish } from "ethers";
import { ConnectWalletModalGuard } from "../shared/ConnectWalletModalGuard";
import CreateCollectionBid from "./CreateCollectionBid";

interface CreateCollectionBidModalProps {
  collectionAddress: string;
  collectionName: string;
  collectionFloorOrder?: { price: BigNumberish };
  isVerified?: boolean;
  onClose: () => void;
  isOpen: boolean;
}

const CreateCollectionBidModal = ({
  collectionAddress,
  collectionName,
  collectionFloorOrder,
  isVerified,
  isOpen,
  onClose,
}: CreateCollectionBidModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t("Collection Offer")}>
      <ConnectWalletModalGuard>
        <CreateCollectionBid
          collectionAddress={collectionAddress}
          collectionName={collectionName}
          isVerified={isVerified}
          collectionFloorOrder={collectionFloorOrder}
          isOpen={isOpen}
          onClose={onClose}
        />
      </ConnectWalletModalGuard>
    </Modal>
  );
};

export default CreateCollectionBidModal;
