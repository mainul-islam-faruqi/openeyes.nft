import { DAILY_TRADING_REWARD_DISTRIBUTION_UTC, DAILY_TRADING_REWARD_PAUSE_UTC } from "config";
import { intervalToDuration } from "date-fns";
import { formatDuration } from "utils/date";

const TRADING_REWARDS_BUFFER_HOUR = DAILY_TRADING_REWARD_DISTRIBUTION_UTC.h - DAILY_TRADING_REWARD_PAUSE_UTC.h;

interface TradingRewardsTime {
  isPaused: boolean;
  timeUntilDistribution: string | undefined;
  timeUntilPause: string | undefined;
  nextDistribution: Date;
  nextPause: Date;
}

/**
 * Get information about the next trading reward times
 * @returns TradingRewardsTime
 */
export const getDurationUntilNextDistribution = (shortLabels = false): TradingRewardsTime => {
  const now = new Date();
  const nowUtcDate = now.getUTCDate();
  const nowUtcHour = now.getUTCHours();

  // Build next DISTRIBUTION date
  const nextDistribution = new Date();
  nextDistribution.setUTCDate(nowUtcHour >= DAILY_TRADING_REWARD_DISTRIBUTION_UTC.h ? nowUtcDate + 1 : nowUtcDate);
  nextDistribution.setUTCHours(DAILY_TRADING_REWARD_DISTRIBUTION_UTC.h);
  nextDistribution.setUTCMinutes(DAILY_TRADING_REWARD_DISTRIBUTION_UTC.m);
  nextDistribution.setUTCSeconds(DAILY_TRADING_REWARD_DISTRIBUTION_UTC.s);

  // Build next PAUSE date
  const nextPause = new Date();
  nextPause.setUTCDate(nowUtcHour >= DAILY_TRADING_REWARD_PAUSE_UTC.h ? nowUtcDate + 1 : nowUtcDate);
  nextPause.setUTCHours(DAILY_TRADING_REWARD_PAUSE_UTC.h);
  nextPause.setUTCMinutes(DAILY_TRADING_REWARD_PAUSE_UTC.m);
  nextPause.setUTCSeconds(DAILY_TRADING_REWARD_PAUSE_UTC.s);

  const startAsUtcString = new Date().toUTCString(); // Current date time as UTC string
  const durationUntilDistribution = intervalToDuration({
    start: new Date(startAsUtcString),
    end: nextDistribution,
  });
  const durationUntilPause = intervalToDuration({
    start: new Date(startAsUtcString),
    end: nextPause,
  });

  const timeUntilDistribution = formatDuration(durationUntilDistribution, {
    format: ["hours", "minutes"],
    shortLabels,
  });
  const timeUntilPause = formatDuration(durationUntilPause, {
    format: ["hours", "minutes"],
    shortLabels,
  });

  const isPaused = (durationUntilDistribution.hours || 0) < TRADING_REWARDS_BUFFER_HOUR;

  return { timeUntilDistribution, timeUntilPause, nextDistribution, nextPause, isPaused };
};
