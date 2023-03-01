import { useState } from "react";
import noop from "lodash/noop";
import { useTranslation } from "next-i18next";
import { ImageProps } from "next/image";
import { Box, Flex, useDisclosure } from "@chakra-ui/react";
import { LOCAL_STORAGE_ALLOW_SCRIPTS_CONSENT, TOKEN_IMAGE_PLACEHOLDER_URI } from "config";
import { Button, PlayFilledAltIcon } from "uikit";
import { getLocalStorageItem } from "utils/localStorage";
import { Iframe, IframeProps } from "components/Iframe";
import { Image } from "components/Image";
import ScriptConsentModal from "components/Modals/Orders/ScriptConsentModal";

interface ScriptProps extends IframeProps, Pick<ImageProps, "sizes" | "alt"> {
  imageSrc?: string;
  imageContentType?: string;
}

interface PlaceholderProps extends Omit<ScriptProps, "iframeProps" | "original" | "src"> {
  onConfirm: () => void;
}

const ScriptPlaceholder: React.FC<PlaceholderProps> = ({
  imageSrc,
  imageContentType,
  alt,
  sizes,
  onConfirm,
  onLoad = noop,
}) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isPlaceholderError, setIsPlaceholderError] = useState(false);

  return (
    <>
      <ScriptConsentModal isOpen={isOpen} onClose={onClose} onConfirm={onConfirm} />
      <Box position="relative" height="100%" width="100%">
        {imageSrc && !isPlaceholderError ? (
          <Image
            src={imageSrc}
            contentType={imageContentType}
            alt={alt}
            layout="fill"
            objectFit="contain"
            sizes={sizes}
            onLoadingComplete={onLoad}
            onError={() => setIsPlaceholderError(true)}
            priority
          />
        ) : (
          <Image
            src={TOKEN_IMAGE_PLACEHOLDER_URI}
            alt={t("Placeholder image")}
            layout="fill"
            objectFit="contain"
            sizes={sizes}
            onLoadingComplete={onLoad}
            priority
          />
        )}
        <Box position="absolute" bottom={0} left={0} width="100%" height="64px">
          <Flex
            height="100%"
            alignItems="center"
            justifyContent="center"
            bg="linear-gradient(180deg,rgba(18, 22, 25, 0) 0%,rgba(18, 22, 25, 0.47) 100%)"
          >
            <Button leftIcon={<PlayFilledAltIcon boxSize={5} />} colorScheme="secondary" onClick={onOpen}>
              {t("Allow Full Content")}
            </Button>
          </Flex>
        </Box>
      </Box>
    </>
  );
};

export const ScriptMedia: React.FC<ScriptProps> = ({
  src,
  alt,
  original,
  imageSrc,
  imageContentType,
  sizes,
  onError = noop,
  onLoad = noop,
  iframeProps,
}) => {
  const [hasAllowedScripts, setHasAllowedScripts] = useState(getLocalStorageItem(LOCAL_STORAGE_ALLOW_SCRIPTS_CONSENT));

  return (
    <>
      {hasAllowedScripts ? (
        <Iframe original={original} src={src} onError={onError} onLoad={onLoad} {...iframeProps} />
      ) : (
        <ScriptPlaceholder
          imageSrc={imageSrc}
          imageContentType={imageContentType}
          alt={alt}
          onLoad={onLoad}
          onConfirm={() => setHasAllowedScripts("1")}
          sizes={sizes}
        />
      )}
    </>
  );
};
