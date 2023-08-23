import { Flex, FlexProps } from "@chakra-ui/react";
import { Text } from "uikit";

export interface SectionRow extends FlexProps {
  label: string;
}

export const SectionRow: React.FC<SectionRow> = ({ label, children, ...props }) => (
  <Flex alignItems="center" justifyContent="space-between" width="100%" {...props}>
    <Text color="text-03" textStyle="detail">
      {label}:
    </Text>
    <Text color="text-02" bold textStyle="detail" textAlign="right">
      {children}
    </Text>
  </Flex>
);
