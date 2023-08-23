import { useTranslation } from "react-i18next";
import { RelativeCollectionsSort } from "types/graphql";

export interface RelativeCollectionsDropdownSort {
  label: string;
  value: RelativeCollectionsSort;
}

export const useRelativeCollectionsSortLabels = (): {
  labels: string[];
  relativeCollectionsSortMap: Record<RelativeCollectionsSort, string>;
  getRelativeCollectionsSortFromLabel: (label: string) => RelativeCollectionsSort | undefined;
  defaultSortState: RelativeCollectionsDropdownSort;
} => {
  const { t } = useTranslation();

  const relativeCollectionsSortMap = {
    [RelativeCollectionsSort.OWNED_DESC]: t("Quantity High to Low"),
    [RelativeCollectionsSort.OWNED_ASC]: t("Quantity Low to High"),
    [RelativeCollectionsSort.HIGHEST_24H]: t("24h Vol High to Low"),
    [RelativeCollectionsSort.ALPHABETICAL_ASC]: t("Alphabetical"),
  };

  const getRelativeCollectionsSortFromLabel = (label: string) => {
    const keys = Object.keys(relativeCollectionsSortMap) as RelativeCollectionsSort[];
    const orderSort = keys.find((key) => relativeCollectionsSortMap[key] === label);
    return orderSort;
  };

  return {
    labels: Object.values(relativeCollectionsSortMap),
    relativeCollectionsSortMap,
    getRelativeCollectionsSortFromLabel,
    defaultSortState: { label: relativeCollectionsSortMap.OWNED_DESC, value: RelativeCollectionsSort.OWNED_DESC },
  };
};
