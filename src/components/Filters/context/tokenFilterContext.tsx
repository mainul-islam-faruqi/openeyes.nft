// import { useEffect, useReducer, createContext, useCallback } from "react";
// import { useWeb3React } from "@web3-react/core";
// import { useRouter } from "next/router";
// import { BigNumberish } from "ethers";
// import isEmpty from "lodash/isEmpty";
// import findIndex from "lodash/findIndex";
// import { Attribute, TokenFilter } from "types/graphql";
// import { toDecimals } from "utils/format";
// import usePreviousValue from "hooks/usePreviousValue";
// import { USER_ACCOUNT_URI } from "config";
// import { isAddressEqual } from "utils/guards";





import { useEffect, useReducer, createContext, useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import { useRouter } from "next/router";
import { BigNumberish } from "ethers";
import isEmpty from "lodash/isEmpty";
import findIndex from "lodash/findIndex";
import { Attribute, TokenFilter } from "types/graphql";
import { toDecimals } from "utils/format";
import usePreviousValue from "hooks/usePreviousValue";
import { USER_ACCOUNT_URI } from "config/urls";
import { isAddressEqual } from "utils/guards";




interface TokenFilterContextReturn {
  filter: TokenFilter;
  defaultFilters: TokenFilter;
  initialFilters: TokenFilter;
  handleMaxPriceChange: (value: string) => void;
  handleMinPriceChange: (value: string) => void;
  toggleWithAskOnly: () => void;
  toggleWithoutAskOnly: () => void;
  setCollection: (collection?: string) => void;
  addAttributeFilter: (attribute: Attribute) => void;
  removeAttributeFilter: (attribute: Attribute) => void;
  clearAllOfTraitType: (traitType: string) => void;
  clearAllFilters: (newFilters?: TokenFilter) => void;
  clearAttributes: () => void;
}

export const TokenFilterContext = createContext<TokenFilterContextReturn | undefined>(undefined);

type TokenFilterType = "explore" | "collection" | "account";

interface TokenFilterProviderProps {
  defaultFilters?: TokenFilter;
  initialFilters?: TokenFilter;
  account?: string;

  // Determines which url query to add for Next JS
  tokenFilterType: TokenFilterType;

  // This value allows you to omit default filters in the url
  excludeUrlFilterKeys?: string[];
}

type TokenFilterActions =
  | { type: "addAttribute"; attribute: Attribute }
  | { type: "removeAttribute"; attribute: Attribute }
  | { type: "handleMinPriceChange"; min: BigNumberish | null }
  | { type: "handleMaxPriceChange"; max: BigNumberish | null }
  | { type: "toggleWithAskOnly" }
  | { type: "toggleWithoutAskOnly" }
  | { type: "setCollection"; collection?: string }
  | { type: "clearAllOfTraitType"; traitType: string }
  | { type: "clearAllFilters"; filters: TokenFilter }
  | { type: "clearAttributes" };

const initialState = (defaultFilters?: TokenFilter): TokenFilter => {
  return {
    collection: defaultFilters?.collection,
    owner: defaultFilters?.owner,
    order: defaultFilters?.order,
    withAskOnly: defaultFilters?.withAskOnly,
    withoutAskOnly: defaultFilters?.withoutAskOnly,
    attributes: defaultFilters?.attributes,
    flag: defaultFilters?.flag,
  };
};

const nftFilterReducer = (state: TokenFilter, action: TokenFilterActions): TokenFilter => {
  switch (action.type) {
    case "addAttribute":
      const { traitType, value } = action.attribute;

      if (state.attributes) {
        const indexOfTraitType = findIndex(
          state.attributes,
          (stateAttribute) => stateAttribute.traitType === traitType
        );

        if (indexOfTraitType >= 0) {
          const newValues = [...state.attributes[indexOfTraitType].values, value];

          const updatedStateAttributes = [...state.attributes];
          updatedStateAttributes[indexOfTraitType] = {
            traitType: updatedStateAttributes[indexOfTraitType].traitType,
            values: newValues,
          };
          // Attributes have existing filtering for traitType
          return {
            ...state,
            attributes: updatedStateAttributes,
          };
        }
        // Attributes have existing filters but none for traitType
        return {
          ...state,
          attributes: [...state.attributes, { traitType, values: [`${value}`] }],
        };
      }
      // Attributes filter is empty
      return {
        ...state,
        attributes: [{ traitType, values: [`${value}`] }],
      };

    case "removeAttribute":
      const indexOfTraitType = findIndex(state.attributes, (stateAttribute) => {
        return stateAttribute.traitType === action.attribute.traitType;
      });
      const traitTypeToModify = state.attributes![indexOfTraitType];

      if (traitTypeToModify.values.length <= 1) {
        // Only one filter of trait type applied - remove entire traitType
        const filteredAttributes = state.attributes?.filter((stateAttribute, i) => i !== indexOfTraitType);
        return {
          ...state,
          attributes: filteredAttributes,
        };
      }

      const indexOfValue = findIndex(traitTypeToModify.values, (stateValue) => {
        return stateValue === action.attribute.value;
      });
      const filteredValues = traitTypeToModify.values.filter((stateValue, i) => i !== indexOfValue);

      const updatedStateAttributes = [...state.attributes!];
      updatedStateAttributes[indexOfTraitType] = {
        traitType: updatedStateAttributes[indexOfTraitType].traitType,
        values: filteredValues,
      };

      return {
        ...state,
        attributes: updatedStateAttributes,
      };
    case "clearAllOfTraitType":
      const attributesWithoutTraitType = state.attributes
        ? state.attributes.filter((attribute) => attribute.traitType !== action.traitType)
        : [];
      return {
        ...state,
        attributes: attributesWithoutTraitType,
      };
    case "handleMinPriceChange":
      // If min & max are falsy - unset the order filter
      if (!action.min && !state.order?.price?.max) {
        return {
          ...state,
          order: undefined,
        };
      }
      return {
        ...state,
        order: { ...state.order, price: { ...state.order?.price, min: action.min } },
      };
    case "handleMaxPriceChange":
      // If min & max are falsy - unset the order filter
      if (!action.max && !state.order?.price?.min) {
        return {
          ...state,
          order: undefined,
        };
      }
      return {
        ...state,
        order: { ...state.order, price: { ...state.order?.price, max: action.max } },
      };
    case "toggleWithAskOnly":
      return {
        ...state,
        withAskOnly: !state.withAskOnly,
      };
    case "toggleWithoutAskOnly":
      return {
        ...state,
        withoutAskOnly: !state.withoutAskOnly,
      };
    case "setCollection":
      return {
        ...state,
        collection: action.collection,
      };
    case "clearAllFilters":
      return action.filters;
    case "clearAttributes":
      return {
        ...state,
        attributes: [],
      };
    default:
      return state;
  }
};

const stringifyTokenFilters = (filters: TokenFilter, excludeUrlFilterKeys: string[] = []) => {
  try {
    // Remove values that are undefined, null, or empty arrays
    const activeFilters = Object.entries(filters).reduce<TokenFilter>((accum, [key, value]) => {
      if (value === undefined || value === null) {
        return accum;
      }

      if (Array.isArray(value) && value.length === 0) {
        return accum;
      }

      if (excludeUrlFilterKeys.includes(key)) {
        return accum;
      }

      return {
        ...accum,
        [key]: value,
      };
    }, {});

    if (isEmpty(activeFilters)) {
      return null;
    }

    const stringifiedFilters = JSON.stringify(activeFilters);
    return stringifiedFilters;
  } catch {
    return null;
  }
};

export const TokenFilterProvider: React.FC<TokenFilterProviderProps> = ({
  children,
  initialFilters,
  defaultFilters,
  account,
  tokenFilterType,
  excludeUrlFilterKeys = [],
}) => {
  const [state, dispatch] = useReducer(nftFilterReducer, initialState(initialFilters));
  const { replace, query: routerQuery } = useRouter();
  const { account: connectedAccount } = useWeb3React();

  const { collection: collectionAddress } = state;
  const stringifiedFilter = stringifyTokenFilters(state, excludeUrlFilterKeys);
  const prevStringifiedFilter = usePreviousValue(stringifiedFilter);

  const currentQueryAddress = routerQuery?.address;
  const previousQueryAddress = usePreviousValue(routerQuery?.address);
  const isNavigatingToNewCollection = tokenFilterType === "collection" && currentQueryAddress !== previousQueryAddress;

  const addAttributeFilter = (attribute: Attribute) => {
    dispatch({ type: "addAttribute", attribute });
  };

  const removeAttributeFilter = (attribute: Attribute) => {
    dispatch({ type: "removeAttribute", attribute });
  };

  const handleMinPriceChange = (value: string) => {
    const min = value ? toDecimals(value).toString() : null;
    dispatch({ type: "handleMinPriceChange", min });
  };

  const handleMaxPriceChange = (value: string) => {
    const max = value ? toDecimals(value).toString() : null;
    dispatch({ type: "handleMaxPriceChange", max });
  };

  const toggleWithAskOnly = () => {
    dispatch({ type: "toggleWithAskOnly" });
  };

  const toggleWithoutAskOnly = () => {
    dispatch({ type: "toggleWithoutAskOnly" });
  };

  // useCallback so the consumer is not receiving a new function
  const setCollection = useCallback(
    (collection?: string) => {
      dispatch({ type: "setCollection", collection });
    },
    [dispatch]
  );

  const clearAllOfTraitType = (traitType: string) => {
    dispatch({ type: "clearAllOfTraitType", traitType });
  };

  const clearAllFilters = (newFilters?: TokenFilter) => {
    dispatch({ type: "clearAllFilters", filters: initialState(newFilters || defaultFilters) });
  };

  const clearAttributes = () => {
    dispatch({ type: "clearAttributes" });
  };

  // When the filters change update the url
  useEffect(() => {
    if (stringifiedFilter !== prevStringifiedFilter) {
      const query = (() => {
        const baseQuery: Record<string, string | undefined> = {};

        if (tokenFilterType === "account") {
          if (account) {
            baseQuery.address = isAddressEqual(connectedAccount, account) ? USER_ACCOUNT_URI : account;
          }
        } else if (tokenFilterType === "collection") {
          baseQuery.address = collectionAddress;
        }

        if (stringifiedFilter) {
          baseQuery.filters = stringifiedFilter;
        }
        return baseQuery;
      })();

      // do not call replace when we load a new collection page
      // if we do, Collection pages will not call getServerSideProps on a browser "back" action
      if (isNavigatingToNewCollection) {
        return;
      }

      replace({ query }, undefined, { shallow: true });
    }
  }, [
    isNavigatingToNewCollection,
    replace,
    account,
    connectedAccount,
    collectionAddress,
    tokenFilterType,
    stringifiedFilter,
    prevStringifiedFilter,
  ]);

  return (
    <TokenFilterContext.Provider
      value={{
        handleMaxPriceChange,
        handleMinPriceChange,
        toggleWithAskOnly,
        toggleWithoutAskOnly,
        setCollection,
        addAttributeFilter,
        removeAttributeFilter,
        clearAllOfTraitType,
        clearAllFilters,
        clearAttributes,
        filter: state,
        initialFilters: initialState(initialFilters),
        defaultFilters: initialState(defaultFilters),
      }}
    >
      {children}
    </TokenFilterContext.Provider>
  );
};
