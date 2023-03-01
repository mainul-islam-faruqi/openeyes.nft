import { DAILY_LOOKS_DISTRIBUTED } from "config/constants";

export const getEstimatedLooksPerListing = (
  points: number | null,
  totalPoints: number | null,
  count = 1,
  dailyDistributedLooks = DAILY_LOOKS_DISTRIBUTED
) => {
  if (!points || !totalPoints) {
    return 0;
  }
  return ((count * points) / totalPoints) * dailyDistributedLooks;
};
