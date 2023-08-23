import { useDisclosure } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import uniqueId from "lodash/uniqueId";
import { Button } from "uikit";
import { ButtonProps } from "uikit/Button/Button"
import noop from "lodash/noop";
import { isAuthorized } from "utils/login";
import useSignInHandler from "hooks/useSignInHandler";
import { SignInModal } from "./SignInModal";

export type AuthorizedActionButtonProps = Omit<ButtonProps, "onClick"> & {
  onAuthSuccess: (jwt?: string) => any;
  onAuthFailure?: () => any;
};

export const AuthorizedActionButton: React.FC<AuthorizedActionButtonProps> = ({
  children,
  onAuthSuccess,
  onAuthFailure = noop,
  as,
  ...props
}) => {
  const { account } = useWeb3React();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { txStatus, signInHandler } = useSignInHandler({ onAuthSuccess, onAuthFailure, onClose });

  const CTA = as ?? Button;

  const handleClick = () => {
    const accountIsAuthorized = isAuthorized(account);

    if (!accountIsAuthorized) {
      onOpen();
      signInHandler();
    } else {
      // Proceed directly to the original requested action
      onAuthSuccess();
    }
  };

  return (
    <>
      <CTA onClick={handleClick} disabled={isOpen} {...props}>
        {children}
      </CTA>
      <SignInModal
        key={uniqueId("signin-modal-")}
        isOpen={isOpen}
        onClose={onClose}
        txStatus={txStatus}
        signInHandler={signInHandler}
      />
    </>
  );
};
