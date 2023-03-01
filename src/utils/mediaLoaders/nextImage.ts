import { ImageLoaderProps as NextImageLoaderProps } from "next/image";
import { Quality } from "@looksrare/shared";

export interface ImageLoaderProps extends Omit<NextImageLoaderProps, "quality"> {
  quality?: Quality;
}

/** Default NextJs image loader
 *
 * This function is (mostly) copied from the next/image code,
 * because they are not exported and next/image doesn't support multiple loaders
 * /!\ We need to make sure we keep this code up to date when a new version is released
 *
 * https://github.com/vercel/next.js/blob/canary/packages/next/client/image.tsx
 */
export function nextImageLoader({ config, src, width, quality }: ImageLoaderProps): string {
  if (process.env.NODE_ENV !== "production") {
    const missingValues = [];

    // these should always be provided but make sure they are
    if (!src) {
      missingValues.push("src");
    }
    if (!width) {
      missingValues.push("width");
    }

    if (missingValues.length > 0) {
      throw new Error(
        `Next Image Optimization requires ${missingValues.join(
          ", "
        )} to be provided. Make sure you pass them as props to the \`next/image\` component. Received: ${JSON.stringify(
          { src, width, quality }
        )}`
      );
    }

    if (src.startsWith("//")) {
      throw new Error(
        `Failed to parse src "${src}" on \`next/image\`, protocol-relative URL (//) must be changed to an absolute URL (http:// or https://)`
      );
    }

    if (!src.startsWith("/") && config.domains) {
      let parsedSrc: URL;
      try {
        parsedSrc = new URL(src);
      } catch (err) {
        console.error(err);
        throw new Error(
          `Failed to parse src "${src}" on \`next/image\`, if using relative image it must start with a leading slash "/" or be an absolute URL (http:// or https://)`
        );
      }

      if (process.env.NODE_ENV !== "test" && !config.domains.includes(parsedSrc.hostname)) {
        throw new Error(
          `Invalid src prop (${src}) on \`next/image\`, hostname "${parsedSrc.hostname}" is not configured under images in your \`next.config.js\`\n` +
            `See more info: https://nextjs.org/docs/messages/next-image-unconfigured-host`
        );
      }
    }
  }

  if (src.endsWith(".svg") && !config.dangerouslyAllowSVG) {
    // Special case to make svg serve as-is to avoid proxying
    // through the built-in Image Optimization API.
    return src;
  }

  // Do not pass string (i.e. 'auto', 'auto:good') to nextImageLoader
  const nextImageQuality = typeof quality === "string" ? 75 : quality;

  return `${config.path}?url=${encodeURIComponent(src)}&w=${width}&q=${nextImageQuality || 75}`;
}
