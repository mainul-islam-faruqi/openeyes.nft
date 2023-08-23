// import { Flex, FlexProps, Skeleton, TextProps } from "@chakra-ui/react";
// import { Text } from "uikit";



import { Flex, FlexProps, Skeleton, TextProps } from "@chakra-ui/react";
import { Text } from "uikit/Text/Text";




interface Props {
  isSuccess: boolean;
  countMax: number;
  countItems?: number;
  countProps?: TextProps;
  flexProps?: FlexProps;
  children?: any;
}

export const CollapsableHeaderWithCount: React.FC<Props> = ({
  isSuccess,
  countItems,
  countMax,
  countProps,
  flexProps,
  children,
}) => {
  return (
    <Flex {...flexProps}>
      <Text bold mr={1}>
        {children}
      </Text>
      {isSuccess ? (
        <Text color="interactive-01" bold {...countProps}>
          ({countItems && (countItems >= countMax ? `${countMax}+` : countItems)})
        </Text>
      ) : (
        <Skeleton width="22px" height="24px" />
      )}
    </Flex>
  );
};
