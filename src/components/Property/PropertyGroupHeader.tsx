import { ReactElement } from "react";
import { Box, Flex, FlexProps } from "@chakra-ui/react";
import { ChevronUpIcon, ChevronDown, Text } from "uikit";
import { DEFAULT_TRANSITION_DUR, SIDEBAR_WIDTH_COLLAPSED, SIDEBAR_WIDTH_OPEN } from "components/Layout/FilterLayout/context";

export interface PropertyGroupHeaderProps extends FlexProps {
  leftIcon?: ReactElement;
  rightIcon?: ReactElement;
  hideRightIcon?: boolean;
  label: string;
  count?: number;
  isCollapsed?: boolean;
  isSidebar?: boolean;
  isOpen?: boolean;
  transitionDur?: string;
}

export const PropertyGroupHeader = ({
  leftIcon,
  rightIcon,
  hideRightIcon,
  label,
  count,
  isCollapsed = false,
  isSidebar = true,
  isOpen = true,
  transitionDur = DEFAULT_TRANSITION_DUR,
  ...props
}: PropertyGroupHeaderProps) => {
  const getRightIcon = () => {
    if (hideRightIcon) {
      return null;
    }

    if (rightIcon) {
      return rightIcon;
    }

    return isOpen ? <ChevronUpIcon boxSize={5} color="text-03" /> : <ChevronDown boxSize={5} color="text-03" />;
  };

  const getPropertyWidth = () => {
    if (!isSidebar) {
      return "100%";
    }

    return isCollapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_OPEN;
  };

  return (
    <Flex
      alignItems="center"
      overflow="hidden"
      cursor="pointer"
      bg="ui-01"
      sx={{
        _hover: {
          bg: "hover-ui",
        },
        _active: {
          bg: "onclick-ui",
        },
      }}
      height={12}
      transition="width"
      transitionDuration={transitionDur}
      transitionTimingFunction="ease"
      width={getPropertyWidth()}
      userSelect="none"
      px={4}
      {...props}
    >
      {leftIcon && (
        <Flex flexShrink={0} justifyContent="center" mr={4}>
          {leftIcon}
        </Flex>
      )}
      <Flex flex={1} alignItems="center">
        <Text
          opacity={isCollapsed ? 0 : 1}
          transition="opacity"
          transitionDuration={transitionDur}
          transitionTimingFunction="ease"
          color="currentColor"
          isTruncated
          whiteSpace="nowrap"
          bold
          textStyle="detail"
        >
          {label}
        </Text>
        {(!!count || count === 0) && (
          <Flex
            alignItems="center"
            justifyContent="center"
            p="2px 4px"
            m="0 8px"
            borderRadius="8px"
            border="1px solid"
            borderColor="border-02"
          >
            <Text textStyle="helper" color="text-03" bold m={0}>
              {count}
            </Text>
          </Flex>
        )}
      </Flex>

      <Box
        flexShrink={0}
        color="currentcolor"
        opacity={isCollapsed ? 0 : 1}
        transition="opacity"
        transitionDuration={transitionDur}
        transitionTimingFunction="ease"
      >
        {getRightIcon()}
      </Box>
    </Flex>
  );
};
