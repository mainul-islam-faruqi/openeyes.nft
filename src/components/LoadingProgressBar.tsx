import NextNprogress from "nextjs-progressbar";
import { useColorModeValue } from "@chakra-ui/react";
import { theme } from "uikit";

export const LoadingProgressBar = () => {
  // interactive-01 semantic color
  const color = useColorModeValue(theme.colors.green["200"], theme.colors.green["300"]);
  return <NextNprogress color={color} />;
};
