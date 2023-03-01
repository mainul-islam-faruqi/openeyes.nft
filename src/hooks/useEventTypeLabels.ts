import { useTranslation } from "react-i18next";
import { EventType } from "types/graphql";

export const useEventTypeLabels = (): Record<EventType, string> => {
  const { t } = useTranslation();

  return {
    [EventType.MINT]: t("Mint"),
    [EventType.TRANSFER]: t("Transfer"),
    [EventType.SALE]: t("Sale"),
    [EventType.LIST]: t("List"),
    [EventType.OFFER]: t("Offer"),
    [EventType.CANCEL_LIST]: t("Cancel Listing"),
    [EventType.CANCEL_OFFER]: t("Cancel Offer"),
  };
};
