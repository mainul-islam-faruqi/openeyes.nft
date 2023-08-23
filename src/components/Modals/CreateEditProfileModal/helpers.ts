import { NFT, NFTAvatar, UserAvatar } from "types/graphql";

export const getNFTAvatar = (nftItem?: NFT | UserAvatar): NFTAvatar | undefined => {
  if (!nftItem) {
    return undefined;
  }

  return {
    id: nftItem.id,
    tokenId: nftItem.tokenId,
    collection: nftItem.collection.address,
    image: nftItem.image,
    name: nftItem.name,
  };
};
