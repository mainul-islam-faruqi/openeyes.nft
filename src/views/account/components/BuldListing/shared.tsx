import { Box, BoxProps, Flex, Spinner } from "@chakra-ui/react";
import { CheckmarkFilledIcon, ClockIcon, ErrorIcon, IconProps, Text, TextProps } from "uikit";

export type ListingStatus = "done" | "pending" | "error" | "wait" | "skipped";

const stickyTopOffset = "112px"; // navHeightResponsive.md + 8rem from the page content's padding-top
export const ListingPane: React.FC<BoxProps> = ({ children, ...props }) => {
  return (
    <Box
      bg="ui-01"
      pt={6}
      pb={4}
      px={4}
      borderRadius="8px"
      height="fit-content"
      position={{ base: "relative", xl: "sticky" }}
      top={{ base: 0, xl: stickyTopOffset }}
      {...props}
    >
      {children}
    </Box>
  );
};

interface ListingStatusIconProps extends IconProps {
  status: ListingStatus;
  boxSize?: number;
}

export const ListingStatusIcon: React.FC<ListingStatusIconProps> = ({ status, boxSize }) => {
  if (status === "pending") {
    return <Spinner color="link-01" boxSize={boxSize} />;
  }
  if (status === "error") {
    return <ErrorIcon color="text-error" boxSize={boxSize} />;
  }
  if (status === "wait") {
    return <ClockIcon color="text-disabled" boxSize={boxSize} />;
  }
  if (status === "skipped") {
    return <ErrorIcon color="text-disabled" boxSize={boxSize} />;
  }
  // "done"
  return <CheckmarkFilledIcon color="link-01" boxSize={boxSize} />;
};

interface ListingRowProps {
  status: ListingStatus;
  text: string;
  textProps?: TextProps;
}

export const ListingRow: React.FC<ListingRowProps> = ({ status, text, textProps }) => {
  const iconColor = (() => {
    if (status === "pending") {
      return "link-01";
    }
    if (status === "error") {
      return "text-error";
    }
    if (status === "skipped") {
      return "text-disabled";
    }

    return "text-03";
  })();

  return (
    <Flex alignItems="center" width="100%">
      <Flex alignItems="center" mr={2}>
        <ListingStatusIcon status={status} color={iconColor} boxSize={4} />
      </Flex>
      <Box minWidth={0}>
        <Text isTruncated color="text-03" textStyle="detail" {...textProps}>
          {text}
        </Text>
      </Box>
    </Flex>
  );
};
