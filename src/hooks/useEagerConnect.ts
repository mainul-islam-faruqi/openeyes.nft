import { EagerConnectContext } from "../contexts/EagerConnect";
import { useContext } from "react";

export const useEagerConnect = () => {
  const context = useContext(EagerConnectContext);

  if (context === undefined) {
    throw new Error("Eager connect context is undefined");
  }

  return context;
};
