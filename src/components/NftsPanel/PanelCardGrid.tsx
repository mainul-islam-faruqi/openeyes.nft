import { Flex } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import LazyLoad from "react-lazyload";
import uniqueId from "lodash/uniqueId";
import { SectionPlaceholder, Text } from "uikit";
import { TOKENS_PER_PAGE } from "config/constants";
import { NFTCard } from "types/graphql";
import CardGrid from "components/Layout/CardGrid";
import { NftCard } from "components/NftCard/NftCard";
import { NftCardLoadingSkeleton } from "components/NftCard/NftCardLoadingSkeleton"
import { useFilterLayout } from "components/Layout/FilterLayout/hooks";
import { MultiselectNftCard } from "components/Multiselect/MultiselectNftCard";

interface CollectionPanelNftsProps {
  nfts?: NFTCard[];
  isSuccess?: boolean;
  hasNextPage?: boolean;
  showLoader?: boolean;
  isAccountPage?: boolean;
  isMultiselectCollapsed?: boolean;
  isMultiselectGrid?: boolean;
  showCollectionName?: boolean;
  enableSingleRarityFetch?: boolean;
}

const PanelCardGrid = ({
  nfts,
  isSuccess,
  isAccountPage,
  hasNextPage,
  isMultiselectCollapsed = true,
  isMultiselectGrid = false,
  showLoader,
  showCollectionName = true,
  enableSingleRarityFetch = false,
}: CollectionPanelNftsProps) => {
  const { t } = useTranslation();
  const { isCollapsed: isFilterCollapsed } = useFilterLayout();

  return (
    <>
      <CardGrid isFilterCollapsed={isFilterCollapsed} isMultiselectCollapsed={isMultiselectCollapsed}>
        {isSuccess &&
          nfts?.map((nft) => {
            const key = nft.collection.address + nft.tokenId;
            return (
              <LazyLoad offset={800} key={key} placeholder={<NftCardLoadingSkeleton />} style={{ width: "100%" }}>
                {isMultiselectGrid ? (
                  <MultiselectNftCard
                    key={key}
                    nft={nft}
                    enableSingleRarityFetch={enableSingleRarityFetch}
                    showCollectionName={showCollectionName}
                    isAccountPage={isAccountPage}
                  />
                ) : (
                  <NftCard
                    key={key}
                    nft={nft}
                    enableSingleRarityFetch={enableSingleRarityFetch}
                    showCollectionName={showCollectionName}
                    isAccountPage={isAccountPage}
                  />
                )}
              </LazyLoad>
            );
          })}
        {showLoader && (
          <>
            {[...Array(TOKENS_PER_PAGE)].map(() => (
              <LazyLoad key={uniqueId()} placeholder={<NftCardLoadingSkeleton />} style={{ width: "100%" }}>
                <NftCardLoadingSkeleton />
              </LazyLoad>
            ))}
          </>
        )}
      </CardGrid>
      {isSuccess && nfts?.length === 0 && (
        <SectionPlaceholder py={8}>
          <Text bold>{t("No NFTs found")}</Text>
        </SectionPlaceholder>
      )}
      {!hasNextPage && nfts && nfts.length > TOKENS_PER_PAGE && (
        <Flex alignItems="center" justifyContent="center" pt={8}>
          <Text color="text-02">{t("No more NFTs to fetch")}</Text>
        </Flex>
      )}
    </>
  );
};

export default PanelCardGrid;
