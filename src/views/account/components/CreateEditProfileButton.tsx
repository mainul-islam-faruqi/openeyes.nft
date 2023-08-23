import { useDisclosure } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { AuthorizedActionButton } from "components/Modals/SignInModal";
import { CreateEditProfileModal } from "components/Modals";
import { User } from "types/graphql";
import { ButtonProps } from "uikit";
import { isAddressEqual } from "utils/guards";

export interface CreateEditProfileButtonProps extends ButtonProps {
  address: string;
  user?: User;
}

export const CreateEditProfileButton: React.FC<CreateEditProfileButtonProps> = ({
  address,
  user,
  children,
  ...props
}) => {
  const { account } = useWeb3React();
  const isAccountOwner = isAddressEqual(account, address);
  const { isOpen, onOpen, onClose } = useDisclosure();

  if (!account || !isAccountOwner) {
    return null;
  }

  return (
    <>
      <AuthorizedActionButton onAuthSuccess={onOpen} variant="outline" colorScheme="gray" size="sm" {...props}>
        {children}
      </AuthorizedActionButton>
      <CreateEditProfileModal user={user} address={address} isOpen={isOpen} onClose={onClose} />
    </>
  );
};
