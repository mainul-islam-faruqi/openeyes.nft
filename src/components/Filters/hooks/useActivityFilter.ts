import { useContext } from "react";
import { ActivityFilterContext } from "../context/activityfilter";

export const useActivityFilter = () => {
  const context = useContext(ActivityFilterContext);

  if (context === undefined) {
    throw new Error("Activity filter context is undefined.");
  }

  return context;
};
