import { useEffect } from "react";
import { useTokenFilter } from "./useTokenFilter";

export const useResetFilterOnAccountChange = () => {
  const { clearAllFilters } = useTokenFilter();
  useEffect(() => {
    const handleAccountsChanged = () => clearAllFilters();
    if (typeof window !== "undefined" && window.ethereum && window.ethereum.on) {
      window.ethereum?.on("accountsChanged", handleAccountsChanged);
    }

    return () => {
      if (typeof window !== "undefined" && window.ethereum && window.ethereum.removeListener) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      }
    };
  }, [clearAllFilters]);
};
