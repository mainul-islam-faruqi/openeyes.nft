import { useState } from "react";
import { Box, Skeleton, ResponsiveObject } from "@chakra-ui/react";
import { ImageProps as NextImageProps } from "next/image";
import noop from "lodash/noop";
import { TOKEN_IMAGE_PLACEHOLDER_URI } from "config/urls";
import { Image, ImageProps } from "components/Image";
import { Video, VideoProps } from "../Video";

interface TokenMediaImageProps extends Omit<ImageProps, "src" | "alt" | "sizes"> {
  sizes: NextImageProps["sizes"];
}

interface TokenMediaVideoProps extends Omit<VideoProps, "src"> {
  sizes?: ResponsiveObject<number>;
}

interface Props {
  src: string;
  contentType?: string;
  alt: string;
  imageProps: TokenMediaImageProps;
  videoProps?: TokenMediaVideoProps;
  isImageError?: boolean;
  imageErrorCallback?: () => void;
  imageLoadedCallback?: () => void;
  videoErrorCallback?: () => void;
  videoLoadedCallback?: () => void;
}

export const TokenMedia: React.FC<Props> = ({
  src,
  contentType,
  alt,
  imageProps,
  videoProps,
  imageErrorCallback = noop,
  imageLoadedCallback = noop,
  videoErrorCallback = noop,
  videoLoadedCallback = noop,
}) => {
  const [isImageError, setIsImageError] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isVideoError, setIsVideoError] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  const onImageError = () => {
    setIsImageError(true);
    imageErrorCallback();
  };

  const onImageLoadingComplete = () => {
    setIsImageLoaded(true);
    imageLoadedCallback();
  };

  const onVideoError = () => {
    setIsVideoError(true);
    videoErrorCallback();
  };

  const onVideoLoadedMetadata = () => {
    setIsVideoLoaded(true);
    videoLoadedCallback();
  };

  const isVideo = contentType && contentType.includes("video");

  return (
    <>
      {/* Both error - placeholder image */}
      {isImageError && isVideoError ? (
        <Box position="relative" width="100%" height="100%" sx={{ img: { color: "transparent" } }}>
          <Image src={TOKEN_IMAGE_PLACEHOLDER_URI} alt={alt} layout="fill" objectFit="contain" {...imageProps} />
        </Box>
      ) : (
        <>
          {/* Is not video. Or the video has errored - attempt to load image */}
          {((!isVideo && !isImageError) || isVideoError) && (
            <Skeleton isLoaded={isImageLoaded}>
              {/* color: transparent is a Firefox workaround to make alt text rendered while an image is loading, transparent */}
              <Box position="relative" width="100%" height="100%" sx={{ img: { color: "transparent" } }}>
                <Image
                  onLoadingComplete={onImageLoadingComplete}
                  onError={onImageError}
                  src={src}
                  contentType={contentType}
                  alt={alt}
                  layout="fill"
                  objectFit="contain"
                  {...imageProps}
                />
              </Box>
            </Skeleton>
          )}
          {/* Is video. Or image has errored - attempt to load video */}
          {(isVideo || (isImageError && !isVideoError)) && (
            <Skeleton isLoaded={isVideoLoaded}>
              <Video src={src} loadedMetadataCallback={onVideoLoadedMetadata} onError={onVideoError} {...videoProps} />
            </Skeleton>
          )}
        </>
      )}
    </>
  );
};
