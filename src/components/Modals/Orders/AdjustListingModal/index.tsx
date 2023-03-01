import { useTranslation } from "next-i18next";
import { Modal, ModalProps } from "uikit";
import { ConnectWalletModalGuard } from "../shared/ConnectWalletModalGuard";
import { AdjustListing, AdjustListingProps } from "./AdjustListing";

interface AdjustListingModalProps extends AdjustListingProps {
  isOpen: ModalProps["isOpen"];
}

export const AdjustListingModal = ({
  orders,
  collectionType,
  tokenName,
  tokenImage,
  collectionName,
  collectionFloor,
  points,
  isVerified,
  isOpen,
  onClose,
}: AdjustListingModalProps) => {
  const { t } = useTranslation();
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" title={t("Adjust Listing")} closeOnOverlayClick={false}>
      <ConnectWalletModalGuard>
        <AdjustListing
          orders={orders}
          collectionType={collectionType}
          tokenName={tokenName}
          collectionName={collectionName}
          collectionFloor={collectionFloor}
          points={points}
          isVerified={isVerified}
          tokenImage={tokenImage}
          onClose={onClose}
        />
      </ConnectWalletModalGuard>
    </Modal>
  );
};
