import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, ModalProps } from "uikit";
import { AcceptOrder, BaseAcceptOrderProps, View } from "./AcceptOrder";

interface AcceptOrderModalProps extends BaseAcceptOrderProps {
  isOpen: ModalProps["isOpen"];
}

const AcceptOrderModal = ({
  tokenId,
  tokenName,
  tokenImage,
  collectionName,
  collectionAddress,
  collectionType,
  collectionFloorPrice,
  isVerified,
  order,
  isOpen,
  onClose,
}: AcceptOrderModalProps) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState("Accept Offer");

  const handleTitleChange = (newView: View) => {
    if (newView === View.FLOOR_PRICE_WARNING) {
      setTitle("Warning: Low Price");
      return;
    }
    setTitle("Accept Offer");
  };

  return (
    <Modal size="sm" isOpen={isOpen} onClose={onClose} title={t(title)} closeOnOverlayClick={false}>
      <AcceptOrder
        tokenId={tokenId}
        tokenName={tokenName}
        tokenImage={tokenImage}
        collectionName={collectionName}
        collectionAddress={collectionAddress}
        collectionType={collectionType}
        collectionFloorPrice={collectionFloorPrice}
        isVerified={isVerified}
        order={order}
        onClose={onClose}
        setModalTitle={handleTitleChange}
      />
    </Modal>
  );
};

export default AcceptOrderModal;
