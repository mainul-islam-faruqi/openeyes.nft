import { Box, Flex } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { ModalBody, Button } from "uikit";
import SearchInput from "./SearchInput";
import SearchResults from "./SearchResults";
// import AlgoliaSearchClient from "components/AlgoliaSearchClient";
import AlgoliaSearchClient from "../../AlgoliaSearchClient";


type Props = {
  onClose: () => void;
};

const InstantSearch = ({ onClose }: Props) => {
  const { t } = useTranslation();
  return (
    // @ts-ignore
    <AlgoliaSearchClient>
      <Flex bg={{ base: "ui-bg", md: "transparent" }} pl={4} py={{ base: 3 }}>
        <Flex flex="1">
          <SearchInput />
          <Box>
            {/* @TODO - apply deliberate color scheme. our button config is overriding the real default with "green", bypass
            that to use the same chakra default we've been using */}
            <Button colorScheme="default" variant="ghost" onClick={onClose}>
              {t("Cancel")}
            </Button>
          </Box>
        </Flex>
      </Flex>
      <ModalBody px={0} pt={{ base: 6, md: 1 }} pb={{ base: 2, md: 0 }}>
        <SearchResults onClose={onClose} />
      </ModalBody>
    </AlgoliaSearchClient>
  );
};

export default InstantSearch;
