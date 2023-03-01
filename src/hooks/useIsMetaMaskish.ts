import { useState, useEffect } from "react";

/**
 * Check if the user has a wallet injecting a provider with isMetaMask = true
 * @returns boolean
 */
export const useIsMetaMaskish = () => {
  const [isMetaMaskish, setIsMetaMaskish] = useState(false);
  useEffect(() => {
    if (typeof window != "undefined") {
      setIsMetaMaskish(!!window.ethereum?.isMetaMask);
    }
  }, []);
  return isMetaMaskish;
};
