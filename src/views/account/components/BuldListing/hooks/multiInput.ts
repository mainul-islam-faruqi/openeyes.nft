import { useCallback, useState } from "react";

export const getTokenKey = (collectionAddress: string, tokenId: string): string => {
  return `${collectionAddress}-${tokenId}`;
};

export type InputValues = Record<string, string>;

/**
 * Manage input values for a set of keys
 */
export const useMultiInput = (initialKeys: string[]) => {
  const initialState = initialKeys.reduce((target: InputValues, key: string) => {
    target[key] = "";
    return target;
  }, {});
  const [inputValues, setInputValues] = useState(initialState);

  const setValueForKey = (key: string, value: string) => {
    setInputValues((state) => ({ ...state, [key]: value }));
  };

  const setValueForAll = useCallback(
    (value: string) => {
      const newValues = Object.keys(inputValues).reduce<InputValues>((acc, key) => {
        acc[key] = value;
        return acc;
      }, {});
      setInputValues(newValues);
    },
    [inputValues, setInputValues]
  );

  return { inputValues, setValueForKey, setValueForAll };
};
