import { useTranslation } from "react-i18next";
import { OrderSort } from "types/graphql";

export const useOrderSortLabels = (): {
  labels: string[];
  orderSortMap: Record<OrderSort, string>;
  getOrderSortFromLabel: (label: string) => OrderSort | undefined;
} => {
  const { t } = useTranslation();

  const orderSortMap = {
    [OrderSort.EXPIRING_SOON]: t("Expiring Soon"),
    [OrderSort.NEWEST]: t("Newest"),
    [OrderSort.PRICE_ASC]: t("Price Ascending"),
    [OrderSort.PRICE_DESC]: t("Price Descending"),
  };

  const getOrderSortFromLabel = (label: string) => {
    const keys = Object.keys(orderSortMap) as OrderSort[];
    const orderSort = keys.find((key) => orderSortMap[key] === label);
    return orderSort;
  };

  return {
    labels: Object.values(orderSortMap),
    orderSortMap,
    getOrderSortFromLabel,
  };
};
