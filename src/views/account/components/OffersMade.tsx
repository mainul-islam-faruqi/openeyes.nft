import { useTranslation } from "react-i18next";
import flatten from "lodash/flatten";
import getUnixTime from "date-fns/getUnixTime";
import { useWeb3React } from "@web3-react/core";
import { Box } from "@chakra-ui/react";
import { Text, SectionPlaceholder } from "uikit";
import { ORDERS_PER_PAGE, STRATEGIES_ADDRESS } from "config";
import { getTokenOwnerFilter } from "utils/tokens";
import { OrderSort, OrderStatus } from "types/graphql";
import { useInfiniteMakerOrdersWithMeta } from "hooks/graphql/orders";
import { useEagerConnect } from "hooks/useEagerConnect";
import { Collapsable } from "components/Collapsable";
import BidRowsWithMetaContainer from "components/OrderRows/BidRowsWithMetaContainer";
import { CollapsableHeaderWithCount } from "components/Collapsable";

const now = getUnixTime(new Date());

const OffersMade: React.FC<{ address: string }> = ({ address }) => {
  const { t } = useTranslation();
  const { account } = useWeb3React();
  const hasTriedConnection = useEagerConnect();

  const standardBidsQuery = useInfiniteMakerOrdersWithMeta(
    {
      filter: {
        signer: address,
        isOrderAsk: false,
        endTime: now,
        strategy: STRATEGIES_ADDRESS.standard,
        status: [OrderStatus.VALID],
      },
      sort: OrderSort.NEWEST,
      ownerFilter: getTokenOwnerFilter({ connectedAccount: account, address }),
    },
    { enabled: hasTriedConnection }
  );

  const collectionBidsQuery = useInfiniteMakerOrdersWithMeta(
    {
      filter: {
        signer: address,
        isOrderAsk: false,
        endTime: now,
        strategy: STRATEGIES_ADDRESS.collection,
        status: [OrderStatus.VALID],
      },
      sort: OrderSort.NEWEST,
      ownerFilter: getTokenOwnerFilter({ connectedAccount: account, address }),
    },
    { enabled: hasTriedConnection }
  );

  const flattenedCollectionOrders = collectionBidsQuery.isSuccess ? flatten(collectionBidsQuery.data.pages) : [];
  const flattenedStandardOrders = standardBidsQuery.isSuccess ? flatten(standardBidsQuery.data.pages) : [];

  if (
    collectionBidsQuery.isSuccess &&
    standardBidsQuery.isSuccess &&
    flattenedCollectionOrders.length === 0 &&
    flattenedStandardOrders.length === 0
  ) {
    return (
      <SectionPlaceholder p={4}>
        <Text bold>{t("No offers made")}</Text>
      </SectionPlaceholder>
    );
  }

  return (
    <div>
      <Collapsable
        bg="transparent"
        defaultIsOpen
        header={
          <CollapsableHeaderWithCount
            isSuccess={collectionBidsQuery.isSuccess}
            countItems={flattenedCollectionOrders.length}
            countMax={ORDERS_PER_PAGE}
          >
            {t("Collection Offers")}
          </CollapsableHeaderWithCount>
        }
      >
        <BidRowsWithMetaContainer data={flattenedCollectionOrders} query={collectionBidsQuery} />
      </Collapsable>
      <Box height={8} />
      <Collapsable
        bg="transparent"
        defaultIsOpen
        header={
          <CollapsableHeaderWithCount
            isSuccess={standardBidsQuery.isSuccess}
            countItems={flattenedStandardOrders.length}
            countMax={ORDERS_PER_PAGE}
          >
            {t("Offers on Items")}
          </CollapsableHeaderWithCount>
        }
      >
        <BidRowsWithMetaContainer data={flattenedStandardOrders} query={standardBidsQuery} />
      </Collapsable>
    </div>
  );
};

export default OffersMade;
