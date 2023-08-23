import { RefObject, useEffect, useState } from "react";
import noop from "lodash/noop";
import { Box, Flex, AspectRatio, AspectRatioProps, IconButton, Skeleton } from "@chakra-ui/react";
import { MinimizeIcon, Text } from "uikit";
import { TOKEN_IMAGE_PLACEHOLDER_URI } from "config";
import { TokenMedia } from "components/TokenMedia";
import { Image } from "components/Image";

export interface FullscreenImage extends AspectRatioProps {
  imageRef: RefObject<HTMLDivElement>;
  src: string;
  contentType?: string;
  alt: string;
  name: string;
  collectionName: string;
}

export const FullscreenImage = ({
  imageRef,
  src,
  contentType,
  alt,
  name,
  collectionName,
  ...props
}: FullscreenImage) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFullscreenImageError, setIsFullscreenImageError] = useState(false);
  const [isFullscreenImageLoaded, setIsFullscreenImageLoaded] = useState(false);
  const [isImageError, setIsImageError] = useState(false);

  const enterFullscreen = () => {
    if (imageRef.current && imageRef.current.requestFullscreen) {
      imageRef.current.requestFullscreen();
    }
  };

  const exitFullscreen = () => {
    if (typeof window !== "undefined" && document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  // Keep track of fullscreen state
  useEffect(() => {
    const handleFullscreenchange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenchange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenchange);
    };
  }, [setIsFullscreen, imageRef]);

  const isVideo = contentType?.includes("video");

  return (
    <Flex flexDirection="column" flex={1} ref={imageRef} height={isFullscreen ? "100vh" : "auto"} width="100%">
      <Box p={4} textAlign="right" color="white" flexShrink={0} display={isFullscreen ? "block" : "none"}>
        <IconButton aria-label="minimize" variant="ghost" colorScheme="gray" onClick={exitFullscreen} color="text-01">
          <MinimizeIcon />
        </IconButton>
      </Box>
      <Box height="100%" flex={1} position="relative" textAlign="center">
        {!isImageError && !isVideo && isFullscreen ? (
          <Skeleton isLoaded={isFullscreenImageLoaded}>
            <Image
              onLoadingComplete={() => setIsFullscreenImageLoaded(true)}
              onError={() => setIsFullscreenImageError(true)}
              src={isFullscreenImageError ? TOKEN_IMAGE_PLACEHOLDER_URI : src}
              contentType={contentType}
              alt={alt}
              layout="fill"
              objectFit="contain"
              sizes="100vw"
              quality="auto:best"
            />
          </Skeleton>
        ) : (
          <AspectRatio
            ratio={1}
            cursor={isImageError || isVideo ? "auto" : isFullscreen ? "zoom-out" : "zoom-in"}
            onClick={isImageError || isVideo ? noop : enterFullscreen}
            {...props}
          >
            <TokenMedia
              src={src}
              contentType={contentType}
              alt={alt}
              imageProps={{
                priority: true,
                sizes: "(max-width: 48rem) 95vw, (max-width: 90rem) 60vw, 536px",
                quality: "auto:best",
              }}
              videoProps={{
                preload: "auto",
                loop: true,
                controls: true,
                sizes: { base: 480, sm: 768 },
                quality: "auto:best",
              }}
              imageErrorCallback={() => setIsImageError(true)}
            />
          </AspectRatio>
        )}
        <Box
          position="absolute"
          left={0}
          bottom={0}
          width="100%"
          p={4}
          display={isFullscreen ? "block" : "none"}
          bg="rgba(0, 0, 0, 0.7)"
          textAlign="left"
        >
          {/* do not apply color mode, these are on a black bg in full screen */}
          <Text color="white" bold>
            {name}
          </Text>
          <Text color="text-02" textStyle="detail">
            {collectionName}
          </Text>
        </Box>
      </Box>
    </Flex>
  );
};
