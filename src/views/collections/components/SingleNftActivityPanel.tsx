import { Box, Flex, Skeleton } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { EventType } from "types/graphql";
import times from "lodash/times";
import uniqueId from "lodash/uniqueId";
import flatten from "lodash/flatten";
import { Button, SectionPlaceholder, Text } from "uikit";
import { useInfiniteEvents } from "hooks/graphql/events";
import { useEventTypeLabels } from "hooks/useEventTypeLabels";
import { SingleNftActivityRow } from "components/Activity";
import { useActivityFilter } from "components/Filters";
import { ToggleListButton } from "components/Buttons";

const eventsToFetch = 5;

const ActivityLoadingPlaceholder = () => (
  <>
    {times(eventsToFetch).map(() => (
      <Box key={uniqueId()} p={4}>
        <Skeleton width="20%" height="24px" mb={4} />
        <Flex alignItems="center">
          <Skeleton width="30%" height="24px" mr={2} />
          <Skeleton width="30%" height="24px" mr={2} />
          <Skeleton width="30%" height="24px" />
        </Flex>
      </Box>
    ))}
  </>
);

export const SingleNftActivityPanel = () => {
  const { t } = useTranslation();
  const { filters, toggleFilterType, resetFilters } = useActivityFilter();
  const { data, isLoading, isFetching, hasNextPage, fetchNextPage } = useInfiniteEvents(filters, {}, eventsToFetch);
  const allEvents = flatten(data?.pages);
  const showNextPageMessage = !hasNextPage && allEvents && allEvents.length > eventsToFetch;
  const eventTypeLabels = useEventTypeLabels();
  const eventTypes = Object.keys(eventTypeLabels) as EventType[];

  const renderEvents = () => {
    if (isLoading) {
      return <ActivityLoadingPlaceholder />;
    }

    return allEvents.length > 0 ? (
      allEvents.map((event) => <SingleNftActivityRow key={event.id} event={event} />)
    ) : (
      <SectionPlaceholder py={8}>
        <Text bold mb={4}>
          {t("No activities found")}
        </Text>
        <Button onClick={resetFilters}>{t("Reset filters")}</Button>
      </SectionPlaceholder>
    );
  };

  return (
    <Box py={8}>
      <Box px={{ base: 0, lg: 4 }}>
        <Flex alignItems="center" flexWrap="wrap" mb={6}>
          <Text bold textStyle="detail" color="text-02" mb={2} mr={2}>
            {t("Showing")}:
          </Text>
          {eventTypes.map((eventType) => {
            const isActive = filters.type?.includes(eventType);
            const handleClick = () => {
              toggleFilterType(eventType);
            };

            return (
              <ToggleListButton
                key={eventType}
                size="xs"
                mr={2}
                mb={2}
                isActive={isActive}
                onClick={handleClick}
                disabled={isFetching}
                color="interactive-03"
              >
                {eventTypeLabels[eventType]}
              </ToggleListButton>
            );
          })}
        </Flex>
      </Box>
      {renderEvents()}
      {hasNextPage && (
        <Flex justifyContent="center" pt={6}>
          <Button isLoading={isFetching} onClick={() => fetchNextPage()} colorScheme="primary">
            {t("Load More")}
          </Button>
        </Flex>
      )}
      {showNextPageMessage && (
        <Flex alignItems="center" justifyContent="center" pt={8}>
          <Text color="text-02">{t("That's all!")}</Text>
        </Flex>
      )}
    </Box>
  );
};
