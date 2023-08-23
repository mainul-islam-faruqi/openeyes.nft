import { BigNumber } from "ethers";
import { UseInfiniteQueryResult } from "react-query";
import { useTranslation } from "react-i18next";
import uniqueId from "lodash/uniqueId";
import { Flex } from "@chakra-ui/react";
import { Text, SectionPlaceholder, Button, ChevronDown } from "uikit";
import { STRATEGIES_ADDRESS, ORDERS_PER_PAGE } from "config";
import { isAddressEqual } from "utils/guards";
import { CollectionMakerOrderWithMeta, StandardMakerOrderWithMeta } from "utils/graphql/getMakerOrdersWithMeta";
import { BidRowWithMeta } from "components/OrderRows/BidRowWithMeta";
import { OrderRowLoadingSkeleton } from "components/OrderRows/OrderRowLoadingSkeleton";

interface Props {
  data: (CollectionMakerOrderWithMeta | StandardMakerOrderWithMeta)[] | undefined;
  query: UseInfiniteQueryResult<(CollectionMakerOrderWithMeta | StandardMakerOrderWithMeta)[]>;
  isStale?: boolean;
}

const BidRowsWithMetaContainer: React.FC<Props> = ({ data, query, isStale }) => {
  const { t } = useTranslation();

  return (
    <>
      {query.isSuccess &&
        (data && data.length > 0 ? (
          data.map((order) => {
            const { signer, startTime, endTime, collection, price, nonce, strategy, hash } = order;
            const isCollectionOrder = isAddressEqual(strategy, STRATEGIES_ADDRESS.collection);
            const isErc1155 = collection.type === "ERC1155";
            const key = signer + startTime + endTime;

            if (isCollectionOrder) {
              return (
                <BidRowWithMeta
                  key={key}
                  signer={signer}
                  startTime={startTime}
                  endTime={endTime}
                  price={price}
                  nonce={nonce}
                  strategy={strategy}
                  collection={collection}
                  imageSrc={collection.logo?.src}
                  name={collection.name}
                  isStale={isStale}
                  hash={hash}
                />
              );
            }
            const standardOrder = order as StandardMakerOrderWithMeta;
            const erc721Owner = !isErc1155
              ? standardOrder.token.owners.find((owner) => BigNumber.from(owner.balance).gt(0))
              : undefined;

            return (
              <BidRowWithMeta
                key={key}
                signer={signer}
                startTime={startTime}
                endTime={endTime}
                price={price}
                nonce={nonce}
                strategy={strategy}
                collection={collection}
                erc721Owner={erc721Owner}
                token={standardOrder.token}
                imageSrc={standardOrder.token.image.src}
                name={standardOrder.token.name}
                isStale={isStale}
                hash={hash}
              />
            );
          })
        ) : (
          <SectionPlaceholder p={4}>
            <Text bold>{t("No offers found")}</Text>
          </SectionPlaceholder>
        ))}
      {query.isFetching && (
        <>
          {[...Array(ORDERS_PER_PAGE)].map(() => (
            <OrderRowLoadingSkeleton key={uniqueId()} />
          ))}
        </>
      )}
      {query.hasNextPage && (
        <Flex justifyContent="center" py={2}>
          <Button
            variant="ghost"
            isLoading={query.isFetching}
            disabled={query.isLoading}
            onClick={() => query.fetchNextPage()}
          >
            {t("Load More")} <ChevronDown boxSize={5} ml={0.5} />
          </Button>
        </Flex>
      )}
    </>
  );
};

export default BidRowsWithMetaContainer;
