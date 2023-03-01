import { BigNumber, constants, FixedNumber } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { SupportedProviders, Web3ReactAccount } from "types";
import { TokenStandard } from "types/config";
import { TokenOwner, TokenOwnerFilter } from "types/graphql";
import { MakerOrderWithSignatureAndHash } from "types/orders";
import getOrders from "./graphql/getOrders";
import { calculateRoyaltyFeeAndGetRecipient } from "./calls/fees";
import { toDecimals } from "./format";
import { isAddressEqual } from "./guards";

/**
 * Get the number of tokens owned by an address given an account address and a list of owners
 */
export const getBalanceFromTokenOwners = (account: Web3ReactAccount, owners: TokenOwner[] = []) => {
  if (!account) {
    return 0;
  }

  const accountOwner = owners.find((owner) => isAddressEqual(account, owner.address));
  return accountOwner ? BigNumber.from(accountOwner.balance).toNumber() : 0;
};

interface GetTokenOwnerFilterArgs {
  connectedAccount?: string | null;
  address?: string | null;
  collectionType?: TokenStandard;
}

/**
 * Helper to construct a TokenOwnerFilter given two potentially undefined/null addresses and a collection type
 * @param connectedAccount address
 * @param address additional address param
 * @param collectionType
 * @returns TokenOwnerFilter
 */
export const getTokenOwnerFilter = ({
  connectedAccount,
  address,
  collectionType,
}: GetTokenOwnerFilterArgs): TokenOwnerFilter | undefined => {
  // Passing undefined to the TokenOwnerFilter returns all owners - desired behaviour for ERC721
  if (collectionType === "ERC721") {
    return;
  }

  if (!connectedAccount && address) {
    return { addresses: [address] };
  }

  const isEqual = isAddressEqual(connectedAccount, address);
  if ((connectedAccount && isEqual) || (!address && connectedAccount)) {
    return { addresses: [connectedAccount] };
  }

  if (connectedAccount && address) {
    return { addresses: [address, connectedAccount] };
  }

  // Return no owners
  return { addresses: [] };
};

/**
 * Returns owner balance as a number from token owners
 */
export const getOwnerBalance = (owners: TokenOwner[], account?: Web3ReactAccount): BigNumber => {
  if (!account) {
    return constants.Zero;
  }

  const ownerBalance = owners.find((owner) => isAddressEqual(owner.address, account));

  if (ownerBalance) {
    return BigNumber.from(ownerBalance.balance);
  }

  return constants.Zero;
};

/**
 * Returns all connected wallet asks
 */
export const getAccountAsks = (orders: MakerOrderWithSignatureAndHash[], account: Web3ReactAccount) => {
  return orders.filter((order) => isAddressEqual(order.signer, account));
};

/**
 * Used in listing flows. Validate unique erc1155 price for an account
 */
export const validateErc1155PriceIsUnique = async (
  price: string,
  collectionAddress: string,
  tokenId: string,
  endTime: number,
  account: string
) => {
  const inputAsWei = toDecimals(price);
  const ordersRes = await getOrders({
    filter: {
      isOrderAsk: true,
      collection: collectionAddress,
      tokenId,
      signer: account,
      endTime,
      price: { min: inputAsWei, max: inputAsWei },
    },
    pagination: { first: 1 },
  });
  return !!ordersRes && !!ordersRes[0];
};

export const getCreatorFee = async (library: SupportedProviders, collectionAddress: string, tokenId: string) => {
  const oneEth = parseEther("1");
  try {
    const { royaltyAmount } = await calculateRoyaltyFeeAndGetRecipient(library, collectionAddress, tokenId, oneEth);

    if (royaltyAmount.isZero()) {
      return 0;
    }

    const priceAsFixed = FixedNumber.from(oneEth);
    const royaltyAmountAsFixed = FixedNumber.from(royaltyAmount);
    return royaltyAmountAsFixed.divUnsafe(priceAsFixed).mulUnsafe(FixedNumber.from(100)).toUnsafeFloat();
  } catch {
    return 0;
  }
};
