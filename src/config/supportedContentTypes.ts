export const INDEXER_CUSTOM_CONTENT_TYPE_HEADER = "x-amz-meta-content-type";

export enum ASSET {
  VIDEO,
  IMAGE,
  SCRIPT,
}

export interface ContentMeta {
  mimeType: string;
  assetType: ASSET;
}

export const SupportedContentTypes: Record<string, ContentMeta> = {
  IMAGE_BMP: { mimeType: "image/bmp", assetType: ASSET.IMAGE },
  IMAGE_GIF: { mimeType: "image/gif", assetType: ASSET.IMAGE },
  IMAGE_JPEG: { mimeType: "image/jpeg", assetType: ASSET.IMAGE },
  IMAGE_PNG: { mimeType: "image/png", assetType: ASSET.IMAGE },
  IMAGE_SVG: { mimeType: "image/svg+xml", assetType: ASSET.IMAGE },
  IMAGE_TIFF: { mimeType: "image/tiff", assetType: ASSET.IMAGE },
  IMAGE_WEBP: { mimeType: "image/webp", assetType: ASSET.IMAGE },
  VIDEO_MP4: { mimeType: "video/mp4", assetType: ASSET.VIDEO },
  VIDEO_MPEG: { mimeType: "video/mpeg", assetType: ASSET.VIDEO },
  VIDEO_OGG: { mimeType: "video/ogg", assetType: ASSET.VIDEO },
  TEXT_HTML: { mimeType: "text/html", assetType: ASSET.SCRIPT },
  TEXT_JAVASCRIPT: { mimeType: "text/javascript", assetType: ASSET.SCRIPT },
};
