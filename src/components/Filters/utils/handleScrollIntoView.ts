import { navHeightSizeKeys } from "uikit/theme/global";

/**
 * Scroll to element in viewport, factoring in the nav bar height
 */
export const handleScrollIntoView = (element?: HTMLDivElement | null) => {
  if (element) {
    if (typeof window !== "undefined") {
      const navOffsetY = navHeightSizeKeys.md * 4;
      const targetY = element.getBoundingClientRect().top + window.scrollY - navOffsetY;
      window.scrollTo({ top: targetY });
    } else {
      // Less accurate scroll behaviour if the window object is undefined
      element.scrollIntoView({ block: "start" });
    }
  }
};
