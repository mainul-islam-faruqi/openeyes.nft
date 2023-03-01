// import { Trans } from "next-i18next";
// import { Text } from "uikit";
// import intervalToDuration from "date-fns/intervalToDuration";



import { Trans } from "next-i18next";
import { Text } from "uikit/Text/Text";
import intervalToDuration from "date-fns/intervalToDuration";




interface Props {
  start: number | Date;
  end: number | Date;
}

export const Countdown: React.FC<Props> = ({ start, end }) => {
  const duration = intervalToDuration({
    start,
    end,
  });

  const { months, days, hours, minutes } = duration;

  return (
    <>
      {!!months && (
        <Trans i18nKey="transCountdownMonths">
          <Text textStyle="detail" display="inline" bold>
            {{ months }}
          </Text>
          <Text color="text-03" textStyle="detail" display="inline" mr={1}>
            mth
          </Text>
        </Trans>
      )}
      {!!days && (
        <Trans i18nKey="transCountdownDays">
          <Text textStyle="detail" display="inline" bold>
            {{ days }}
          </Text>
          <Text color="text-03" textStyle="detail" display="inline" mr={1}>
            d
          </Text>
        </Trans>
      )}
      {!!hours && (
        <Trans i18nKey="transCountdownHours">
          <Text textStyle="detail" display="inline" bold>
            {{ hours }}
          </Text>
          <Text color="text-03" textStyle="detail" display="inline" mr={1}>
            h
          </Text>
        </Trans>
      )}
      {!!minutes && (
        <Trans i18nKey="transCountdownMinutes">
          <Text textStyle="detail" display="inline" bold>
            {{ minutes }}
          </Text>
          <Text color="text-03" textStyle="detail" display="inline" mr={1}>
            m
          </Text>
        </Trans>
      )}
    </>
  );
};
