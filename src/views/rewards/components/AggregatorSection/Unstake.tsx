import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { Box, useDisclosure } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { Text } from "uikit";
import { formatToSignificant, toDecimals } from "utils/format";
import { getErrorMessage } from "utils/errors";
import { withdraw, withdrawAll } from "utils/calls/aggregatorUniswapV3";
import { useToast } from "hooks/useToast";
import { BASE_TOKEN_BALANCE_KEY } from "hooks/useTokenBalance";
import { useSubmitTransaction } from "hooks/useSubmitTransaction";
import { BASE_REWARDS_SUBGRAPH_KEY } from "hooks/subgraphs/useLooksStaking";
import {
  BASE_AGGREGATOR_KEY,
  useAggregatorUniswapV3UserInfo,
  useCalculateAggregatorSharePriceInLOOKS,
  useCalculateAggregatorUserSharesValueInLOOKS,
} from "hooks/calls/useAggregatorUniswapV3";
import { getSharesFromLooks } from "views/rewards/utils/getSharesFromLooks";
import { useUnstakeInputError } from "views/rewards/hooks/inputErrors";
import { ConfirmInWalletModal } from "components/Modals/ConfirmInWalletModal";
import { StakeInput } from "../StakeInput";

// When the remaining LOOKS (or LOOKS LP) after a withdrawal is below this threshold, consider it a 'withdraw all' request
const UNSTAKE_MAX_THRESHOLD = "0.001";
const UNSTAKE_MAX_THRESHOLD_WEI = toDecimals(UNSTAKE_MAX_THRESHOLD);

export const Unstake = () => {
  const { account, library } = useWeb3React();
  const { t } = useTranslation();
  const toast = useToast();
  const client = useQueryClient();
  const { isOpen: isConfirmModalOpen, onOpen: onOpenConfirmModal, onClose: onCloseConfirmModal } = useDisclosure();
  const [inputValue, setInputValue] = useState("");

  const { data: userInfo } = useAggregatorUniswapV3UserInfo(account ?? "", { enabled: !!account });
  const { data: sharePriceInLooks, refetch: refetchSharePrice } = useCalculateAggregatorSharePriceInLOOKS();

  const { data: userSharesInLOOKS } = useCalculateAggregatorUserSharesValueInLOOKS(account ?? "", {
    enabled: !!account,
  });

  const inputError = useUnstakeInputError({ inputValue, max: userSharesInLOOKS, min: UNSTAKE_MAX_THRESHOLD_WEI });

  const handleUnstake = useCallback(async () => {
    await refetchSharePrice();

    const inputAsWei = toDecimals(inputValue || "0");
    const inputAsWeiShares = getSharesFromLooks(sharePriceInLooks!, inputAsWei);
    const isUnstakingMax = userInfo && userInfo.shares.sub(inputAsWeiShares).lt(UNSTAKE_MAX_THRESHOLD_WEI);

    const transaction = isUnstakingMax
      ? await withdrawAll(library, account!)
      : await withdraw(library, account!, inputAsWeiShares);

    return transaction;
  }, [account, inputValue, library, refetchSharePrice, sharePriceInLooks, userInfo]);

  const onSuccess = useCallback(() => {
    toast({
      title: t("Unstaked!"),
      description: t("Your LOOKS is now in your wallet."),
      status: "success",
    });
    setInputValue("");
    onCloseConfirmModal();
    client.invalidateQueries(BASE_AGGREGATOR_KEY);
    client.invalidateQueries(BASE_TOKEN_BALANCE_KEY);
    client.invalidateQueries(BASE_REWARDS_SUBGRAPH_KEY);
  }, [client, onCloseConfirmModal, t, toast]);

  const onError = useCallback(
    (error: any) => {
      toast({ title: "Error", description: getErrorMessage(error), status: "error" });
    },
    [toast]
  );

  const { submitTransaction, isTxConfirmed, isTxSending, isTxWaiting, isTxError } = useSubmitTransaction({
    onSend: handleUnstake,
    onSuccess,
    onError,
  });

  const handleSubmit = () => {
    submitTransaction();
    onOpenConfirmModal();
  };

  return (
    <>
      <ConfirmInWalletModal
        isOpen={isConfirmModalOpen}
        onClose={onCloseConfirmModal}
        isTxConfirmed={isTxConfirmed}
        isTxSending={isTxSending}
        isTxWaiting={isTxWaiting}
        isTxError={isTxError}
      />
      <Box mb={8}>
        <StakeInput
          onSubmit={handleSubmit}
          onMaxValue={() => setInputValue(formatToSignificant(userSharesInLOOKS || "0", 18, { commify: false }))}
          onTextChange={(newValue) => setInputValue(newValue)}
          value={inputValue}
          disabled={!account || !sharePriceInLooks || userSharesInLOOKS?.isZero()}
          isInvalid={!!inputError}
          buttonText={t("Unstake")}
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
