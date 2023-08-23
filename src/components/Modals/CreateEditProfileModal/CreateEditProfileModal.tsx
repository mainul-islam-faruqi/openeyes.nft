import { useTranslation } from "react-i18next";
import { Modal, ModalProps } from "uikit";
import { CreateEditProfile, CreateEditProfileProps } from "./CreateEditProfile";

export interface CreateEditProfileModalProps extends CreateEditProfileProps {
  isOpen: ModalProps["isOpen"];
}

export const CreateEditProfileModal = ({ user, address, isOpen, onClose }: CreateEditProfileModalProps) => {
  const { t } = useTranslation();
  const modalTitle = user?.name ? t("Your Profile") : t("Create Profile");

  return (
    <Modal isOpen={isOpen} title={modalTitle} onClose={onClose} motionPreset="none" closeOnOverlayClick={false}>
      <CreateEditProfile user={user} onClose={onClose} address={address} />
    </Modal>
  );
};
