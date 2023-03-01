import { ROYALTY_FEE_WARNING_THRESHOLD } from "config";

/**
 * Numeric evaluation of whether a royalty fee is greater than the ROYALTY_FEE_WARNING_THRESHOLD.
 * fee should not exceed 100 (100%)
 */
export const isFeeAboveWarningThreshold = (fee = 0, threshold = ROYALTY_FEE_WARNING_THRESHOLD): boolean =>
  fee >= 100 || fee * 100 > parseInt(threshold);
