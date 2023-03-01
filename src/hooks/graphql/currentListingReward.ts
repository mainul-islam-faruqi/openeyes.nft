import { useQuery, UseQueryOptions } from "react-query";
import { CurrentListingReward } from "types/graphql";
import getCurrentListingReward from "utils/graphql/getCurrentListingReward";

export const useCurrentListingReward = (
  queryOptions?: UseQueryOptions<CurrentListingReward, any, CurrentListingReward>
) => {
  return useQuery<CurrentListingReward>(["current-listing-reward"], () => getCurrentListingReward(), queryOptions);
};
