import { useState, useEffect, useMemo, useCallback } from "react";
import { ethers } from "ethers";
import { useTranslation } from "react-i18next";
import { useWeb3React } from "@web3-react/core";
import { getStepStatus } from "uikit";
import { addresses } from "config";
import { getAllowance, approve } from "utils/calls/erc20";
import { toDecimals } from "utils/format";
import { deposit } from "utils/calls/aggregatorUniswapV3";
import { TransactionStep } from "../Orders/shared/TransactionStep";

enum View {
  APPROVAL,
  STAKE,
}

export interface Props {
  onConfirm: (txHash: string) => void;
  stakingAmount: string;
}

const StakeLooksAggregator: React.FC<Props> = ({ onConfirm, stakingAmount }) => {
  const { library, account } = useWeb3React();
  const { t } = useTranslation();
  const [stakingStep, setListingStep] = useState(View.APPROVAL);
  const [transaction, setTransaction] = useState<string>();

  const stakingAmountInWei = useMemo(
    () => (stakingAmount ? toDecimals(stakingAmount) : ethers.constants.Zero),
    [stakingAmount]
  );

  // Reset steps on account change
  useEffect(() => {
    setListingStep(View.APPROVAL);
  }, [account]);

  const handleApprove = useCallback(async () => {
    if (account) {
      const allowance = await getAllowance(library, addresses.LOOKS, account, addresses.AGGREGATOR_UNISWAP_V3);
      if (allowance.gte(stakingAmountInWei)) {
        setListingStep(View.STAKE);
      } else {
        const response = await approve(library, addresses.LOOKS, account, addresses.AGGREGATOR_UNISWAP_V3);
        setTransaction(response.hash);
        const receipt = await response.wait();
        if (receipt.status) {
          setTransaction(undefined);
          setListingStep(View.STAKE);
        } else {
          throw new Error(`${receipt.transactionHash} failed`);
        }
      }
    }
  }, [account, library, stakingAmountInWei]);

  const handleStake = useCallback(async () => {
    if (account) {
      const response = await deposit(library, account, stakingAmountInWei);
      setTransaction(response.hash);
      const receipt = await response.wait();
      if (receipt.status) {
        onConfirm(receipt.transactionHash);
      } else {
        throw new Error(`${receipt.transactionHash} failed`);
      }
    }
  }, [account, library, stakingAmountInWei, onConfirm]);

  return (
    <>
      <TransactionStep
        onSendRequest={handleApprove}
        title={t("Enable LOOKS staking")}
        message={t("Confirm the transaction in your wallet. This lets you stake your LOOKS in the smart contract.")}
        status={getStepStatus(View.APPROVAL, stakingStep)}
        collapse={stakingStep !== View.APPROVAL}
        transaction={transaction}
        mb={6}
      />
      <TransactionStep
        onSendRequest={handleStake}
        title={t("Confirm Stake")}
        message={t("Confirm the transaction in your wallet.")}
        status={getStepStatus(View.STAKE, stakingStep)}
        collapse={stakingStep !== View.STAKE}
        transaction={transaction}
      />
    </>
  );
};

export default StakeLooksAggregator;
