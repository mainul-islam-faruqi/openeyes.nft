import { RefObject, useState } from "react";
import { useTranslation } from "next-i18next";
import { AspectRatio, Box, Skeleton } from "@chakra-ui/react";
import find from "lodash/find";
import { TOKEN_IMAGE_PLACEHOLDER_URI } from "config";
import { ASSET, SupportedContentTypes } from "config/supportedContentTypes";
import { useGetContentTypeHeaders } from "hooks/useGetHeaders";
import { AnimationData, ImageData } from "types/graphql";
import { Image } from "components/Image";
import { Video } from "components/Video";
import { ScriptMedia } from "components/ScriptMedia";
import { FullscreenImage } from "./FullscreenImage";

interface Props {
  imageRef: RefObject<HTMLDivElement>;
  animation: AnimationData;
  name: string;
  collectionName: string;
  image?: ImageData;
}

const sizes = "(max-width: 48rem) 95vw, (max-width: 90rem) 60vw, 536px";

const NftAnimation: React.FC<Props> = ({ imageRef, animation, image, name, collectionName }) => {
  const { t } = useTranslation();
  const [isError, setIsError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const contentTypeHeadersQuery = useGetContentTypeHeaders(animation.original || animation.src, {
    enabled: !animation.contentType,
  });

  const supportedContentMeta = (() => {
    if (animation.contentType) {
      return find(SupportedContentTypes, (supportedType) => !!animation.contentType?.includes(supportedType.mimeType));
    }
    return (
      contentTypeHeadersQuery.isSuccess &&
      find(
        SupportedContentTypes,
        (supportedType) =>
          !!(
            contentTypeHeadersQuery.data.indexerCustomHeader?.includes(supportedType.mimeType) ||
            contentTypeHeadersQuery.data.contentTypeHeader?.includes(supportedType.mimeType)
          )
      )
    );
  })();

  const contentTypeNotSupported = !supportedContentMeta && contentTypeHeadersQuery.isSuccess;

  const handleSupportedAsset = (assetType: ASSET) => {
    switch (assetType) {
      case ASSET.IMAGE:
        return (
          <Image
            src={animation.src}
            contentType={animation.contentType}
            alt={name}
            quality="auto:best"
            layout="fill"
            objectFit="contain"
            sizes={sizes}
            priority
            onLoadingComplete={() => {
              setIsLoaded(true);
            }}
            onError={() => {
              setIsError(true);
            }}
          />
        );
      case ASSET.VIDEO:
        return (
          <Video
            src={animation.src}
            preload="auto"
            loop={true}
            controls={true}
            sizes={{ base: 480, sm: 768 }}
            quality="auto:best"
            onError={() => {
              setIsError(true);
            }}
            onLoadedMetadataCapture={() => {
              setIsLoaded(true);
            }}
          />
        );
      case ASSET.SCRIPT:
        return (
          <ScriptMedia
            alt={name}
            original={animation.original}
            src={animation.src}
            imageSrc={image?.src}
            imageContentType={image?.contentType}
            onError={() => {
              setIsError(true);
            }}
            onLoad={() => {
              setIsLoaded(true);
            }}
          />
        );
      default:
        return (
          <Image
            src={TOKEN_IMAGE_PLACEHOLDER_URI}
            alt={t("Placeholder image")}
            layout="fill"
            objectFit="contain"
            sizes={sizes}
            priority
          />
        );
    }
  };

  const handleError = () => {
    // If the token has an image value - return the FullscreenImage
    if (image) {
      return (
        <FullscreenImage
          src={image.src}
          contentType={image.contentType}
          alt={name}
          name={name}
          collectionName={collectionName}
          flex={1}
          imageRef={imageRef}
        />
      );
    }
    // Else render placeholder image
    return (
      <Image src={TOKEN_IMAGE_PLACEHOLDER_URI} alt={name} layout="fill" objectFit="contain" sizes={sizes} priority />
    );
  };

  return (
    <Box flex={1} position="relative" sx={{ img: { color: "transparent" } }}>
      <AspectRatio ratio={1} ref={imageRef}>
        <Skeleton
          // isLoaded if media loads, errors, or the content headers have fetched but the content type is not supported
          isLoaded={isLoaded || isError || contentTypeNotSupported}
          height="100%"
          width="100%"
        >
          {supportedContentMeta &&
            !isError &&
            (contentTypeHeadersQuery.isSuccess || animation.contentType) &&
            // Media has supported content type
            handleSupportedAsset(supportedContentMeta.assetType)}
          {(contentTypeNotSupported || isError) &&
            // Unsupported content type or error loading media
            handleError()}
        </Skeleton>
      </AspectRatio>
    </Box>
  );
};

export default NftAnimation;
