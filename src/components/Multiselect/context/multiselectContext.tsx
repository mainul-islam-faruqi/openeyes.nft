// @ts-nocheck
import { useDisclosure, UseDisclosureReturn } from "@chakra-ui/react";
import { DEFAULT_TRANSITION_DUR, SIDEBAR_WIDTH_COLLAPSED, SIDEBAR_WIDTH_OPEN } from "components/Layout/FilterLayout/context";
import { createContext, useReducer } from "react";
import { NFTCard, NFTCardCollection } from "types/graphql";

export interface MultiselectContextReturn extends UseDisclosureReturn {
  selectedItems: NFTCard[];
  addToCart: (nft: NFTCard) => void;
  removeFromCart: (collectionAddress: string, tokenId: string) => void;
  clearCart: () => void;
  getIsSelected: (collectionAddress: string, tokenId: string) => boolean;
  getUniqueCollections: () => NFTCardCollection[];
  // true if selectedItems > 0. The UI will update once we have n > 0 selected
  isMultiselectActive: boolean;
  // sidebar definitions
  transitionDur: string;
  sidebarWidthCollapsed: number;
  sidebarWidthOpen: number;
}

export const MultiselectContext = createContext<MultiselectContextReturn | undefined>(undefined);

export type Actions =
  | { type: "addToCart"; data: NFTCard }
  | { type: "removeFromCart"; data: { collectionAddress: string; tokenId: string } }
  | { type: "clearCart" };
type SelectedItems = NFTCard[];
type SelectedTokenMap = Record<string, Record<string, boolean>>;

const reducer = (state: SelectedItems, action: Actions) => {
  switch (action.type) {
    case "addToCart":
      return [...state, action.data];
    case "removeFromCart":
      return state.filter(
        (nft) => !(nft.collection.address === action.data.collectionAddress && nft.tokenId === action.data.tokenId)
      );
    case "clearCart":
      return [];
    default:
      return state;
  }
};

const initialState = [] as SelectedItems;

export const MultiselectContextProvider: React.FC = ({ children }) => {
  const value = useDisclosure();
  const [state, dispatch] = useReducer(reducer, initialState);

  const isMultiselectActive = state.length > 0;

  const addToCart = (nft: NFTCard) => {
    dispatch({ type: "addToCart", data: nft });
  };

  const removeFromCart = (collectionAddress: string, tokenId: string) => {
    dispatch({ type: "removeFromCart", data: { collectionAddress, tokenId } });
  };

  const clearCart = () => {
    dispatch({ type: "clearCart" });
  };

  const getUniqueCollections = () => {
    return state.reduce<NFTCardCollection[]>((acc, nft) => {
      if (!acc.some((collection) => collection.address === nft.collection.address)) {
        acc.push(nft.collection);
      }
      return acc;
    }, []);
  };

  // when our state (selectedItems) changes, create a map for constant time lookup at the cost of one loop now.
  // getIsSelected is called for every card in the grid, it should use this map
  const selectedTokenMap = state.reduce<SelectedTokenMap>((map, nft) => {
    if (!map[nft.collection.address]) {
      map[nft.collection.address] = {};
    }
    map[nft.collection.address][nft.tokenId] = true;
    return map;
  }, {});

  const getIsSelected = (collectionAddress: string, tokenId: string) => {
    return !!selectedTokenMap?.[collectionAddress]?.[tokenId];
  };

  return (
    <MultiselectContext.Provider
      value={{
        ...value,
        addToCart,
        removeFromCart,
        clearCart,
        getIsSelected,
        getUniqueCollections,
        selectedItems: state,
        isMultiselectActive,
        transitionDur: DEFAULT_TRANSITION_DUR,
        sidebarWidthCollapsed: SIDEBAR_WIDTH_COLLAPSED,
        sidebarWidthOpen: SIDEBAR_WIDTH_OPEN,
      }}
    >
      {children}
    </MultiselectContext.Provider>
  );
};
