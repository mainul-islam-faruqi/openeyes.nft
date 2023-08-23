import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { useDisclosure, Box } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { Text } from "uikit";
import { fromDecimals } from "utils/format";
import { useToast } from "hooks/useToast";
import { BASE_TOKEN_BALANCE_KEY, useLooksBalance } from "hooks/useTokenBalance";
import { BASE_FEE_SHARING_KEY } from "hooks/calls/useFeeSharingSystem";
import { BASE_REWARDS_SUBGRAPH_KEY } from "hooks/subgraphs/useLooksStaking";
import { useStakeInputError } from "views/rewards/hooks/inputErrors";
import StakeLooksModal from "components/Modals/Staking/StakeLooksModal";
import { StakeInput } from "../StakeInput";
interface Props {
  shouldClaimRewardToken: boolean;
}

export const Stake = ({ shouldClaimRewardToken }: Props) => {
  const { account } = useWeb3React();
  const { t } = useTranslation();
  const toast = useToast();
  const client = useQueryClient();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [inputValue, setInputValue] = useState("");

  const { data: looksBalance } = useLooksBalance(account ?? "", { enabled: !!account });
  const inputError = useStakeInputError({ inputValue, max: looksBalance });

  const maxLooksBalance = fromDecimals(looksBalance || "0");

  const handleStakingSuccess = useCallback(() => {
    client.invalidateQueries(BASE_TOKEN_BALANCE_KEY);
    client.invalidateQueries(BASE_FEE_SHARING_KEY);
    client.invalidateQueries([BASE_REWARDS_SUBGRAPH_KEY]);
    onClose();
    setInputValue("");
    toast({
      title: t("Staked!"),
      description: t("Your LOOKS has been successfully staked."),
      status: "success",
    });
  }, [client, toast, onClose, t]);

  return (
    <>
      <StakeLooksModal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={handleStakingSuccess}
        shouldClaimRewardToken={shouldClaimRewardToken}
        stakingAmount={inputValue}
      />
      <Box mb={8}>
        <StakeInput
          onMaxValue={() => setInputValue(maxLooksBalance)}
          onSubmit={onOpen}
          onTextChange={(newValue) => setInputValue(newValue)}
          value={inputValue}
          isInvalid={!!inputError}
          disabled={!account || looksBalance?.isZero()}
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
