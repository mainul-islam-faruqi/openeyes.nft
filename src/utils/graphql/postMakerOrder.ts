
// @ts-nocheck
import { providers, BigNumber } from "ethers";
import { signMakerOrder } from "@looksrare/sdk";
import addTime from "date-fns/add";
import { minNetPriceRatio } from "config/constants";
import { addresses } from "config/addresses";
import { MakerOrder, MakerOrderWithSignature, SolidityType } from "types/orders";
import { getAuthCookie } from "utils/cookies";
import { gql } from "graphql-request";
import { getUserNonce } from "utils/graphql/user";
import { graphql } from "./graphql";
import { OrderFragment, orderFragment } from "./fragments";

/**
 * Create a maker order and returns it (no api call)
 * @param signer Etherjs signer
 * @param signerAddress Address that signed the message
 * @param chainId Current chaind id
 * @param isOrderAsk Is it an ask or bid order
 * @param collectionAddress Collection address
 * @param strategyAddress Address of the strategy used
 * @param amount Number of tokens to buy
 * @param price Price in wei
 * @param protocolFees Protocol fees
 * @param creatorFees Collection fees
 * @param currency Currency address
 * @param optionalParams Optional parameters
 * @param optionalParams.tokenId Token id (default to 0 for collection orders)
 * @param optionalParams.startTime Sale start time (default to now)
 * @param optionalParams.endTime Sale end time (default to now + 6 months)
 * @param optionalParams.params Some random shit nobody understand. Do you understand ? I don't. If you do, update this comment.
 * @returns MakerOrderWithSignature The maker order
 */
const prepareMakerOrder = async (
  signer: providers.JsonRpcSigner,
  signerAddress: string,
  chainId: number,
  isOrderAsk: boolean,
  collectionAddress: string,
  strategyAddress: string,
  amount: BigNumber,
  price: BigNumber,
  nonce: BigNumber,
  protocolFees: BigNumber,
  creatorFees: BigNumber,
  currency: string,
  optionalParams: PostMakerOrderOptionalParams = {}
) => {
  const now = Date.now();
  const { tokenId, params, startTime, endTime } = optionalParams;
  const paramsValue = params ? params.values : [];
  const paramsTypes = params ? params.types : [];
  const netPriceRatio = BigNumber.from(10000).sub(protocolFees.add(creatorFees)).toNumber();

  const makerOrder: MakerOrder = {
    isOrderAsk,
    signer: signerAddress,
    collection: collectionAddress,
    price: price.toString(),
    tokenId: tokenId?.toString() || "0",
    amount: amount.toString(),
    strategy: strategyAddress,
    currency,
    nonce: nonce.toNumber(),
    startTime: startTime ? Math.floor(startTime / 1000) : Math.floor(now / 1000),
    endTime: endTime ? Math.floor(endTime / 1000) : Math.floor(addTime(now, { months: 1 }).getTime() / 1000),
    minPercentageToAsk: Math.min(netPriceRatio, minNetPriceRatio),
    params: paramsValue,
  };
  const signatureHash = await signMakerOrder(signer, chainId, addresses.EXCHANGE, makerOrder, paramsTypes);

  const data: MakerOrderWithSignature = {
    ...makerOrder,
    signature: signatureHash,
  };

  return data;
};

export interface PostMakerOrderOptionalParams {
  tokenId?: string;
  startTime?: number;
  endTime?: number;
  params?: { values: any[]; types: SolidityType[] };
}

/**
 *
 * @param library Etherjs provider
 * @param chainId Current chaind id
 * @param isOrderAsk Is it an ask or bid order
 * @param collectionAddress Collection address
 * @param strategyAddress Address of the strategy used
 * @param amount Number of tokens to buy
 * @param price Price in wei
 * @param protocolFees Protocol fees
 * @param creatorFees Collection fees
 * @param currency Currency address
 * @param optionalParams Optional parameters
 * @param optionalParams.tokenId Token id (default to 0 for collection orders)
 * @param optionalParams.startTime Sale start time (default to now)
 * @param optionalParams.endTime Sale end time (default to now + 6 months)
 * @param optionalParams.params Some random shit nobody understand. Do you understand ? I don't. If you do, update this comment.
 */
export const postMakerOrder = async (
  library: providers.Web3Provider,
  chainId: number,
  isOrderAsk: boolean,
  collectionAddress: string,
  strategyAddress: string,
  amount: BigNumber,
  price: BigNumber,
  protocolFees: BigNumber,
  creatorFees: BigNumber,
  currency: string,
  optionalParams: PostMakerOrderOptionalParams = {}
): Promise<OrderFragment> => {
  const signer = library.getSigner();
  const signerAddress = await signer.getAddress();
  const nonce = await getUserNonce(signerAddress);

  const data = await prepareMakerOrder(
    signer,
    signerAddress,
    chainId,
    isOrderAsk,
    collectionAddress,
    strategyAddress,
    amount,
    price,
    nonce,
    protocolFees,
    creatorFees,
    currency,
    optionalParams
  );

  const requestHeaders = {
    Authorization: `Bearer ${getAuthCookie(signerAddress)}`,
  };

  const query = gql`
    mutation CreateOrderMutation($data: OrderCreateInput!) {
      createOrder(data: $data) {
        ...OrderFragment
      }
    }
    ${orderFragment}
  `;

  const order: { createOrder: OrderFragment } = await graphql(query, { data }, requestHeaders);
  return order.createOrder;
};

/**
 * Update a maker order
 * @param library Etherjs provider
 * @see prepareMakerOrder for other params
 */
export const updateMakerOrder = async (
  library: providers.Web3Provider,
  chainId: number,
  isOrderAsk: boolean,
  collectionAddress: string,
  strategyAddress: string,
  amount: BigNumber,
  price: BigNumber,
  nonce: BigNumber,
  protocolFees: BigNumber,
  creatorFees: BigNumber,
  currency: string,
  optionalParams: PostMakerOrderOptionalParams = {}
): Promise<OrderFragment> => {
  const signer = library.getSigner();
  const signerAddress = await signer.getAddress();

  const data = await prepareMakerOrder(
    signer,
    signerAddress,
    chainId,
    isOrderAsk,
    collectionAddress,
    strategyAddress,
    amount,
    price,
    nonce,
    protocolFees,
    creatorFees,
    currency,
    optionalParams
  );

  const requestHeaders = {
    Authorization: `Bearer ${getAuthCookie(signerAddress)}`,
  };

  const query = gql`
    mutation CreateOrderMutation($data: OrderCreateInput!) {
      createOrder(data: $data) {
        ...OrderFragment
      }
    }
    ${orderFragment}
  `;

  const order: { createOrder: OrderFragment } = await graphql(query, { data }, requestHeaders);

  return order.createOrder;
};
