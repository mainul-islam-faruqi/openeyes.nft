import { useCallback, useState } from "react";
import { TransactionResponse, TransactionReceipt } from "@ethersproject/abstract-provider";
import { noop } from "lodash";

export type SubmitTransactionHandler = () => Promise<TransactionResponse>;
export type SubmitTransactionCallbackHandler = (args?: any) => void;

interface State {
  isTxSending: boolean;
  isTxWaiting: boolean;
  isTxError: boolean;
  isTxConfirmed: boolean;
  txReceipt: TransactionReceipt | null;
  txResponse: TransactionResponse | null;
  txError?: any;
}

const initialState: State = {
  isTxSending: false,
  isTxWaiting: false,
  isTxError: false,
  isTxConfirmed: false,
  txReceipt: null,
  txResponse: null,
  txError: null,
};

interface SubmitTransaction {
  onSend: SubmitTransactionHandler;
  onSuccess?: SubmitTransactionCallbackHandler;
  onError?: SubmitTransactionCallbackHandler;
}

/**
 * Helper when submitting on-chain write transactions
 *
 * @param onSend A function returning the contract method
 * @returns
 */
export const useSubmitTransaction = ({ onSend, onSuccess = noop, onError = noop }: SubmitTransaction) => {
  const [state, setState] = useState<State>(initialState);

  const submitTransaction = useCallback(async () => {
    try {
      setState({ ...initialState, isTxSending: true });
      const txResponse = await onSend();

      setState((prevState) => ({
        ...prevState,
        isTxSending: false,
        isTxWaiting: true,
        txResponse,
      }));

      const txReceipt = await txResponse.wait();
      if (txReceipt.status) {
        setState({
          isTxSending: false,
          isTxConfirmed: true,
          isTxWaiting: false,
          isTxError: false,
          txError: null,
          txResponse,
          txReceipt,
        });
        onSuccess(txReceipt);
      } else {
        setState({
          isTxSending: false,
          isTxConfirmed: true,
          isTxWaiting: false,
          isTxError: true,
          txError: null,
          txResponse,
          txReceipt,
        });
      }
    } catch (error) {
      setState({
        isTxSending: false,
        isTxConfirmed: false,
        isTxWaiting: false,
        isTxError: true,
        txReceipt: null,
        txResponse: null,
        txError: error,
      });
      onError(error);
    }
  }, [onSend, onSuccess, onError]);

  return { ...state, submitTransaction };
};
