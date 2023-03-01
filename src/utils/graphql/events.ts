import { gql } from "graphql-request";
import { Pagination, Event, EventFilter } from "types/graphql";
import { graphql } from "./graphql";
import { eventFragment, EventFragment } from "./fragments";

interface EventsResponse {
  events: EventFragment[];
}

export const getEvents = async (pagination?: Pagination, filter?: EventFilter): Promise<Event[]> => {
  const query = gql`
    query GetEventsQuery($pagination: PaginationInput, $filter: EventFilterInput) {
      events(pagination: $pagination, filter: $filter) {
        ...EventFragment
      }
    }
    ${eventFragment}
  `;

  const res: EventsResponse = await graphql(query, { filter, pagination });
  return res.events;
};

interface UserEventsResponse {
  user: EventsResponse;
}

export const getUserEvents = async (
  address: string,
  pagination?: Pagination,
  filter?: EventFilter
): Promise<Event[]> => {
  const query = gql`
    query GetUserEventsQuery($address: Address!, $pagination: PaginationInput, $filter: EventFilterInput) {
      user(address: $address) {
        events(filter: $filter, pagination: $pagination) {
          ...EventFragment
        }
      }
    }
    ${eventFragment}
  `;

  const res: UserEventsResponse = await graphql(query, { address, filter, pagination });
  return res.user.events;
};
