import { useWeb3React } from "@web3-react/core";
import { addresses, APP_CHAIN_ID, STRATEGIES_ADDRESS } from "config";
import { constants } from "ethers";
import { useCallback, useState } from "react";
import { NFTCard } from "types/graphql";
import { viewProtocolFee } from "utils/calls/fees";
import { toDecimals } from "utils/format";
import { postMakerOrder } from "utils/graphql";
import { isAddressEqual } from "utils/guards";
import { getCreatorFee, validateErc1155PriceIsUnique } from "utils/tokens";

export type TokenState = "needsListing" | "needsSigning" | "declined" | "listed" | "skipped";
type SortedTokens = Record<TokenState, NFTCard[]>;
type TokenKey = string;
export type StatusMap = Record<TokenKey, TokenState>;
interface MultiListingReturn {
  sortedTokens: SortedTokens;
  handleListAllInSequence: (index?: number) => void;
  tokenStatusMap: StatusMap;
  skipToken: (tokenKey: TokenKey) => void;
}

export function getTokenKey(token: NFTCard): TokenKey {
  return `${token.collection.address}-${token.tokenId}`;
}

// package attributes needed per token for listing
export interface ListingData {
  priceInEth: string;
  endTime: number;
}
export const useListAllInSequence = (tokens: NFTCard[], listingData: ListingData[]): MultiListingReturn => {
  const { library, account } = useWeb3React();

  const [statusMap, setStatusMap] = useState(
    tokens.reduce<StatusMap>((acc, token) => {
      acc[getTokenKey(token)] = "needsListing";
      return acc;
    }, {})
  );

  const handleListAllInSequence = useCallback(
    async (index = 0): Promise<void> => {
      if (!tokens[index]) {
        return;
      }
      const token = tokens[index];
      const tokenKey = getTokenKey(token);
      const {
        collection: { address: collectionAddress, type: collectionType },
        tokenId,
      } = token;
      const strategy = STRATEGIES_ADDRESS.standard;
      const isErc1155 = collectionType === "ERC1155";
      const isErc721 = collectionType === "ERC721";

      const protocolFee = await viewProtocolFee(library, strategy);
      const creatorFee = await getCreatorFee(library, collectionAddress, tokenId);
      const feeAsDecimal = creatorFee ? toDecimals(creatorFee.toFixed(2), 2) : constants.Zero;

      const { priceInEth, endTime } = listingData[index];
      const priceInWei = toDecimals(priceInEth);

      if (account) {
        // perform erc1155 validation, and confirm that erc721's do not have an ask
        if (isErc1155) {
          const listingWithPriceExists = await validateErc1155PriceIsUnique(
            priceInEth,
            collectionAddress,
            tokenId,
            endTime,
            account
          );
          if (listingWithPriceExists) {
            // @note we should support more error states beyond "declined"
            setStatusMap((state) => ({
              ...state,
              [tokenKey]: "declined",
            }));

            return Promise.reject();
          }
        } else if (isErc721) {
          const isExistingAsk = token.ask && isAddressEqual(token.ask.signer, account);
          if (isExistingAsk) {
            // @note we should support more error states beyond "declined"
            setStatusMap((state) => ({
              ...state,
              [tokenKey]: "declined",
            }));

            return Promise.reject();
          }
        }

        setStatusMap((state) => ({
          ...state,
          [tokenKey]: "needsSigning",
        }));

        try {
          await postMakerOrder(
            library,
            APP_CHAIN_ID,
            true,
            collectionAddress,
            strategy,
            constants.One,
            priceInWei,
            protocolFee,
            feeAsDecimal,
            addresses.WETH,
            {
              tokenId,
              endTime,
            }
          );
          setStatusMap((state) => ({
            ...state,
            [tokenKey]: "listed",
          }));
          return handleListAllInSequence(index + 1);
        } catch (error) {
          // user declined transaction
          setStatusMap((state) => ({
            ...state,
            [tokenKey]: "declined",
          }));
          return Promise.reject();
        }
      }
    },
    [account, library, listingData, tokens]
  );

  /**
   * If a listing fails or is declined, the user can then "skip" this token and continue listing the remaining tokens
   */
  const skipToken = (tokenKey: TokenKey) => {
    setStatusMap((state) => ({
      ...state,
      [tokenKey]: "skipped",
    }));
  };

  /**
   * As the state StatusMap updates, collections are sorted into the appropriate bucket for rendering
   */
  const sortedTokens = tokens.reduce(
    (acc, token) => {
      const key = getTokenKey(token);
      acc[statusMap[key]].push(token);
      return acc;
    },
    {
      needsListing: [],
      needsSigning: [],
      listed: [],
      declined: [],
      skipped: [],
    } as SortedTokens
  );

  return {
    handleListAllInSequence,
    sortedTokens,
    tokenStatusMap: statusMap,
    skipToken,
  };
};
