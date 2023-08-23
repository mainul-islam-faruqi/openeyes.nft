// import { useBreakpointValue } from "@chakra-ui/react";
// import { COLLECTIONS_PAGINATION_FIRST } from "hooks/graphql/collections";
// import times from "lodash/times";
// import { CollectionBase } from "types/graphql";
// import { CollectionRow } from "./CollectionRow";
// import { MobileCollectionDisplay } from "./MobileCollectionDisplay";
// import { CollectionHeaderRow, CollectionRowSkeleton, MobileCollectionDisplaySkeleton } from "./shared";




import { useBreakpointValue } from "@chakra-ui/react";
import { COLLECTIONS_PAGINATION_FIRST } from "hooks/graphql/collections";
import times from "lodash/times";
import { CollectionBase } from "types/graphql";
import { CollectionRow } from "./CollectionRow";
import { MobileCollectionDisplay } from "./MobileCollectionDisplay";
import { CollectionHeaderRow, CollectionRowSkeleton, MobileCollectionDisplaySkeleton } from "./shared";




interface CollectionTableProps {
  collections: CollectionBase[];
  isLoading?: boolean;
  loadingRowCount?: number;
}

export const CollectionTable = ({
  collections,
  isLoading = false,
  loadingRowCount = COLLECTIONS_PAGINATION_FIRST,
}: CollectionTableProps) => {
  const showMobileVersion = useBreakpointValue({ base: true, md: false });

  if (showMobileVersion) {
    if (isLoading) {
      return (
        <>
          {times(loadingRowCount).map((n) => (
            <MobileCollectionDisplaySkeleton key={n} />
          ))}
        </>
      );
    }

    return (
      <>
        {collections.map((collection, index) => (
          <MobileCollectionDisplay key={collection.address} collection={collection} rank={index + 1} />
        ))}
      </>
    );
  }

  return (
    <>
      <CollectionHeaderRow />
      {isLoading ? (
        <>
          {times(loadingRowCount).map((n) => (
            <CollectionRowSkeleton key={n} />
          ))}
        </>
      ) : (
        <>
          {collections.map((collection, index) => (
            <CollectionRow key={collection.address} collection={collection} rank={index + 1} />
          ))}
        </>
      )}
    </>
  );
};
