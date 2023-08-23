import { RarityDataParams, RarityResponse } from "types/rarity";
import qs from "qs";

/**
 * Stores collection addresses that have no rarity data so it is not fetched again
 */
export const rarityFetchErrorMap = new Map<string, boolean>();

export const getRarityScore = async ({
  address,
  limit,
  page,
  tokenIds,
}: RarityDataParams): Promise<RarityResponse | null> => {
  try {
    const response = await fetch(
      `/api/rarity/assets/${address}?${qs.stringify(
        {
          limit,
          page,
          tokenIds,
        },
        { indices: false }
      )}`
    );

    if (!response.ok) {
      rarityFetchErrorMap.set(address, true);
      return null;
    }

    const data: RarityResponse = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
