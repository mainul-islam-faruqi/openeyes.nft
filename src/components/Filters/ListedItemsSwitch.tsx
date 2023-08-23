// import { Box, Flex } from "@chakra-ui/layout";
// import { FormLabel } from "@chakra-ui/form-control";
// import { useTranslation } from "react-i18next";
// import { Text, Switch } from "uikit";




import { Box, Flex } from "@chakra-ui/layout";
import { FormLabel } from "@chakra-ui/form-control";
import { useTranslation } from "react-i18next";
import {Text} from "uikit/Text/Text";
import Switch from "uikit/Switch/Switch"






interface ListedItemsSwitchProps {
  isChecked?: boolean;
  handleOnChange: (arg0: boolean) => void;
}

const ListedItemsSwitch: React.FC<ListedItemsSwitchProps> = ({ isChecked, handleOnChange }) => {
  const { t } = useTranslation();

  return (
    <Flex justifyContent="space-between" alignItems="center">
      <FormLabel htmlFor="show-listed" mb={0}>
        <Text textStyle="detail" bold whiteSpace="nowrap">
          {t("Buy Now")}
        </Text>
      </FormLabel>
      <Box width="fit-content" height="fit-content">
        <Switch
          isChecked={isChecked}
          id="show-listed"
          onChange={(evt) => handleOnChange(evt.target.checked)}
          size="md"
        />
      </Box>
    </Flex>
  );
};

export default ListedItemsSwitch;
