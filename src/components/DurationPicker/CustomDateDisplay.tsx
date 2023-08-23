import { Flex, FlexProps } from "@chakra-ui/react";

interface CustomDateDisplayProps extends FlexProps {
  dateStr?: string;
}

export const CustomDateDisplay = ({ dateStr, ...props }: CustomDateDisplayProps) => (
  <Flex
    alignItems="center"
    height={10}
    px={4}
    borderWidth="1px 0 1px 1px"
    borderStyle="solid"
    borderColor="border-01"
    {...props}
  >
    {dateStr}
  </Flex>
);
