// @ts-nocheck
import { useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { useQueryClient } from "react-query";
import { Box } from "@chakra-ui/react";
import { constants } from "ethers";
import { useCalculateCreatorFeePercentage } from "hooks/calls/fees";
import { useProtocolFee } from "hooks/useFees";
import { tokenKeys } from "hooks/graphql/tokens";
import { useOsListing } from "hooks/useOsListing";
import { TokenStandard } from "types/config";
import { CollectionFloor, ImageData } from "types/graphql";
import { MakerOrderWithSignatureAndHash } from "types/orders";
import { ModalProps } from "uikit/Modal/Modal";
import { fromDecimals, toDecimals } from "utils/format";
import { timestampInMs } from "utils/date";
import { View } from "./helpers";
import { PriceAdjustmentView } from "./PriceAdjustmentView";
import TransactionView from "./TransactionView";
import { SelectOrderRow } from "./SelectOrderRow";
import ConfirmationView from "./ConfirmationView";
import { getGlobalFloor } from "utils/floorPricePercentHelpers";

export interface AdjustListingProps {
  orders: MakerOrderWithSignatureAndHash[];
  collectionType: TokenStandard;
  tokenName: string;
  tokenImage: ImageData;
  collectionName: string;
  isVerified?: boolean;
  collectionFloor: CollectionFloor;
  points: number | null;
  onClose: ModalProps["onClose"];
}

interface State {
  view: View;
  newPrice: string;
  selectedOrder: MakerOrderWithSignatureAndHash | null;
}

export const AdjustListing = ({
  orders,
  collectionType,
  tokenName,
  tokenImage,
  collectionName,
  isVerified,
  collectionFloor,
  points,
  onClose,
}: AdjustListingProps) => {
  const hasOneOrder = orders.length === 1;

  const { account } = useWeb3React();
  const [state, setState] = useState<State>(() => ({
    view: hasOneOrder ? View.PRICE_ADJUSTMENT : View.ORDER_SELECT,
    selectedOrder: hasOneOrder ? orders[0] : null,
    newPrice: hasOneOrder ? fromDecimals(orders[0].price) : "0",
  }));
  const { view, newPrice, selectedOrder } = state;
  const { tokenId, collection, strategy } = selectedOrder ?? {};

  const tokenIdAsStr = tokenId?.toString();

  const queryClient = useQueryClient();
  const protocolFeeQuery = useProtocolFee(strategy!, { enabled: !!selectedOrder });
  const creatorFeeQuery = useCalculateCreatorFeePercentage(collection!, tokenIdAsStr!, { enabled: !!selectedOrder });
  const osListingQuery = useOsListing(collection!, tokenIdAsStr!, account, { enabled: !!selectedOrder && !!account });
  const creatorFee = creatorFeeQuery.isSuccess ? creatorFeeQuery.data : 0;
  const protocolFee = protocolFeeQuery.isSuccess ? protocolFeeQuery.data : constants.Zero;
  const creatorFeeAsDecimal = creatorFee ? toDecimals(creatorFee.toFixed(2), 2) : constants.Zero;
  const { floorPrice } = getGlobalFloor(collectionFloor);

  const handlePriceChange = (price: string) =>
    setState((prevState) => ({
      ...prevState,
      newPrice: price,
    }));

  const handleBack = () =>
    setState((prevState) => ({
      ...prevState,
      view: hasOneOrder ? View.PRICE_ADJUSTMENT : View.ORDER_SELECT,
    }));

  const handleConfirm = () => {
    setState((prevState) => ({
      ...prevState,
      view: View.CONFIRMATION,
    }));
    if (selectedOrder) {
      queryClient.invalidateQueries(tokenKeys.token(selectedOrder.collection, selectedOrder.tokenId.toString()));
    }
  };

  const handleConfirmNewPrice = () => {
    setState((prevState) => ({
      ...prevState,
      view: View.TRANSACTION,
    }));
  };

  const handleSelectOrder = (order: MakerOrderWithSignatureAndHash) => {
    setState((prevState) => ({
      ...prevState,
      selectedOrder: order,
      view: View.PRICE_ADJUSTMENT,
      newPrice: fromDecimals(order.price),
    }));
  };

  if (view === View.PRICE_ADJUSTMENT && selectedOrder) {
    return (
      <PriceAdjustmentView
        currentPrice={selectedOrder.price}
        newPrice={newPrice}
        collectionFloor={collectionFloor}
        points={points}
        onNewPriceChange={handlePriceChange}
        onConfirmNewPrice={handleConfirmNewPrice}
        onClose={onClose}
        osListingPriceInWei={osListingQuery.isSuccess ? osListingQuery.data.price : null}
      />
    );
  }

  if (view === View.TRANSACTION && selectedOrder) {
    return (
      <TransactionView
        order={selectedOrder}
        newPrice={newPrice}
        collectionType={collectionType}
        protocolFees={protocolFee}
        creatorFees={creatorFeeAsDecimal}
        tokenImage={tokenImage}
        tokenName={tokenName}
        collectionName={collectionName}
        isVerified={isVerified}
        onClose={onClose}
        onBack={handleBack}
        onConfirm={handleConfirm}
      />
    );
  }

  if (view === View.CONFIRMATION && selectedOrder) {
    return (
      <ConfirmationView
        tokenId={selectedOrder.tokenId.toString()}
        tokenName={tokenName}
        tokenImage={tokenImage}
        collectionName={collectionName}
        collectionAddress={selectedOrder.collection}
        isVerified={isVerified}
        price={newPrice}
        endTime={timestampInMs(selectedOrder.endTime)}
        onClose={onClose}
      />
    );
  }

  return (
    <Box>
      {orders.map((order) => (
        <SelectOrderRow
          key={order.tokenId.toString()}
          makerOrder={order}
          onSelectOrder={handleSelectOrder}
          collectionFloorOrderPrice={floorPrice}
        />
      ))}
    </Box>
  );
};
