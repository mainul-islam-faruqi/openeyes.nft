import { useTranslation } from "react-i18next";
import { Modal } from "uikit";
import { ConnectWalletModalGuard } from "../shared/ConnectWalletModalGuard";
import { CreateSingleBid, CreateSingleBidProps } from "./CreateSingleBid";

interface CreateStandardBidModalProps extends CreateSingleBidProps {
  onClose: () => void;
  isOpen: boolean;
}

const CreateStandardBidModal = ({
  tokenId,
  tokenName,
  tokenImage,
  collectionAddress,
  collectionName,
  bids,
  ask,
  isVerified,
  isOpen,
  onClose,
}: CreateStandardBidModalProps) => {
  const { t } = useTranslation();
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t("Make Offer")} closeOnOverlayClick={false}>
      <ConnectWalletModalGuard>
        <CreateSingleBid
          tokenId={tokenId}
          tokenName={tokenName}
          tokenImage={tokenImage}
          collectionAddress={collectionAddress}
          collectionName={collectionName}
          bids={bids}
          ask={ask}
          isVerified={isVerified}
          onClose={onClose}
        />
      </ConnectWalletModalGuard>
    </Modal>
  );
};

export default CreateStandardBidModal;
