// @ts-nocheck
import { ReactEventHandler, useState, useRef, MouseEvent, VideoHTMLAttributes, useCallback } from "react";
import noop from "lodash/noop";
import { Box, IconButton, useBreakpointValue } from "@chakra-ui/react";
// import { getCloudinaryUrl, CloudinaryLoaderProps, Format, Quality } from "@looksrare/shared";
import { ResponsiveObject } from "@chakra-ui/styled-system/dist/declarations/src/utils";
import { PlayFilledAltIcon } from "uikit";
import { currentChainInfo } from "config/chains";

/**
 * Return Cloudinary URL for resources delivered by our CDN.
 * For other resources - return the src
 * @returns string
 */
const getMediaSrc = ({
  src,
  width,
  format,
  quality,
}: Omit<CloudinaryLoaderProps, "resourceType" | "baseCloudinaryUrl">) => {
  if (currentChainInfo.cdnUrl && src.startsWith(currentChainInfo.cdnUrl)) {
    const relativeSrc = src.replace(currentChainInfo.cdnUrl, "");
    return getCloudinaryUrl({
      src: relativeSrc,
      baseCloudinaryUrl: currentChainInfo.cloudinaryUrl,
      width,
      format,
      quality,
      resourceType: "video",
    });
  }

  return src;
};

enum LoadState {
  NOT_ATTEMPTED,
  HAS_DATA,
}

enum PlayState {
  PLAYING,
  PAUSED,
}

export interface VideoProps extends VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
  sizes?: ResponsiveObject<number>;
  format?: Format;
  quality?: Quality;
}

interface Props extends VideoProps {
  loadedMetadataCallback?: () => void;
  onError?: ReactEventHandler<HTMLVideoElement>;
}

export const Video: React.FC<Props> = ({
  src,
  sizes,
  format,
  quality = "auto",
  onError = noop,
  loadedMetadataCallback = noop,
  ...props
}) => {
  const [videoLoadState, setVideoLoadState] = useState(LoadState.NOT_ATTEMPTED);
  const [playState, setPlayState] = useState(PlayState.PAUSED);
  const videoElement = useRef<HTMLVideoElement>(null);
  const width = useBreakpointValue({ ...sizes });
  const showPlay = !props.controls && playState !== PlayState.PLAYING && videoLoadState === LoadState.HAS_DATA;

  const mediaSrc = useCallback(() => {
    return getMediaSrc({ src, width, quality, format });
  }, [src, width, quality, format])();

  const onLoadedMetadata = () => {
    setVideoLoadState(LoadState.HAS_DATA);
    loadedMetadataCallback();
  };

  const handlePlayClick = (e: MouseEvent) => {
    e.stopPropagation(); // prevent trigggering card link on click
    e.preventDefault(); // prevent trigggering card link on click
    videoElement.current && videoElement.current.play();
  };

  return (
    <>
      <Box position="relative" height="100%">
        <video
          ref={videoElement}
          onPlay={() => setPlayState(PlayState.PLAYING)}
          onPause={() => setPlayState(PlayState.PAUSED)}
          onLoadedMetadata={onLoadedMetadata}
          onError={onError}
          controls={props.controls || playState === PlayState.PLAYING}
          preload="metadata"
          style={{ borderRadius: "0.25rem", height: "100%", width: "100%" }}
          {...props}
        >
          <source src={mediaSrc} type="video/mp4" />
        </video>
        {showPlay && (
          <Box opacity={0.8} position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)" zIndex="docked">
            <IconButton
              isRound
              isLoading={!videoElement.current}
              aria-label="play"
              colorScheme="gray"
              onClick={(e) => handlePlayClick(e)}
            >
              <PlayFilledAltIcon />
            </IconButton>
          </Box>
        )}
      </Box>
    </>
  );
};
