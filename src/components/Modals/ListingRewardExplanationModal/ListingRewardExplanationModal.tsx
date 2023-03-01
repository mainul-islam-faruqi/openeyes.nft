import { AspectRatio } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { DAILY_LISTING_REWARD_INTERVAL } from "config";
import { Modal, ModalBody, ModalProps, Text } from "uikit";
import { Image } from "components/Image";

interface ListingRewardExplanationModalProps {
  isOpen: ModalProps["isOpen"];
  onClose: ModalProps["onClose"];
}

export const ListingRewardExplanationModal = ({ isOpen, onClose }: ListingRewardExplanationModalProps) => {
  const { t } = useTranslation();
  return (
    <Modal title={t("Listing Rewards")} isOpen={isOpen} size="sm" onClose={onClose}>
      <AspectRatio ratio={2.8125} position="relative" width="360px">
        <Image
          src="/images/rewards-illustration.svg"
          layout="fill"
          objectFit="contain"
          alt="listing reward illustration"
        />
      </AspectRatio>
      <ModalBody>
        <Text as="h2" bold mb={4}>
          {t("Earn LOOKS by listing NFTs from collections with this mark!")}
        </Text>
        <Text color="text-02">
          {t("Eligible listings earn points every {{interval}} minutes, and points convert to LOOKS once daily.", {
            interval: DAILY_LISTING_REWARD_INTERVAL,
          })}
        </Text>
      </ModalBody>
    </Modal>
  );
};
