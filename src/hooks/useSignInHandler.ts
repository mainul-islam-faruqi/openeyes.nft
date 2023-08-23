import { useState, useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import noop from "lodash/noop";
import { signAndLoginIfJwtIsInvalid } from "utils/login";

export enum SignInStatus {
  SIGNING_IN,
  UNAUTHORIZED,
  ERROR,
}

interface Props {
  onAuthSuccess: (jwt?: string) => any;
  onAuthFailure?: () => any;
  onClose: () => any;
}

const useSignInHandler = ({ onAuthSuccess, onAuthFailure = noop, onClose }: Props) => {
  const { account, library } = useWeb3React();
  const [txStatus, setSignInStatus] = useState<SignInStatus>(SignInStatus.SIGNING_IN);

  const signInHandler = useCallback(async () => {
    if (account) {
      try {
        setSignInStatus(SignInStatus.SIGNING_IN);
        const jwt = await signAndLoginIfJwtIsInvalid(library.getSigner(), account);

        if (jwt) {
          onAuthSuccess(jwt);
          onClose();
        } else {
          setSignInStatus(SignInStatus.UNAUTHORIZED);
          onAuthFailure();
        }
      } catch (error) {
        console.error("There was an error signing in:", error);
        setSignInStatus(SignInStatus.ERROR);
      }
    }
  }, [account, library, onClose, onAuthSuccess, onAuthFailure]);

  return { signInHandler, txStatus };
};

export default useSignInHandler;
