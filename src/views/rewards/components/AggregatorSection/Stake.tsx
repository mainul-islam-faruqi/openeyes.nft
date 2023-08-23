import { useTranslation } from "next-i18next";
import { useCallback, useState } from "react";
import { useQueryClient } from "react-query";
import { useDisclosure, Box } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { Text } from "uikit";
import { fromDecimals } from "utils/format";
import { useToast } from "hooks/useToast";
import { BASE_TOKEN_BALANCE_KEY, useLooksBalance } from "hooks/useTokenBalance";
import { BASE_REWARDS_SUBGRAPH_KEY } from "hooks/subgraphs/useLooksStaking";
import { BASE_AGGREGATOR_KEY, useViewIsDepositPaused } from "hooks/calls/useAggregatorUniswapV3";
import { useStakeInputError } from "views/rewards/hooks/inputErrors";
import StakeLooksAggregatorModal from "components/Modals/Staking/StakeLooksAggregatorModal";
import { StakeInput } from "../StakeInput";

export const Stake = () => {
  const { account } = useWeb3React();
  const { t } = useTranslation();
  const toast = useToast();
  const client = useQueryClient();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [inputValue, setInputValue] = useState("");

  const { data: looksBalance } = useLooksBalance(account ?? "", { enabled: !!account });
  const isDepositPausedQuery = useViewIsDepositPaused({ enabled: !!account });
  const inputError = useStakeInputError({ inputValue, max: looksBalance });

  const maxLooksBalance = fromDecimals(looksBalance || "0");

  const handleStakingSuccess = useCallback(() => {
    onClose();
    setInputValue("");
    toast({
      title: t("Staked!"),
      description: t("Your LOOKS has been successfully staked."),
      status: "success",
    });
    client.invalidateQueries(BASE_TOKEN_BALANCE_KEY);
    client.invalidateQueries(BASE_AGGREGATOR_KEY);
    client.invalidateQueries(BASE_REWARDS_SUBGRAPH_KEY);
  }, [onClose, toast, client, t]);

  return (
    <>
      <StakeLooksAggregatorModal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={handleStakingSuccess}
        stakingAmount={inputValue}
      />
      <Box mb={8}>
        <StakeInput
          onMaxValue={() => setInputValue(maxLooksBalance)}
          onSubmit={onOpen}
          onTextChange={(newValue) => setInputValue(newValue)}
          value={inputValue}
          isInvalid={!!inputError}
          disabled={isDepositPausedQuery.isLoading || isDepositPausedQuery.data || !account || looksBalance?.isZero()}
        />
        {inputError && (
          <Text bold color="text-error" textStyle="detail" mt={2}>
            {inputError.message}
          </Text>
        )}
      </Box>
    </>
  );
};
