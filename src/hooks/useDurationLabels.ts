import { useTranslation } from "react-i18next";
import addTime from "date-fns/add";
import { useCallback, useRef } from "react";

export enum DurationKey {
  "1_DAY" = "1_DAY",
  "3_DAYS" = "3_DAYS",
  "7_DAYS" = "7_DAYS",
  "14_DAYS" = "14_DAYS",
  "30_DAYS" = "30_DAYS",
  "90_DAYS" = "90_DAYS",
  "180_DAYS" = "180_DAYS",
}

export type DurationOption = { value: string; label: string };

const DEFAULT_DURATION = 30;

export const useDurationLabels = (): {
  labels: string[];
  durationMap: Record<DurationKey, DurationOption>;
  getDurationOption: (days: number) => DurationOption;
  getDefaultDurationOption: () => DurationOption;
  getDurationKeyFromLabel: (label: string) => DurationKey | undefined;
} => {
  const { t } = useTranslation();
  const memoizedT = useRef(t);

  const getDurationOption = useCallback(
    (days: number): DurationOption => ({
      value: addTime(new Date(), { days }).toISOString(),
      label: memoizedT.current("day", { count: days }),
    }),
    [memoizedT]
  );

  const getDefaultDurationOption = useCallback(() => getDurationOption(DEFAULT_DURATION), [getDurationOption]);

  const durationMap = {
    [DurationKey["1_DAY"]]: getDurationOption(1),
    [DurationKey["3_DAYS"]]: getDurationOption(3),
    [DurationKey["7_DAYS"]]: getDurationOption(7),
    [DurationKey["14_DAYS"]]: getDurationOption(14),
    [DurationKey["30_DAYS"]]: getDurationOption(30),
    [DurationKey["90_DAYS"]]: getDurationOption(90),
    [DurationKey["180_DAYS"]]: getDurationOption(180),
  };

  const getDurationKeyFromLabel = (label: string) => {
    const keys = Object.keys(durationMap) as DurationKey[];
    const duration = keys.find((key) => durationMap[key].label === label);
    return duration;
  };

  return {
    labels: Object.values(durationMap).map((duration) => duration.label),
    durationMap,
    getDurationOption,
    getDefaultDurationOption,
    getDurationKeyFromLabel,
  };
};
