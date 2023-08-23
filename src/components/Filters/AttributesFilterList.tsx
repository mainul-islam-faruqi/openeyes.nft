// import { Fragment } from "react";
// import { Divider, Flex, Spinner, Stack } from "@chakra-ui/react";
// import uniqBy from "lodash/uniqBy";
// import { useCollectionAttributes } from "hooks/graphql/collection";
// import { AttributesFilter, useTokenFilter } from ".";





import { Fragment } from "react";
import { Divider, Flex, Spinner, Stack } from "@chakra-ui/react";
import uniqBy from "lodash/uniqBy";
import { useCollectionAttributes } from "hooks/graphql/collection";
import { AttributesFilter } from "./AttributesFilter";
import { useTokenFilter } from "./hooks/useTokenFilter";





interface Props {
  collectionAddress: string;
  collectionTotalSupply?: number;
  isMobileLayout?: boolean;
}

export const AttributesFilterList = ({ collectionAddress, collectionTotalSupply, isMobileLayout }: Props) => {
  const { clearAllOfTraitType, removeAttributeFilter, addAttributeFilter, filter } = useTokenFilter();
  const collectionAttributesQuery = useCollectionAttributes(collectionAddress, {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const uniqueByTraitType = collectionAttributesQuery.isSuccess && uniqBy(collectionAttributesQuery.data, "traitType");

  return (
    <Stack spacing={0} divider={<Divider />}>
      {collectionAttributesQuery.isSuccess && uniqueByTraitType ? (
        uniqueByTraitType.map((attribute) => {
          const { traitType } = attribute;
          const attributesOfType = collectionAttributesQuery.data.filter((attr) => attr.traitType === traitType);
          const uniqueAttributes = uniqBy(attributesOfType, "value");
          const isAttributeOpen = filter.attributes
            ? filter.attributes.some((filterAttribute) => filterAttribute.traitType === traitType)
            : false;

          return (
            <Fragment key={attribute.traitType + attribute.value}>
              {attributesOfType && (
                <AttributesFilter
                  selectedAttributes={filter.attributes}
                  addAttributeFilter={addAttributeFilter}
                  removeAttributeFilter={removeAttributeFilter}
                  clearAllOfTraitType={clearAllOfTraitType}
                  traitType={traitType}
                  attributes={uniqueAttributes}
                  totalSupply={collectionTotalSupply}
                  isMobileLayout={isMobileLayout}
                  defaultIsOpen={isAttributeOpen}
                />
              )}
            </Fragment>
          );
        })
      ) : (
        <Flex py={8} alignItems="center" justifyContent="center">
          <Spinner />
        </Flex>
      )}
    </Stack>
  );
};
