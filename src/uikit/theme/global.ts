import "focus-visible/dist/focus-visible";
import { breakpoints } from "./breakpoints";
import { lineHeights } from "./typography";
import { sizes } from "./sizes";

export const pageHeightRemMobile = "calc(100vh - 4rem)";
export const pageHeightRemDesktop = "calc(100vh - 5rem)";

interface SizeKeys {
  base: 18;
  md: 20;
}
export const navHeightSizeKeys: SizeKeys = { base: 18, md: 20 };
// assign rem values, not theme sizes, so we can apply them within `calc()`
export const navHeightResponsive = { base: sizes[navHeightSizeKeys.base], md: sizes[navHeightSizeKeys.md] };

export const global = {
  "html, body": {
    minHeight: pageHeightRemMobile, // Nav height on mobile
    "#__next": {
      minHeight: pageHeightRemMobile,
    },
    [`@media screen and (min-width: ${breakpoints.md})`]: {
      minHeight: pageHeightRemDesktop, // Nav height on desktop
      "#__next": {
        minHeight: pageHeightRemDesktop,
      },
    },
  },
  body: {
    background: "ui-bg",
    color: "text-01",
    fontFamily: "'Inter', sans-serif",
    fontFeatureSettings: "'calt' 0",
    a: {
      lineHeight: lineHeights.md,
    },
  },
  // with focus-visible package we override chakra's focus effects on clicked elements. focus states should only appear from keyboard navigation
  ".js-focus-visible :focus:not(.focus-visible)": {
    shadow: "none",
  },
};
