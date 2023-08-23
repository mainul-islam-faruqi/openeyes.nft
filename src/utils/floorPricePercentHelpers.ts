import { BigNumber, BigNumberish, constants } from "ethers";
import { useTranslation } from "react-i18next";
import { LOW_FLOOR_THRESHOLD, HIGH_FLOOR_THRESHOLD } from "config/constants";
import { fromDecimals } from "utils/format";
import { CollectionFloor } from "types/graphql";

/**
 * From a floor price and item price in wei, return the % difference as a BigNumber and display string
 * @param collectionFloorPrice
 * @param itemPrice
 * @returns floorDiffPercentString display string, floorDiffPercentBn BigNumber
 */
export const getFloorPricePercentDifference = (
  collectionFloorPrice?: BigNumberish,
  itemPrice?: BigNumberish,
  lowFloorThreshold = LOW_FLOOR_THRESHOLD,
  highFloorThreshold = HIGH_FLOOR_THRESHOLD
) => {
  const collectionFloorBn = BigNumber.from(collectionFloorPrice || "0");
  const priceBn = BigNumber.from(itemPrice || "0");

  if (collectionFloorBn.isZero() || priceBn.isZero()) {
    return {
      floorDiffPercentString: "0",
      floorDiffPercentBn: constants.Zero,
      hasLowThresholdReached: false,
      hasHighThresholdReached: false,
    };
  }

  const floorDiffPercentBn = priceBn.sub(collectionFloorBn).mul(100).div(collectionFloorBn);
  const floorDiffPercentString = fromDecimals(floorDiffPercentBn, 0);
  return {
    floorDiffPercentString,
    floorDiffPercentBn,
    hasLowThresholdReached: floorDiffPercentBn.lte(lowFloorThreshold),
    hasHighThresholdReached: floorDiffPercentBn.lte(highFloorThreshold),
  };
};

/**
 * Return translated, contextual text describing floor price percentage difference
 * @param floorDiffPercentString
 * @param floorDiffPercentBn
 * @returns string
 */
export const useFloorPriceText = (floorDiffPercentString?: string, floorDiffPercentBn?: BigNumber) => {
  const { t } = useTranslation();

  if (!floorDiffPercentString || !floorDiffPercentBn) {
    return "";
  }

  if (floorDiffPercentBn.isZero()) {
    return t("Current floor");
  }

  return t("{{floorDiffAsString}}% {{direction}} floor", {
    floorDiffAsString: floorDiffPercentString.replace("-", ""),
    direction: floorDiffPercentBn.gt(0) ? t("above") : t("below"),
  });
};

interface GlobalFloor {
  globalFloor: BigNumber;
  floorPrice: BigNumber;
  floorPriceOs: BigNumber;
}

/**
 * Return global floor values
 */
export const getGlobalFloor = (collectionFloor?: CollectionFloor): GlobalFloor => {
  if (!collectionFloor) {
    return { globalFloor: constants.Zero, floorPrice: constants.Zero, floorPriceOs: constants.Zero };
  }

  const floorPrice = collectionFloor.floorPrice ? BigNumber.from(collectionFloor.floorPrice) : constants.Zero;
  const floorPriceOs = collectionFloor.floorPriceOS ? BigNumber.from(collectionFloor.floorPriceOS) : constants.Zero;

  let globalFloor;

  if (floorPrice.isZero() || floorPriceOs.isZero()) {
    globalFloor = floorPrice.gt(floorPriceOs) ? floorPrice : floorPriceOs;
  } else {
    globalFloor = floorPrice.gt(floorPriceOs) ? floorPriceOs : floorPrice;
  }

  return {
    globalFloor,
    floorPrice,
    floorPriceOs,
  };
};
