// import { useTranslation } from "react-i18next";
// import { AuctionIcon } from "uikit";
// import { EventType } from "types/graphql";
// import { useEventTypeLabels } from "hooks/useEventTypeLabels";
// import { ButtonTogglesFilter } from "components/Filters";
// import { useActivityFilter } from "components/Filters";
// import { ToggleListButton } from "components/Buttons";






import { useTranslation } from "react-i18next";
import { AuctionIcon } from "uikit";
import { EventType } from "types/graphql";
import { useEventTypeLabels } from "hooks/useEventTypeLabels";
import { ButtonTogglesFilter } from "../Filters/ButtonTogglesFilter";
import { useActivityFilter } from "../Filters/hooks/useActivityFilter";
import { ToggleListButton } from "../Buttons/ToggleListButton";





interface ActivityFiltersProps {
  isMobileLayout?: boolean;
}

export const ActivityFilters: React.FC<ActivityFiltersProps> = ({ isMobileLayout }) => {
  const { t } = useTranslation();
  const eventTypeLabels = useEventTypeLabels();
  const eventTypes = Object.keys(eventTypeLabels) as EventType[];
  const { filters, toggleFilterType } = useActivityFilter();

  return (
    <ButtonTogglesFilter
      isMobileLayout={isMobileLayout}
      defaultIsOpen
      LeftIcon={<AuctionIcon boxSize={5} />}
      label={t("Event Type")}
    >
      {eventTypes.map((eventType) => {
        const isActive = filters.type?.includes(eventType);
        return (
          <ToggleListButton key={eventType} isActive={isActive} size="sm" onClick={() => toggleFilterType(eventType)}>
            {eventTypeLabels[eventType]}
          </ToggleListButton>
        );
      })}
    </ButtonTogglesFilter>
  );
};
