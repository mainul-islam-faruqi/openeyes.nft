import React from "react";
import { Box, BoxProps, Flex, Spinner } from "@chakra-ui/react";
import { ClockIcon, CheckmarkFilledIcon } from "../index";
import { Text } from "../Text/Text";

export type StepStatus = "past" | "current" | "future";

const icons: Record<StepStatus, React.FC> = {
  past: () => <CheckmarkFilledIcon color="text-03" />,
  current: () => <Spinner color="interactive-01" />,
  future: () => <ClockIcon color="text-03" />,
};

export interface StepStatusProps extends BoxProps {
  title: string;
  status: StepStatus;
  collapse?: boolean;
}

export const Step: React.FC<StepStatusProps> = ({ title, status, collapse = false, children, ...props }) => {
  const Icon = icons[status];
  return (
    <Box {...props}>
      <Flex>
        <Icon />
        <Text bold color={status === "current" ? "interactive-01" : "text-03"} ml={2}>
          {title}
        </Text>
      </Flex>
      {/* 11 and 19 to be aligned with the icon (icon width = 24px, borderWdth = 2px) */}
      {!collapse && (
        <Box mt={2} ml="11px" pl="19px" borderLeft="2px solid" borderColor="border-02">
          {children}
        </Box>
      )}
    </Box>
  );
};

/**
 * Helper to get the Status of a step in list of step
 * @param currentIndex index of the active item
 * @param itemIndex index of the item being displayed
 * @returns Status
 */
export const getStepStatus = (itemIndex: number, activeIndex: number): StepStatus => {
  if (itemIndex < activeIndex) {
    return "past";
  }
  if (itemIndex > activeIndex) {
    return "future";
  }
  return "current";
};

// export default Step;
