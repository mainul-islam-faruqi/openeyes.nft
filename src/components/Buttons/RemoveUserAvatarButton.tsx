// import { useTranslation } from "react-i18next";
// import noop from "lodash/noop";
// import { useUpdateUserAvatar, UseUpdateUserAvatarOptions } from "hooks/graphql/user";
// import { useToast } from "hooks/useToast";
// import { AuthorizedActionButton, AuthorizedActionButtonProps } from "components/Modals/SignInModal";



import { useTranslation } from "react-i18next";
import noop from "lodash/noop";
import { useUpdateUserAvatar, UseUpdateUserAvatarOptions } from "hooks/graphql/user";
import { useToast } from "hooks/useToast";
import { AuthorizedActionButton, AuthorizedActionButtonProps } from "../Modals/SignInModal/AuthorizedActionButton";



export interface RemoveUserAvatarButtonProps extends Omit<AuthorizedActionButtonProps, "onAuthSuccess"> {
  onSuccess?: UseUpdateUserAvatarOptions["onSuccess"];
}

export const RemoveUserAvatarButton: React.FC<RemoveUserAvatarButtonProps> = ({
  onSuccess = noop,
  children,
  ...props
}) => {
  const toast = useToast();
  const { t } = useTranslation();
  const { mutate, isLoading } = useUpdateUserAvatar({
    onSuccess,
    onError: () => {
      toast({
        status: "error",
        title: t("Error"),
        description: t("Unable to remove avatar"),
      });
    },
  });

  const handleAuthSucess = () => {
    mutate({ collection: null, tokenId: null });
  };

  return (
    <AuthorizedActionButton {...props} onAuthSuccess={handleAuthSucess} isLoading={isLoading}>
      {children || t("Remove")}
    </AuthorizedActionButton>
  );
};
