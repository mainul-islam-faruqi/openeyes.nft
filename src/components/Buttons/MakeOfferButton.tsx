// import React from "react";
// import { useTranslation } from "react-i18next";
// import { useDisclosure } from "@chakra-ui/react";
// import { Button, ButtonProps } from "uikit";
// import { ImageData } from "types/graphql";
// import { MakerOrderWithSignatureAndHash } from "types/orders";
// import CreateStandardBidModal from "components/Modals/Orders/CreateStandardBidModal";




import React from "react";
import { useTranslation } from "react-i18next";
import { useDisclosure } from "@chakra-ui/react";
import { Button, ButtonProps } from "uikit/Button/Button";
import { ImageData } from "types/graphql";
import { MakerOrderWithSignatureAndHash } from "types/orders.ts";
import CreateStandardBidModal from "../Modals/Orders/CreateStandardBidModal";





interface Props extends ButtonProps {
  tokenId: string;
  tokenName: string;
  tokenImage: ImageData;
  collectionAddress: string;
  collectionName: string;
  bids: MakerOrderWithSignatureAndHash[];
  ask?: MakerOrderWithSignatureAndHash;
  isVerified?: boolean;
}

export const MakeOfferButton: React.FC<Props> = ({
  tokenId,
  tokenName,
  tokenImage,
  collectionAddress,
  collectionName,
  bids,
  ask,
  isVerified,
  ...props
}) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <CreateStandardBidModal
        isOpen={isOpen}
        onClose={onClose}
        tokenId={tokenId}
        tokenName={tokenName}
        tokenImage={tokenImage}
        collectionAddress={collectionAddress}
        collectionName={collectionName}
        bids={bids}
        ask={ask}
        isVerified={isVerified}
      />
      <Button onClick={onOpen} {...props}>
        {t("Make Offer")}
      </Button>
    </>
  );
};

MakeOfferButton.defaultProps = {
  colorScheme: "secondary",
};
