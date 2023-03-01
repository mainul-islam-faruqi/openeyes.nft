import { useContext } from "react";
import { MultiselectContext } from "../context/multiselectContext";

export const useMultiselect = () => {
  const context = useContext(MultiselectContext);

  if (context === undefined) {
    throw new Error("Multiselect context is undefined.");
  }
  const { isOpen: isCollapsed, ...rest } = context;

  return { isCollapsed, ...rest };
};
