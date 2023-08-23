import { useContext } from "react";
import { FilterLayoutContext } from "./context";

export const useFilterLayout = () => {
  const context = useContext(FilterLayoutContext);

  if (context === undefined) {
    throw new Error("Filter layout context is undefined");
  }

  const { isOpen: isCollapsed, ...rest } = context;

  return { isCollapsed, ...rest };
};
