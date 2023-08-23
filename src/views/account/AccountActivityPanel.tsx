import React from "react";
import { ActivityResults } from "components/Activity";
import { ActivityFilterList } from "components/Activity";
import { useActivityFilter } from "components/Filters";
import { useInfiniteUserEvents } from "hooks/graphql/events";
import { Box } from "@chakra-ui/react";

export interface AccountActivityPanelProps {
  address: string;
}

export const AccountActivityPanel = ({ address }: AccountActivityPanelProps) => {
  const { filters } = useActivityFilter();
  const results = useInfiniteUserEvents(address, filters);

  return (
    <Box bg="ui-bg">
      <ActivityFilterList />
      <ActivityResults eventResults={results} />
    </Box>
  );
};
