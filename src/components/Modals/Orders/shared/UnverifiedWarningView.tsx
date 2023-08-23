import { useState } from "react";
import Link from "next/link";
import { Divider, Flex, Skeleton } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { LOCAL_STORAGE_SKIP_UNVERIFIED_WARNING } from "config/localStorage";
import { ROYALTY_FEE_WARNING_THRESHOLD } from "config/constants";
import {
  Button,
  Checkbox,
  InformationIcon,
  ModalBody,
  ModalFooterGrid,
  Popover,
  Text,
  TooltipText,
  VerifiedIcon,
  Link as UikitLink,
} from "uikit";
import { useCollectionWarningMeta } from "hooks/graphql/collection";
import { getExplorerLink } from "utils/chains";
import { formatAddress, formatFees } from "utils/format";
import { getLocalStorageItem, setLocalStorageItem } from "utils/localStorage";
import { useOsCollectionImages } from "views/collections/components/hooks/useOsCollectionImages";
import { CollectionLinkButton } from "components/Buttons/CollectionLinkButton";
import { Avatar } from "components/Avatar";
import { useCollectionCreatorFee } from "hooks/useFees";

interface Props {
  collectionName: string;
  collectionAddress: string;
  isVerified?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

type SkipWarningRecord = Record<string, boolean>;

export const shouldSkipUnverifiedWarning = (collectionAddress: string): boolean => {
  const localStorageItem = getLocalStorageItem(LOCAL_STORAGE_SKIP_UNVERIFIED_WARNING);
  if (!localStorageItem) {
    return false;
  }

  try {
    const existingSkipWarningRecords = JSON.parse(localStorageItem);
    return !!existingSkipWarningRecords[collectionAddress];
  } catch (e) {
    console.error(e);
    return false;
  }
};

const setUnverifiedWarningKey = (collectionAddress: string) => {
  const localStorageItem = getLocalStorageItem(LOCAL_STORAGE_SKIP_UNVERIFIED_WARNING);
  const newSkipWarningRecord: SkipWarningRecord = { [collectionAddress]: true };

  try {
    if (!localStorageItem) {
      setLocalStorageItem(LOCAL_STORAGE_SKIP_UNVERIFIED_WARNING, JSON.stringify(newSkipWarningRecord));
      return;
    }
    const existingSkipWarningRecords = JSON.parse(localStorageItem);
    const updatedSkipWarningRecords = { ...existingSkipWarningRecords, ...newSkipWarningRecord };
    setLocalStorageItem(LOCAL_STORAGE_SKIP_UNVERIFIED_WARNING, JSON.stringify(updatedSkipWarningRecords));
  } catch (e) {
    console.error(e);
  }
};

const OWNER_RATIO_WARNING_THRESHOLD = 10;

export const UnverifiedWarningView: React.FC<Props> = ({
  collectionName,
  collectionAddress,
  isVerified,
  onConfirm,
  onClose,
}) => {
  const { t } = useTranslation();
  const [dontWarnAgain, setDontWarnAgain] = useState(false);

  const warningMetaQuery = useCollectionWarningMeta(collectionAddress);
  const shouldFetchOsImage = warningMetaQuery.isSuccess && !warningMetaQuery.data.logo;
  const osCollectionImagesQuery = useOsCollectionImages(collectionAddress, { enabled: shouldFetchOsImage });
  const logoImg = (warningMetaQuery.isSuccess && warningMetaQuery.data.logo) ||
    (osCollectionImagesQuery.isSuccess && osCollectionImagesQuery.data.logo) || { src: "" };
  const creatorFeeQuery = useCollectionCreatorFee(collectionAddress);

  const handleContinue = () => {
    if (dontWarnAgain) {
      setUnverifiedWarningKey(collectionAddress);
    }
    onConfirm();
  };

  // Warn if the creator royalty for this collection is above threshold
  const showRoyaltyWarning = !!(creatorFeeQuery.isSuccess && creatorFeeQuery.data.gt(ROYALTY_FEE_WARNING_THRESHOLD));

  // Warn if the collection's num tokens : num owners ratio is more than 10:1. e.g. 10,000 tokens in a collection, owned by 50 people. (200:1)
  const showOwnersRatioWarning = !!(
    warningMetaQuery.isSuccess &&
    warningMetaQuery.data.countOwners &&
    warningMetaQuery.data.totalSupply &&
    warningMetaQuery.data.totalSupply / warningMetaQuery.data.countOwners > OWNER_RATIO_WARNING_THRESHOLD
  );

  return (
    <>
      <ModalBody>
        <Flex mb={6} alignItems="center">
          <VerifiedIcon color="text-03" boxSize={15} width="60px" height="60px" />
          <Text color="text-03" bold fontSize="60px">
            ?
          </Text>
        </Flex>
        <Text textStyle="detail" bold>
          {t("This NFT's collection hasn't been verified by OpenEyes.nft.")}
        </Text>
        <Text textStyle="detail" color="text-02">
          {t("Make sure it's legitimate before you buy.")}
        </Text>
      </ModalBody>
      <ModalBody bg="ui-bg">
        <Flex alignItems="center" mb={6} overflow="hidden" whiteSpace="nowrap">
          <Link href={`/collections/${collectionAddress}`}>
            <a>
              <Avatar
                boxProps={{ borderRadius: 0 }}
                src={logoImg?.src}
                address={collectionAddress}
                size={32}
                mr={4}
                flexShrink={0}
              />
            </a>
          </Link>
          <CollectionLinkButton
            textProps={{ textStyle: "detail", bold: true, color: "link-01" }}
            name={collectionName}
            address={collectionAddress}
            isVerified={isVerified}
          />
        </Flex>
        <Flex justifyContent="space-between">
          <Text color="text-03" textStyle="detail">
            {t("Contract")}:
          </Text>
          <Text>
            <UikitLink
              isExternal
              textStyle="detail"
              color="link-01"
              href={getExplorerLink(collectionAddress, "address")}
            >
              {formatAddress(collectionAddress, 6)}
            </UikitLink>
          </Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text color="text-03" textStyle="detail">
            {t("Items in collection")}:
          </Text>
          <Text textStyle="detail">
            {warningMetaQuery.isSuccess && (
              <Text textStyle="detail">{warningMetaQuery.data.totalSupply?.toLocaleString()}</Text>
            )}
            {warningMetaQuery.isLoading && <Skeleton height="16px" my={0.5} width="42px" />}
          </Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text color="text-03" textStyle="detail">
            {t("Owners")}:
          </Text>
          {warningMetaQuery.isSuccess && (
            <Text textStyle="detail">{warningMetaQuery.data.countOwners?.toLocaleString()}</Text>
          )}
          {warningMetaQuery.isLoading && <Skeleton height="16px" my={0.5} width="36px" />}
        </Flex>

        <Flex justifyContent="space-between">
          <Text color="text-03" textStyle="detail">
            {t("Creator Royalties")}:
          </Text>
          <Flex>
            {creatorFeeQuery.isSuccess && (
              <Text textStyle="detail" color={showRoyaltyWarning ? "text-warning" : "text-01"}>
                {formatFees(creatorFeeQuery.data)}
              </Text>
            )}
            {creatorFeeQuery.isLoading && <Skeleton height="16px" my={0.5} width="36px" />}
          </Flex>
        </Flex>
        {showRoyaltyWarning && (
          <Flex justifyContent="flex-end" alignItems="center">
            <Popover
              label={
                <>
                  <TooltipText>
                    {t(
                      "When you buy this item, this amount will be taken out of the sale proceeds and sent to the creator of the NFT as royalties."
                    )}
                  </TooltipText>
                  <TooltipText>{t("Collection owners can adjust royalties.")}</TooltipText>
                  <TooltipText>{t("Default maximum royalties are 10%.")}</TooltipText>
                </>
              }
            >
              <Flex display="inline-flex">
                <Text color="text-warning" textStyle="detail" mr={1}>
                  {t("High Royalties")}
                </Text>
                <InformationIcon boxSize={5} color="text-warning" />
              </Flex>
            </Popover>
          </Flex>
        )}
        {showOwnersRatioWarning && (
          <Flex justifyContent="flex-end" alignItems="center">
            <Popover
              label={
                <TooltipText>
                  {t("The ratio of NFTs from this collection held by each owner is more than 10:1.")}
                </TooltipText>
              }
            >
              <Flex display="inline-flex">
                <Text color="text-warning" textStyle="detail" mr={1}>
                  {t("Low item/owner ratio")}
                </Text>
                <InformationIcon boxSize={5} color="text-warning" />
              </Flex>
            </Popover>
          </Flex>
        )}

        <Divider my={6} />
        <Flex alignItems="center">
          <Checkbox mr={3} isChecked={dontWarnAgain} onChange={() => setDontWarnAgain((prev) => !prev)} />
          <Text cursor="pointer" onClick={() => setDontWarnAgain((prev) => !prev)}>
            {t("Don't warn me about this collection")}
          </Text>
        </Flex>
      </ModalBody>

      <ModalFooterGrid>
        <Button tabIndex={1} variant="tall" colorScheme="gray" isFullWidth onClick={onClose}>
          {t("Cancel")}
        </Button>
        <Button tabIndex={2} variant="tall" isFullWidth onClick={handleContinue}>
          {t("Continue to Checkout")}
        </Button>
      </ModalFooterGrid>
    </>
  );
};
