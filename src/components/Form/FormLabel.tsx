import { Flex } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { Text, TextProps } from "uikit/Text/Text";

export interface FormLabelProps extends TextProps {
  isRequired?: boolean;
}

export const FormLabel: React.FC<FormLabelProps> = ({ isRequired = false, children, ...props }) => {
  const { t } = useTranslation();

  return (
    <Text bold mb={4} {...props}>
      <Flex alignItems="center">
        {children}{" "}
        {isRequired && (
          <Text color="text-error" bold ml={1}>
            {`(${t("Required")})`}
          </Text>
        )}
      </Flex>
    </Text>
  );
};
