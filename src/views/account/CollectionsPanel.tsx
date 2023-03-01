import React from "react";
import { Box, Button, Flex, Skeleton } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import flatten from "lodash/flatten";
import times from "lodash/times";
import { ExternalLink, ManifoldCircleIcon, SectionPlaceholder, Text } from "uikit";
import { useInfiniteCollections } from "hooks/graphql/collections";
import { Container } from "components/Layout/Container";
import { CollectionCard } from "components/CollectionCard";
import { useAddressFromQuery } from "./hooks/useAddressFromQuery";

const CollectionsLoading = () => (
  <>
    {times(3).map((n) => (
      <Skeleton key={n} mb={16} height="171px" />
    ))}
  </>
);

const ManifoldButton = () => {
  const { t } = useTranslation();
  return (
    <Button
      width="fit-content"
      as={ExternalLink}
      id="collections-panel-manifold-button"
      href="https://studio.manifold.xyz/"
    >
      <ManifoldCircleIcon boxSize={5} mr={1} /> {t("Create a Collection")}
    </Button>
  );
};

export const CollectionsPanel = () => {
  const { t } = useTranslation();
  const address = useAddressFromQuery();
  const collectionsQuery = useInfiniteCollections({ owner: address });
  const allCollections = flatten(collectionsQuery.isSuccess ? collectionsQuery.data.pages : []);

  return (
    <Box>
      <Container py={6}>
        <Box>
          {collectionsQuery.isLoading && <CollectionsLoading />}
          {collectionsQuery.isSuccess && allCollections.length > 0 && (
            <>
              <Flex justifyContent="space-between" flexDir={{ base: "column", sm: "row" }} mb={12}>
                <Text textStyle="display-03" mb={{ base: 4, sm: 0 }} bold>
                  {t("Collections")}
                </Text>
                <ManifoldButton />
              </Flex>
              {allCollections.map((collection, index) => (
                <CollectionCard
                  key={collection.address}
                  collection={collection}
                  mb={16}
                  royaltiesDefaultIsOpen={index === 0}
                />
              ))}
            </>
          )}
          {collectionsQuery.isSuccess && allCollections.length === 0 && (
            <Flex flexDir="column" alignItems="center">
              <SectionPlaceholder />
              <Text color="text-02" mb={4}>
                {t("No Collections found")}
              </Text>
              <ManifoldButton />
            </Flex>
          )}
        </Box>
      </Container>
    </Box>
  );
};
