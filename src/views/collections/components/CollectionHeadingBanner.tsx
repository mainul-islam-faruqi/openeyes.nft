import { useMemo } from "react";
import { Box, useColorModeValue } from "@chakra-ui/react";
import { CSSObject } from "@emotion/react";
import { Image } from "components/Image";

interface CollectionBannerProps {
  bannerImgSrc?: string;
  name?: string;
  logoImgSrc?: string;
  isLargeLayout?: boolean;
}

const lightGradient = "linear-gradient(90deg, rgba(255, 255, 255, 0.8) 0.15%, rgba(255, 255, 255, 0) 100%)";
const darkGradient = "linear-gradient(90deg, rgba(18, 22, 25, 0.8) 0.15%, rgba(18, 22, 25, 0) 100%)";

export const CollectionBanner = ({ bannerImgSrc, name, logoImgSrc, isLargeLayout = false }: CollectionBannerProps) => {
  const bannerGradient = useColorModeValue(lightGradient, darkGradient);
  const bannerGradientSx = useMemo<CSSObject>(() => {
    if (isLargeLayout) {
      // target the span that wraps nextjs img
      return {
        "& > span::after": {
          content: '" "',
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: "100%",
          background: bannerGradient,
        },
      };
    }
    return {};
  }, [isLargeLayout, bannerGradient]);

  if (bannerImgSrc) {
    return (
      <Box sx={bannerGradientSx}>
        <Image
          className={isLargeLayout ? "collection-banner-dim-dark" : ""}
          src={bannerImgSrc}
          alt={name}
          layout="fill"
          objectFit="cover"
          sizes="100vw"
          quality="auto:low"
          priority
        />
      </Box>
    );
  }

  if (logoImgSrc) {
    // Keep the same size as the logo (128) in order to hit the cache
    return (
      <Box sx={bannerGradientSx}>
        <Image
          className={isLargeLayout ? "collection-banner-blur-large" : "collection-banner-blur"}
          src={logoImgSrc}
          alt={name}
          layout="fill"
          objectFit="cover"
          sizes="128px"
          priority
        />
      </Box>
    );
  }

  return null;
};
