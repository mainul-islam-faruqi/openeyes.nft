import { Box } from "@chakra-ui/react";
import { LOCAL_STORAGE_SNOOZE_ACTION_REQUIRED_ORDERS } from "config/localStorage";
import { useStaleOrders } from "hooks/graphql/orders";
import useLocalStorageSnooze from "hooks/useLocalStorageSnooze";
import { ActionRequiredAlert, ActionRequiredAlertNarrow } from "./StaleOrderAlerts";

interface Props {
  account: string;
  isNarrow?: boolean;
  forceVisible?: boolean;
}

const StaleOrdersActionBar: React.FC<Props> = ({ account, isNarrow, forceVisible }) => {
  const staleOrdersQuery = useStaleOrders({ filter: { signer: account } });
  const { isSnoozed, handleSnooze } = useLocalStorageSnooze({
    baseKey: LOCAL_STORAGE_SNOOZE_ACTION_REQUIRED_ORDERS,
    useAccountInKey: true,
  });

  const requiresAction =
    staleOrdersQuery.isSuccess &&
    (forceVisible || !isSnoozed) &&
    (staleOrdersQuery.data.hasApprovalIssue ||
      staleOrdersQuery.data.hasBalanceIssue ||
      staleOrdersQuery.data.hasOwnerIssue ||
      staleOrdersQuery.data.hasCollectionApprovalIssue);

  const getHeight = () => {
    if (staleOrdersQuery.isLoading) {
      return 0;
    }

    if (requiresAction) {
      return isNarrow ? "48px" : { base: "48px", sm: "72px" };
    }

    return 0;
  };

  return (
    <Box height={getHeight()} overflow="hidden" transition="height 400ms">
      {requiresAction &&
        (isNarrow ? <ActionRequiredAlertNarrow /> : <ActionRequiredAlert handleDismiss={handleSnooze} />)}
    </Box>
  );
};

export default StaleOrdersActionBar;
