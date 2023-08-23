import last from "lodash/last";
import { useInfiniteQuery, UseInfiniteQueryOptions } from "react-query";
import { baseQueryKeys } from "config/reactQueries";
import { EVENTS_PER_PAGE } from "config/constants"
import { Event, EventFilter } from "types/graphql";
import { getEvents, getUserEvents } from "utils/graphql/events";
import { useSetUserProfilesFromEvents } from "hooks/useUserProfileDisplay";

export const eventKeys = {
  ...baseQueryKeys("events"),
  events: (filter?: EventFilter) => [...eventKeys.infiniteQueries(), filter],
  userEvents: (address: string, filter?: EventFilter) => [...eventKeys.infiniteQueries(), address, filter],
};

// Events share the same next page handler
const getNextPageParam = (lastPage: Event[], first = EVENTS_PER_PAGE) => {
  if (lastPage.length < first) {
    // No more data to fetch
    return undefined;
  }

  const lastEvent = last(lastPage)!;
  const cursor = lastEvent.id;

  return { first, cursor };
};

export const useInfiniteEvents = (
  filters?: EventFilter,
  queryOptions?: UseInfiniteQueryOptions<Event[], any, Event[]>,
  perPage = EVENTS_PER_PAGE
) => {
  const setUserProfilesFromEvents = useSetUserProfilesFromEvents();

  return useInfiniteQuery<Event[]>(
    eventKeys.events(filters),
    async ({ pageParam = { first: perPage } }) => {
      const events = await getEvents(pageParam, filters);

      // Asynchronously update query cache
      setUserProfilesFromEvents(events);
      return events;
    },
    {
      getNextPageParam: (lastPage) => getNextPageParam(lastPage, perPage),
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      ...queryOptions,
    }
  );
};

export const useInfiniteUserEvents = (
  address: string,
  filters?: EventFilter,
  queryOptions?: UseInfiniteQueryOptions<Event[], any, Event[]>,
  perPage = EVENTS_PER_PAGE
) => {
  const setUserProfilesFromEvents = useSetUserProfilesFromEvents();

  return useInfiniteQuery<Event[]>(
    eventKeys.userEvents(address, filters),
    async ({ pageParam }) => {
      const events = await getUserEvents(address, pageParam, filters);
      // Asynchronously update query cache
      setUserProfilesFromEvents(events);
      return events;
    },
    {
      getNextPageParam: (lastPage) => getNextPageParam(lastPage, perPage),
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      ...queryOptions,
    }
  );
};
