import NextLink from "next/link";
import { Stack, useBreakpointValue } from "@chakra-ui/react";
import { gql } from "graphql-request";
import { useQuery } from "react-query";
import { useTranslation } from "react-i18next";
import { Button, Link } from "uikit";
import { OrderStatus, OrderFilter } from "types/graphql";
import { graphql } from "utils/graphql";
import { CancelAllOrdersButton } from "components/Buttons";

interface Props {
  address: string;
}

export const useGetCancellableOrder = (address: string) => {
  const query = gql`
    query GetUserCancellableOrder($filter: OrderFilterInput) {
      orders(filter: $filter, pagination: { first: 1 }) {
        hash
      }
    }
  `;
  const filter: OrderFilter = { signer: address, status: [OrderStatus.VALID] };

  return useQuery<{ orders: { hash: string }[] }>(["cancellable-order", address], () =>
    graphql(query, {
      filter,
    })
  );
};

const UserBar: React.FC<Props> = ({ address }) => {
  const { t } = useTranslation();
  const cancellableOrderQuery = useGetCancellableOrder(address);
  const isButtonfullWidth = useBreakpointValue({ base: true, sm: false });

  return (
    <Stack direction={{ base: "column", sm: "row" }} spacing={2} width="100%">
      <NextLink href="/accounts/import" passHref>
        <Button variant="outline" size="sm" as={Link} isFullWidth={isButtonfullWidth}>
          {t("Import Listings")}
        </Button>
      </NextLink>
      {cancellableOrderQuery.isSuccess && cancellableOrderQuery.data.orders.length > 0 && (
        <CancelAllOrdersButton variant="outline" colorScheme="secondary" isFullWidth={isButtonfullWidth} />
      )}
    </Stack>
  );
};

export default UserBar;
