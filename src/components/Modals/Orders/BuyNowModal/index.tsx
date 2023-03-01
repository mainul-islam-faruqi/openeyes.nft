import { useTranslation } from "react-i18next";
import { Modal } from "uikit";
import { ConnectWalletModalGuard } from "../shared/ConnectWalletModalGuard";
import { BuyNow, BuyNowProps } from "./BuyNow";

interface BuyNowModalProps extends BuyNowProps {
  isOpen: boolean;
}

const BuyNowModal = ({
  tokenId,
  tokenName,
  tokenImage,
  collectionName,
  collectionAddress,
  collectionType,
  isVerified,
  ask,
  isOpen,
  onClose,
}: BuyNowModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t("Checkout")} closeOnOverlayClick={false}>
      <ConnectWalletModalGuard>
        <BuyNow
          tokenId={tokenId}
          tokenName={tokenName}
          tokenImage={tokenImage}
          collectionName={collectionName}
          collectionAddress={collectionAddress}
          collectionType={collectionType}
          isVerified={isVerified}
          ask={ask}
          onClose={onClose}
        />
      </ConnectWalletModalGuard>
    </Modal>
  );
};

export default BuyNowModal;
