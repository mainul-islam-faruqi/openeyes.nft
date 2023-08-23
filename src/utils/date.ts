import { Duration, formatDistanceToNowStrict, formatDuration as dateFnsFormatDuration, Locale } from "date-fns";
import { BigNumber, BigNumberish } from "ethers";

/**
 * TODO: override the word formatting
 * @see https://github.com/date-fns/date-fns/blob/master/src/locale/en-US/_lib/formatDistance/index.ts
 */
export const timeAgo = (date: number | Date) => {
  return formatDistanceToNowStrict(date, { addSuffix: true });
};

/**
 * Format API timestamp to ms number
 * @param timestamp BigNumberish
 * @returns number
 */
export const timestampInMs = (timestamp: BigNumberish) => BigNumber.from(timestamp).mul(1000).toNumber();

// Date FNS does not type their options into an interface or type so this is a copy
interface DateFnsFormatDurationOptions {
  format?: string[];
  zero?: boolean;
  delimiter?: string;
  locale?: Locale;
}

interface FormatDurationOptions extends DateFnsFormatDurationOptions {
  shortLabels?: boolean;
}

const formatDistanceLocale: Record<string, string> = {
  xSeconds: "{{count}}s",
  xMinutes: "{{count}}m",
  xHours: "{{count}}h",
  xDays: "{{count}}d",
  xMonths: "{{count}}mos",
  xYears: "{{count}}y",
};
const shortEnLocale = {
  formatDistance: (token: any, count: any) => formatDistanceLocale[token].replace("{{count}}", count),
};

/**
 * Wrapper around "formatDuration" to support shortened time labels
 * @see https://github.com/date-fns/date-fns/issues/2134#issuecomment-788212525
 */
export const formatDuration = (duration: Duration, options?: FormatDurationOptions) => {
  const { shortLabels = false, ...formatDurationOptions } = options || {};

  if (shortLabels) {
    formatDurationOptions.locale = shortEnLocale;
  }

  return dateFnsFormatDuration(duration, formatDurationOptions);
};
