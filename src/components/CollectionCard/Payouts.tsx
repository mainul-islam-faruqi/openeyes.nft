// import { Box, Flex } from "@chakra-ui/react";
// import { flatten } from "lodash";
// import { useTranslation } from "next-i18next";
// import { Button, SectionLoader, SectionPlaceholder } from "uikit";
// import { useCollectionRoyalties } from "hooks/graphql/royalties";
// import { RoyaltyRow } from "./RoyaltyRow";



import { Box, Flex } from "@chakra-ui/react";
import { flatten } from "lodash";
import { useTranslation } from "next-i18next";
import { Button } from "uikit/Button/Button";
import { SectionLoader,  } from "uikit/Loader/SectionLoader";
import { SectionPlaceholder } from "uikit/Placeholder/SectionPlaceholder";
import { useCollectionRoyalties } from "hooks/graphql/royalties";
import { RoyaltyRow } from "./RoyaltyRow";



export interface PayoutsProps {
  collectionAddress: string;
}

export const Payouts = ({ collectionAddress }: PayoutsProps) => {
  const { t } = useTranslation();
  const royaltiesQuery = useCollectionRoyalties(collectionAddress);
  const allRoyalties = royaltiesQuery.isSuccess ? flatten(royaltiesQuery.data.pages) : [];

  const renderPayouts = () => {
    if (royaltiesQuery.isLoading) {
      return <SectionLoader py={8} />;
    }

    if (allRoyalties.length === 0) {
      return <SectionPlaceholder py={8}>{t("No royalties found")}</SectionPlaceholder>;
    }

    return (
      <>
        {allRoyalties.map((royalty) => (
          <RoyaltyRow key={royalty.id} royalty={royalty} />
        ))}
        {royaltiesQuery.hasNextPage && (
          <Flex justifyContent="center" py={2}>
            <Button
              isLoading={royaltiesQuery.isFetching}
              onClick={() => royaltiesQuery.fetchNextPage()}
              size="xs"
              variant="ghost"
              colorScheme="gray"
              color="link-01"
            >
              {t("Load More")}
            </Button>
          </Flex>
        )}
      </>
    );
  };

  return (
    <Box borderTop="1px solid" borderTopColor="border-01">
      {renderPayouts()}
    </Box>
  );
};
