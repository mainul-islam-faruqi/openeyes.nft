import { AspectRatio, AspectRatioProps } from "@chakra-ui/react";
import { breakpoints } from "uikit/theme/breakpoints";
import { TokenMedia } from "components/TokenMedia/TokenMedia";

interface NftCardImageProps extends AspectRatioProps {
  src: string;
  alt: string;
  contentType?: string;
}

// TokenMedia is a complex component and is challenging to change it in a way
// that will enable it to pass down image styles i.e. The Next image component
// omits the style property from it's type
const containerSx = { img: { borderRadius: "0.25rem" } };

export const NftCardImage = ({ src, contentType, alt, ...props }: NftCardImageProps) => {
  return (
    <AspectRatio ratio={1} sx={containerSx} {...props}>
      <TokenMedia
        src={src}
        alt={alt}
        contentType={contentType}
        imageProps={{
          sizes: `(max-width: ${breakpoints.sm}) 100vw, (max-width: ${breakpoints.md}) 360px, 262px`,
          lazyBoundary: "800px",
        }}
        videoProps={{ loop: true, sizes: { base: 428, xs: 428, sm: 360, md: 262 } }}
      />
    </AspectRatio>
  );
};
