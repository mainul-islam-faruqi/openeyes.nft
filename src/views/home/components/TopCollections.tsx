import { useTranslation } from "react-i18next";
import Link from "next/link";
import { Flex } from "@chakra-ui/react";
import { Text, Button } from "uikit";
import { CollectionBase } from "types/graphql";
import { CollectionTable } from "components/CollectionsTable/CollectionTable";
import { COLLECTIONS_TO_FETCH_FOR_HOME } from "config/constants";

interface Props {
  topCollections?: CollectionBase[];
}

const TopCollections: React.FC<Props> = ({ topCollections }) => {
  const { t } = useTranslation();
  return (
    <>
      <Text textAlign="center" pb={16} bold textStyle="display-03">
        {t("Top Collections Today")}
      </Text>
      <CollectionTable
        collections={topCollections ?? []}
        isLoading={!topCollections}
        loadingRowCount={COLLECTIONS_TO_FETCH_FOR_HOME}
      />
      <Flex justifyContent="center" mt={12}>
        <Link href="/collections" passHref>
          <Button id="top-collections-see-all-collections" mr={2}>
            {t("See all collections")}
          </Button>
        </Link>
        <Link href="/explore" passHref>
          <Button id="top-collections-explore-nfts" as="a" variant="outline" colorScheme="gray">
            {t("Explore NFTs")}
          </Button>
        </Link>
      </Flex>
    </>
  );
};

export default TopCollections;
