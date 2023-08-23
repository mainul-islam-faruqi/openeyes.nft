import { pageHeightRemDesktop, pageHeightRemMobile } from "./global";

const pageHeight = { base: pageHeightRemMobile, lg: pageHeightRemDesktop };

export const layerStyles = {
  pageMinHeight: {
    minHeight: pageHeight,
  },
  pageHeight: {
    minHeight: pageHeight,
  },
};
