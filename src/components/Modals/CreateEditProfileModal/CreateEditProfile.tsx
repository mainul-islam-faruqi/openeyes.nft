import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  Flex,
  Box,
  Textarea,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  UseDisclosureReturn,
  useDisclosure,
  Spinner,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import debounce from "lodash/debounce";
import { Button, GlobeIcon, Input, ModalBody, ModalFooterGrid, Text, WarningFilledIcon } from "uikit";
import { getApiErrorMessage } from "utils/errors";
import { checkUsernameValidity } from "utils/graphql";
import { Avatar } from "components/Avatar";
import { CopyAddress } from "components/CopyAddress";
import { InputError, InputErrorGroup } from "components/Form";
import { RemoveUserAvatarButton } from "components/Buttons/RemoveUserAvatarButton";
import { NFTAvatar, User } from "types/graphql";
import { useToast } from "hooks/useToast";
import { useUpdateUser } from "hooks/graphql/user";
import { SelectProfileNftModal } from "./SelectProfileNftModal";
import { getNFTAvatar } from "./helpers";

export interface CreateEditProfileProps {
  user?: User;
  address: string;
  onClose: UseDisclosureReturn["onClose"];
}

interface Inputs {
  name: string;
  biography: string;
  websiteLink: string;
}

const DESCRIPTION_MAX_LENGTH = 300;
const NAME_MAX_LENGTH = 20;
const VALID_USERNAME_REGEX = new RegExp(/^[\w-]*$/g);
const debouncedUsernameCheck = debounce(checkUsernameValidity, 100, { leading: true, trailing: true });

export const CreateEditProfile = ({ user, address, onClose }: CreateEditProfileProps) => {
  const toast = useToast();
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { isValid, isValidating, isSubmitting, errors },
  } = useForm<Inputs>({
    mode: "onBlur",
    defaultValues: {
      name: user?.name,
      biography: user?.biography,
      websiteLink: user?.websiteLink,
    },
  });
  const updateUserMutation = useUpdateUser({
    onSuccess: () => {
      toast({
        title: t("Confirmed"),
        description: user?.name ? t("Your profile has been updated.") : t("Your profile has been created."),
        status: "success",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        status: "error",
        title: t("Error"),
        description: getApiErrorMessage(error),
      });
    },
  });

  const onSubmit: SubmitHandler<Inputs> = ({ name, biography, websiteLink }) => {
    return updateUserMutation.mutate({
      address,
      data: {
        name: name ? name.toLowerCase() : null,
        biography: biography || null,
        websiteLink: websiteLink || null,
      },
    });
  };

  const [selectedAvatar, setSelectedAvatar] = useState<NFTAvatar | undefined>(getNFTAvatar(user?.avatar));
  const { isOpen: isNftModalOpen, onOpen: openNftPane, onClose: closeNftPane } = useDisclosure();

  const handleAvatarUpdateSuccess = (nftData: NFTAvatar) => {
    setSelectedAvatar(nftData);
    closeNftPane();
  };

  const handleAvatarRemoveSuccess = () => {
    setSelectedAvatar(undefined);
  };

  if (isNftModalOpen && user) {
    return (
      <SelectProfileNftModal
        address={user?.address}
        initialSelectedAvatar={selectedAvatar}
        onAvatarUpdateSuccess={handleAvatarUpdateSuccess}
        onClose={closeNftPane}
      />
    );
  }

  return (
    <>
      <Box bg="ui-bg" px={4} py={6}>
        <Text textStyle="detail" mb={2}>
          {t("Wallet Address")}
        </Text>
        <CopyAddress address={address} truncateAddress={false} mb={2} />
      </Box>
      <form method="post" onSubmit={handleSubmit(onSubmit)}>
        <ModalBody>
          <fieldset disabled={isSubmitting}>
            <Text as="h5" textStyle="display-05" bold mb={4}>
              {t("Profile Image")}
            </Text>
            <Flex alignItems="center" mb={8}>
              <Avatar src={selectedAvatar?.image.src} address={address} size={64} mr={6} />
              <Button colorScheme="gray" size="xs" mr={2} tabIndex={1} onClick={openNftPane}>
                {t("Choose NFT")}
              </Button>
              <RemoveUserAvatarButton
                variant="ghost"
                colorScheme="gray"
                size="xs"
                disabled={!selectedAvatar}
                onSuccess={handleAvatarRemoveSuccess}
                tabIndex={2}
              />
            </Flex>
            <Text as="h5" textStyle="display-05" bold mb={4}>
              {t("User Name")}
            </Text>
            <InputGroup>
              <Input
                {...register("name", {
                  maxLength: {
                    value: NAME_MAX_LENGTH,
                    message: t("Max limit of {{maxLength}} characters", { maxLength: NAME_MAX_LENGTH }),
                  },
                  pattern: {
                    value: VALID_USERNAME_REGEX,
                    message: t("Invalid characters: alpha numeric, underscore, and hyphen allowed"),
                  },
                  validate: {
                    availableUsername: async (value) => {
                      const message = t("That name's unavailable");
                      if (value === user?.name) {
                        return true;
                      }

                      if (value) {
                        try {
                          const isValidResponse = await debouncedUsernameCheck(value);
                          return isValidResponse || message;
                        } catch {
                          return message;
                        }
                      }
                      return true;
                    },
                  },
                })}
                isInvalid={!!errors.name}
                pr={12}
                maxLength={20}
                tabIndex={3}
              />
              <InputRightElement>
                {isValidating && <Spinner />}
                {!isValidating && errors.name && <WarningFilledIcon color="text-error" />}
              </InputRightElement>
            </InputGroup>
            <InputErrorGroup>
              <InputError>{errors.name && errors.name.message}</InputError>
            </InputErrorGroup>
            <Text as="h5" textStyle="display-05" bold mb={4}>
              {t("Bio")}
            </Text>
            <Textarea
              {...register("biography", {
                maxLength: {
                  value: DESCRIPTION_MAX_LENGTH,
                  message: t("Max limit of {{maxLength}} characters", { maxLength: DESCRIPTION_MAX_LENGTH }),
                },
              })}
              tabIndex={4}
              isInvalid={!!errors.biography}
            />
            <InputErrorGroup>
              <InputError>{errors.biography && errors.biography.message}</InputError>
            </InputErrorGroup>
            <Text as="h5" textStyle="display-05" bold mb={4}>
              {t("Social")}
            </Text>
            <InputGroup>
              <InputLeftElement>
                <GlobeIcon />
              </InputLeftElement>
              <Input
                {...register("websiteLink", {
                  pattern: {
                    value: /^https:\/\//,
                    message: t("URL must start with https://"),
                  },
                })}
                type="url"
                pl={12}
                placeholder="e.g. https://looksrare.org"
                isInvalid={!!errors.websiteLink}
                tabIndex={5}
              />
            </InputGroup>
            <InputErrorGroup>
              <InputError>{errors.websiteLink && errors.websiteLink.message}</InputError>
            </InputErrorGroup>
          </fieldset>
        </ModalBody>
        <ModalFooterGrid>
          <Button variant="tall" colorScheme="gray" onClick={onClose} tabIndex={6} isFullWidth>
            {t("Cancel")}
          </Button>
          <Button
            type="submit"
            variant="tall"
            isFullWidth
            isLoading={isSubmitting || updateUserMutation.isLoading}
            tabIndex={7}
            disabled={!isValid}
          >
            {t("Submit")}
          </Button>
        </ModalFooterGrid>
      </form>
    </>
  );
};
