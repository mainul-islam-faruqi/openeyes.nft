// import { useDisclosure } from "@chakra-ui/react";
// import { useTranslation } from "react-i18next";
// import { useWeb3React } from "@web3-react/core";
// import getUnixTime from "date-fns/getUnixTime";
// import filter from "lodash/filter";
// import { useOrders } from "hooks/graphql/orders";
// import { OrderFilter, OrderSort, ImageData } from "types/graphql";
// import { isAddressEqual } from "utils/guards";
// import { MakerOrderWithSignatureAndHash } from "types/orders";
// import { TokenStandard } from "types/config";
// import { Button, ButtonProps } from "uikit";
// import BuyNowModal from "components/Modals/Orders/BuyNowModal";



import { useDisclosure } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useWeb3React } from "@web3-react/core";
import getUnixTime from "date-fns/getUnixTime";
import filter from "lodash/filter";
import { useOrders } from "hooks/graphql/orders";
import { OrderFilter, OrderSort, ImageData } from "types/graphql";
import { isAddressEqual } from "utils/guards";
import { MakerOrderWithSignatureAndHash } from "types/orders";
import { TokenStandard } from "types/config";
import { Button, ButtonProps } from "uikit/Button/Button";
import BuyNowModal from "../Modals/Orders/BuyNowModal";





interface Props {
  tokenId: string;
  tokenName: string;
  tokenImage: ImageData;
  collectionName: string;
  collectionAddress: string;
  collectionType: TokenStandard;
  tokenAsk?: MakerOrderWithSignatureAndHash;
  isVerified?: boolean;
  buttonProps?: ButtonProps;
}

const now = getUnixTime(new Date());

export const BuyNowButton: React.FC<Props> = ({
  tokenName,
  tokenImage,
  tokenId,
  collectionName,
  collectionAddress,
  collectionType,
  isVerified,
  tokenAsk,
  buttonProps,
}) => {
  const { t } = useTranslation();
  const { account } = useWeb3React();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isErc1155 = collectionType === "ERC1155";
  const isTokenAskSignedByUser = isAddressEqual(tokenAsk?.signer, account);
  const fetchAdditionalAsks = !!(tokenAsk && isErc1155 && isTokenAskSignedByUser);

  const CTA = buttonProps?.as ?? Button;

  const erc1155Filter: OrderFilter = {
    isOrderAsk: true,
    collection: collectionAddress,
    tokenId,
    endTime: now,
  };
  const erc1155AsksQuery = useOrders(
    {
      filter: erc1155Filter,
      sort: OrderSort.PRICE_ASC,
      pagination: { first: 50 },
    },
    { enabled: fetchAdditionalAsks }
  );

  //  @TODO: Temp FE filtering until a 'signer does not eq' filter is added to the BE.
  const executableErc1155Asks =
    erc1155AsksQuery.isSuccess &&
    erc1155AsksQuery.data &&
    account &&
    filter(erc1155AsksQuery.data, (erc1155Ask) => !isAddressEqual(erc1155Ask.signer, account));

  const shouldShowBuyNow = fetchAdditionalAsks ? executableErc1155Asks && !!executableErc1155Asks[0] : !!tokenAsk;

  return (
    <>
      {shouldShowBuyNow && (
        <>
          <BuyNowModal
            tokenId={tokenId}
            tokenName={tokenName}
            tokenImage={tokenImage}
            collectionName={collectionName}
            collectionAddress={collectionAddress}
            collectionType={collectionType}
            isVerified={isVerified}
            ask={
              fetchAdditionalAsks && executableErc1155Asks && executableErc1155Asks[0]
                ? executableErc1155Asks[0]
                : tokenAsk!
            }
            isOpen={isOpen}
            onClose={onClose}
          />
          <CTA isLoading={erc1155AsksQuery.isLoading} onClick={onOpen} {...buttonProps}>
            {t("Buy Now")}
          </CTA>
        </>
      )}
    </>
  );
};
