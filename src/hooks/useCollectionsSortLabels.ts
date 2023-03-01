import { useTranslation } from "react-i18next";
import { CollectionsSort } from "types/graphql";

export const useCollectionsSortLabels = (): {
  labels: string[];
  collectionsSortMap: Record<CollectionsSort, string>;
  getCollectionsSortFromLabel: (label: string) => CollectionsSort | undefined;
} => {
  const { t } = useTranslation();

  const collectionsSortMap = {
    [CollectionsSort.CHANGE_24H_ASC]: t("24h Vol Change Asc"),
    [CollectionsSort.CHANGE_24H_DESC]: t("24h Vol Change Desc"),
    [CollectionsSort.HIGHEST_24H]: t("Highest 24h Vol"),
    [CollectionsSort.HIGHEST_TOTAL]: t("Highest Total Vol"),
  };

  const getCollectionsSortFromLabel = (label: string) => {
    const keys = Object.keys(collectionsSortMap) as CollectionsSort[];
    const collectionsSort = keys.find((key) => collectionsSortMap[key] === label);
    return collectionsSort;
  };

  return {
    labels: Object.values(collectionsSortMap),
    collectionsSortMap,
    getCollectionsSortFromLabel,
  };
};
