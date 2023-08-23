import React from "react";
import { IconButton } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { RestartIcon, TooltipText, Popover } from "uikit";
import { useRefreshTokenMetadata } from "hooks/useRefreshTokenMetadata";

interface Props {
  tokenId: string;
  collectionAddress: string;
}

const RefreshMetadataButton: React.FC<Props> = ({ tokenId, collectionAddress }) => {
  const { t } = useTranslation();
  const refreshTokenMetadata = useRefreshTokenMetadata();

  return (
    <Popover label={<TooltipText>{t("Refresh Metadata")}</TooltipText>}>
      <IconButton
        aria-label="refresh metadata"
        variant="ghost"
        colorScheme="gray"
        onClick={() => refreshTokenMetadata(collectionAddress, tokenId)}
      >
        <RestartIcon />
      </IconButton>
    </Popover>
  );
};

export default RefreshMetadataButton;
