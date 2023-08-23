import { useTranslation } from "react-i18next";
import { TokensSort } from "types/graphql";

export const useTokensSortLabels = (): {
  labels: string[];
  tokensSortMap: Record<TokensSort, string>;
  getTokensSortFromLabel: (label: string) => TokensSort | undefined;
} => {
  const { t } = useTranslation();

  const tokensSortMap = {
    [TokensSort.PRICE_ASC]: t("Price Ascending"),
    [TokensSort.PRICE_DESC]: t("Price Descending"),
    [TokensSort.LAST_RECEIVED]: t("Recent Activity"),
  };

  const getTokensSortFromLabel = (label: string) => {
    const keys = Object.keys(tokensSortMap) as TokensSort[];
    const orderSort = keys.find((key) => tokensSortMap[key] === label);
    return orderSort;
  };

  return {
    labels: Object.values(tokensSortMap),
    tokensSortMap,
    getTokensSortFromLabel,
  };
};
