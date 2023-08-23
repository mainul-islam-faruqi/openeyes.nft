import { useContext } from "react";
import { TokenFilterContext } from "../context/tokenFilterContext";

export const useTokenFilter = () => {
  const context = useContext(TokenFilterContext);

  if (context === undefined) {
    throw new Error("Token filter context is undefined.");
  }

  return context;
};
