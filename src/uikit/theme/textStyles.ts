import { fontSizes, lineHeights } from "./typography";

export const textStyles = {
  // Text
  caption: {
    fontSize: fontSizes["1xs"],
    lineHeight: lineHeights.xs,
    letterSpacing: "0.02em",
  },
  helper: {
    fontSize: fontSizes.xs,
    lineHeight: lineHeights.xs,
  },
  detail: {
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.sm,
  },
  "detail-emphasis": {
    fontSize: fontSizes.sm,
    fontWeight: 600,
    lineHeight: lineHeights.sm,
  },
  body: {
    fontSize: fontSizes.md,
    lineHeight: lineHeights.md,
  },
  // Heading
  "display-body": {
    fontSize: fontSizes.lg,
    lineHeight: lineHeights.lg,
  },
  "heading-05": {
    fontSize: fontSizes.md,
    lineHeight: lineHeights.md,
  },
  "heading-04": {
    fontSize: fontSizes.lg,
    lineHeight: lineHeights.lg,
  },
  "heading-03": {
    fontSize: fontSizes.xl,
    lineHeight: lineHeights.lg,
  },
  "display-03": {
    fontSize: { base: fontSizes["2xl"], md: fontSizes["4xl"] },
    lineHeight: { base: lineHeights.xl, md: lineHeights["2xl"] },
    letterSpacing: "-0.03em",
  },
  "display-02": {
    fontSize: { base: fontSizes["4xl"], md: fontSizes["5xl"] },
    lineHeight: { base: lineHeights["2xl"], md: lineHeights["3xl"] },
    letterSpacing: "-0.03em",
  },
  "display-01": {
    fontSize: { base: fontSizes["5xl"], md: fontSizes["6xl"] },
    lineHeight: { base: lineHeights["3xl"], md: lineHeights["4xl"] },
    letterSpacing: "-0.03em",
  },
};
