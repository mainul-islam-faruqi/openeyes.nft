import { useEffect, useState } from "react";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";

export const useIsSupportedNetwork = () => {
  const [isUnsupportedNetwork, setIsUnsupportedNetwork] = useState(false);
  const { error } = useWeb3React();

  useEffect(() => {
    setIsUnsupportedNetwork(error instanceof UnsupportedChainIdError);
  }, [error, setIsUnsupportedNetwork]);

  return isUnsupportedNetwork;
};
