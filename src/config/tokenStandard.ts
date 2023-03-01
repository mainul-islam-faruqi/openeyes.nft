// @ts-nocheck
import { ERC721Abi, ERC1155Abi } from "@looksrare/sdk";
import { TokenStandard } from "types/config";
import { addresses } from "./addresses";

export const tokenStandardConfig: Record<TokenStandard, { transferManagerAddress: string; abi: any }> = {
  ERC721: {
    transferManagerAddress: addresses.TRANSFER_MANAGER_ERC721,
    abi: ERC721Abi,
  },
  ERC1155: {
    transferManagerAddress: addresses.TRANSFER_MANAGER_ERC1155,
    abi: ERC1155Abi,
  },
};

// export default tokenStandardConfig;
