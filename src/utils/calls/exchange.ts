// @ts-nocheck
import { providers, BigNumber, BytesLike, ethers } from "ethers";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import { MakerOrderWithSignature, TakerOrder } from "types/orders";
import { getExchangeContract } from "utils/contracts";
import { defaultAbiCoder, getAddress } from "ethers/lib/utils";
import { STRATEGIES_ADDRESS } from "config/addresses";
import { estimateGas } from "./helpers";

/**
 * Helper to encode params, with encoding argument based on order strategy
 * @param order MakerOrderWithSignature
 * @returns BytesLike
 */
const encodeParams = (order: MakerOrderWithSignature): BytesLike => {
  switch (getAddress(order.strategy)) {
    // Encode address params for private sale
    case getAddress(STRATEGIES_ADDRESS.private):
      return defaultAbiCoder.encode(["address"], order.params);
    default:
      return [];
  }
};

/**
 * Helper to generate an order with VRS and encoded params to be sent to the contract
 * @param order MakerOrderWithSignature
 * @returns MakerOrderWithVRS
 */
export const generateOrderForContract = (order: MakerOrderWithSignature): MakerOrderWithVRS => {
  const encodedParams = encodeParams(order);
  const vrs = ethers.utils.splitSignature(order.signature);
  return { ...order, ...vrs, params: encodedParams };
};

/**
 * Cancel all orders created by the sender (invalidating all their signatures)
 * @param library Etherjs provider
 * @param account User adddress (need to be an address connected to the app)
 * @param nonce User nonce (retrived from the api, different from ethereum nonce)
 * @returns TransactionResponse
 */
export const cancelAllOrdersForSender = async (
  library: providers.Web3Provider,
  account: string,
  nonce: BigNumber
): Promise<TransactionResponse> => {
  const exchangeContract = getExchangeContract(library, account);
  const gasLimit = await estimateGas(exchangeContract, "cancelAllOrdersForSender", [nonce]);
  return exchangeContract.cancelAllOrdersForSender(nonce, { gasLimit });
};

/**
 * Cancel a specific order created by the sender (invalidate the signature)
 * @param library Etherjs provider
 * @param account User adddress (need to be an address connected to the app)
 * @param orderNonces The list of order nonces to be cancelled
 * @returns TransactionResponse
 */
export const cancelMultipleMakerOrders = async (
  library: providers.Web3Provider,
  account: string,
  orderNonces: BigNumber[]
): Promise<TransactionResponse> => {
  const exchangeContract = getExchangeContract(library, account);
  const gasLimit = await estimateGas(exchangeContract, "cancelMultipleMakerOrders", [orderNonces]);
  return exchangeContract.cancelMultipleMakerOrders(orderNonces, { gasLimit });
};

/**
 * Match a maker ask with a taker bid, using ETH
 * @throws if isOrderAsk has an incorrect value
 * @param library Etherjs provider
 * @param account User adddress (need to be an address connected to the app)
 * @param takerBidOrder
 * @param makerAskOrder
 * @returns TransactionResponse
 */
export const matchAskWithTakerBidUsingETHAndWETH = async (
  library: providers.Web3Provider,
  account: string,
  takerBidOrder: TakerOrder,
  makerAskOrder: MakerOrderWithSignature,
  ethBalanceUsed: BigNumber
): Promise<TransactionResponse> => {
  if (takerBidOrder.isOrderAsk) {
    throw Error("Taker order mismatch");
  }
  if (!makerAskOrder.isOrderAsk) {
    throw Error("Maker order mismatch");
  }
  const exchangeContract = getExchangeContract(library, account);

  const order = generateOrderForContract(makerAskOrder);
  const gasLimit = await estimateGas(exchangeContract, "matchAskWithTakerBidUsingETHAndWETH", [takerBidOrder, order], {
    value: ethBalanceUsed,
  });
  return exchangeContract.matchAskWithTakerBidUsingETHAndWETH(takerBidOrder, order, {
    value: ethBalanceUsed,
    gasLimit,
  });
};

/**
 * Match a maker ask with a taker bid
 * @throws if isOrderAsk has an incorrect value
 * @param library Etherjs provider
 * @param account User adddress (need to be an address connected to the app)
 * @param takerBidOrder
 * @param makerAskOrder
 * @returns TransactionResponse
 */
export const matchAskWithTakerBid = async (
  library: providers.Web3Provider,
  account: string,
  takerBidOrder: TakerOrder,
  makerAskOrder: MakerOrderWithSignature
): Promise<TransactionResponse> => {
  if (takerBidOrder.isOrderAsk) {
    throw Error("Taker order mismatch");
  }
  if (!makerAskOrder.isOrderAsk) {
    throw Error("Maker order mismatch");
  }
  const exchangeContract = getExchangeContract(library, account);
  const order = generateOrderForContract(makerAskOrder);
  const gasLimit = await estimateGas(exchangeContract, "matchAskWithTakerBidUsingETHAndWETH", [takerBidOrder, order]);
  return exchangeContract.matchAskWithTakerBid(takerBidOrder, order, { gasLimit });
};

/**
 * Match a taker ask with a maker bid
 * @throws if isOrderAsk has an incorrect value
 * @param library Etherjs provider
 * @param account User adddress (need to be an address connected to the app)
 * @param takerAskOrder
 * @param makerBidOrder
 * @returns TransactionResponse
 */
export const matchBidWithTakerAsk = async (
  library: providers.Web3Provider,
  account: string,
  takerAskOrder: TakerOrder,
  makerBidOrder: MakerOrderWithSignature
): Promise<TransactionResponse> => {
  if (!takerAskOrder.isOrderAsk) {
    throw Error("Taker order mismatch");
  }
  if (makerBidOrder.isOrderAsk) {
    throw Error("Maker order mismatch");
  }
  const exchangeContract = getExchangeContract(library, account);
  const order = generateOrderForContract(makerBidOrder);
  const gasLimit = await estimateGas(exchangeContract, "matchBidWithTakerAsk", [takerAskOrder, order]);
  return exchangeContract.matchBidWithTakerAsk(takerAskOrder, order, { gasLimit });
};
