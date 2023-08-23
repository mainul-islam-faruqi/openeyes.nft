// import React from "react";
// import { ActivityFilterList, ActivityResults } from "components/Activity";
// import { useInfiniteEvents } from "hooks/graphql/events";
// import { Box } from "@chakra-ui/react";
// import { EventFilter } from "types/graphql";




import React from "react";
import { ActivityFilterList } from "./ActivityFilterList";
import { ActivityResults } from "./ActivityResults";
import { useInfiniteEvents } from "hooks/graphql/events";
import { Box } from "@chakra-ui/react";
import { EventFilter } from "types/graphql";





interface ActivityPanelProps {
  filters: EventFilter;
}
export const ActivityPanel: React.FC<ActivityPanelProps> = ({ filters }) => {
  const results = useInfiniteEvents(filters);

  return (
    <Box bg="ui-bg">
      <ActivityFilterList />
      <ActivityResults eventResults={results} />
    </Box>
  );
};
