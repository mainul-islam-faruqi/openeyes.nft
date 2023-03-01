// import { useEffect } from "react";
// import { Flex, Box, BoxProps, useDisclosure, Collapse, FlexProps, CollapseProps } from "@chakra-ui/react";
// import noop from "lodash/noop";
// import { ChevronDown, ChevronUp } from "uikit";


import { useEffect } from "react";
import { Flex, Box, BoxProps, useDisclosure, Collapse, FlexProps, CollapseProps } from "@chakra-ui/react";
import noop from "lodash/noop";
import ChevronDown from "uikit/Icons/components/ChevronDown"
import ChevronUp from "uikit/Icons/components/ChevronUp"




interface Props extends BoxProps {
  header: React.ReactNode;
  isOpenCallback?: () => void;
  defaultIsOpen?: boolean;
  collapseProps?: CollapseProps;
  headerProps?: FlexProps;
}

const Collapsable: React.FC<Props> = ({
  header,
  defaultIsOpen,
  collapseProps,
  children,
  headerProps,
  isOpenCallback = noop,
  ...props
}) => {
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen });

  useEffect(() => {
    // Toggling to isOpen
    if (isOpen) {
      isOpenCallback();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <>
      <Flex p={4} alignItems="center" justifyContent="space-between" cursor="pointer" onClick={onToggle} {...props}>
        <Flex {...headerProps} alignItems="center" flex={1}>
          {header}
        </Flex>
        <Box>{isOpen ? <ChevronUp /> : <ChevronDown />}</Box>
      </Flex>
      <Collapse {...collapseProps} in={isOpen}>
        {children}
      </Collapse>
    </>
  );
};

Collapsable.defaultProps = {
  defaultIsOpen: false,
  bg: "ui-02",
};

export default Collapsable;
