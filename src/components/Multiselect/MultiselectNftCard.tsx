import React, { MouseEventHandler } from "react";
import { useMultiselect } from "components/Multiselect/hooks/useMultiselect";
import { NftCard, NftCardProps } from "../NftCard/NftCard";

/**
 * Wrap NftCard. Pull the multiselect context data & methods and proxy them to NftCard
 */
export const MultiselectNftCard = (props: NftCardProps) => {
  const { nft } = props;
  const { getIsSelected, addToCart, removeFromCart, isMultiselectActive } = useMultiselect();
  const isSelected = getIsSelected(nft.collection.address, nft.tokenId);

  // in multiselect view, "Sell" should add the item to the cart
  const onClickListItem = () => {
    addToCart(nft);
  };

  // in the multiselect view, override the default Link behavior
  const handleMultiselectCardContainerClick: MouseEventHandler = (event) => {
    if (!isMultiselectActive) {
      return;
    }

    if (isSelected) {
      removeFromCart(nft.collection.address, nft.tokenId);
    } else {
      addToCart(nft);
    }

    // do not let the event bubble to the Link
    event.preventDefault();
  };

  return (
    <NftCard
      onClickListItem={onClickListItem}
      anchorProps={{ onClick: handleMultiselectCardContainerClick }}
      isSelected={isSelected}
      isMultiselectActive={isMultiselectActive}
      {...props}
    />
  );
};
