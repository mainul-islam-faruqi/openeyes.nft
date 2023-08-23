import React, { useState } from "react";
import { Modal, ModalProps } from "uikit";
import { ConnectWalletModalGuard } from "../shared/ConnectWalletModalGuard";
import { ListForSale, BaseListForSaleProps, View } from "./ListForSale";

interface ListForSaleModalProps extends BaseListForSaleProps {
  onClose: ModalProps["onClose"];
  isOpen: ModalProps["isOpen"];
  onListingComplete?: () => void;
}
const titles = ["List for Sale", "Schedule", "Warning: Low Price", "Complete Listing", null];

const ListForSaleModal = ({
  tokenId,
  tokenName,
  tokenImage,
  collectionName,
  collectionAddress,
  collectionType,
  collectionFloor,
  isVerified,
  points,
  onClose,
  // onListingComplete is called after the modal is closed, only if the modal has reached its success state
  onListingComplete,
  isOpen,
}: ListForSaleModalProps) => {
  const [title, setTitle] = useState(titles[0]!);

  const handleTitleChange = (newView: View) => {
    setTitle(titles[newView] || "");
  };

  return (
    <Modal isOpen={isOpen} variant="standard" size="sm" title={title} onClose={onClose} closeOnOverlayClick={false}>
      <ConnectWalletModalGuard>
        <ListForSale
          tokenId={tokenId}
          tokenName={tokenName}
          tokenImage={tokenImage}
          collectionName={collectionName}
          collectionAddress={collectionAddress}
          collectionType={collectionType}
          collectionFloor={collectionFloor}
          isVerified={isVerified}
          points={points}
          onClose={onClose}
          setModalTitle={handleTitleChange}
          onListingComplete={onListingComplete}
        />
      </ConnectWalletModalGuard>
    </Modal>
  );
};

export default ListForSaleModal;
