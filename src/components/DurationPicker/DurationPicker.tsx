// import { useEffect, useMemo, useRef, useState } from "react";
// import { Box, Flex, FlexProps, IconButton } from "@chakra-ui/react";
// import flatpickr from "flatpickr";
// import { format } from "date-fns";
// import { Instance } from "flatpickr/dist/types/instance";
// import minMaxTimePlugin from "flatpickr/dist/plugins/minMaxTimePlugin";
// import { useDurationLabels, DurationOption } from "hooks/useDurationLabels";
// import { DropdownMenu } from "components/DropdownMenu";
// import { CalendarIcon, CloseIcon } from "uikit";
// import { formatTimestampAsDateString } from "utils/format";
// import { CustomDateDisplay } from "./CustomDateDisplay";




import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Flex, FlexProps, IconButton } from "@chakra-ui/react";
import flatpickr from "flatpickr";
import { format } from "date-fns";
import { Instance } from "flatpickr/dist/types/instance";
import minMaxTimePlugin from "flatpickr/dist/plugins/minMaxTimePlugin";
import { useDurationLabels, DurationOption } from "hooks/useDurationLabels";
import { DropdownMenu } from "../DropdownMenu/DropdownMenu";
import { CalenderIcon, CloseIcon } from "uikit";
import { formatTimestampAsDateString } from "utils/format";
import { CustomDateDisplay } from "./CustomDateDisplay";



interface DurationPickerProps extends FlexProps {
  onDateUpdate: (timestamp: number) => void;
}

// Simple helper to simulate a duration options
const getCustomDateOptions = (date: Date): DurationOption => ({
  value: date.toISOString(),
  label: "custom",
});

export const DurationPicker = ({ onDateUpdate, ...props }: DurationPickerProps) => {
  const { labels, durationMap, getDefaultDurationOption, getDurationKeyFromLabel } = useDurationLabels();
  const [endTime, setEndTime] = useState(getDefaultDurationOption());
  const nodeRef = useRef(null);
  const flatpickrInstance = useRef<Instance>();
  const hasPickedCustomDatetime = endTime.label === "custom";

  const endTimeAsTimestampMs = useMemo(() => {
    return new Date(endTime.value).getTime();
  }, [endTime]);

  const handleSelectPresetEndTime = (durationLabel: string) => {
    const durationKey = getDurationKeyFromLabel(durationLabel);
    const newOption = durationKey ? durationMap[durationKey] : getDefaultDurationOption();
    setEndTime(newOption);
    onDateUpdate(new Date(newOption.value).getTime());
  };

  useEffect(() => {
    if (nodeRef.current) {
      const today = new Date();
      const todayDate = format(today, "y-MM-dd");
      const minTime = format(today, "H:m");

      flatpickrInstance.current = flatpickr(nodeRef.current, {
        enableTime: true,
        wrap: true,
        static: true,
        time_24hr: true,
        defaultHour: today.getHours(),
        defaultMinute: Math.round(today.getMinutes() / 5) * 5, // Round up to the nearest 5
        onChange: ([date]) => {
          const newOption = date ? getCustomDateOptions(date) : getDefaultDurationOption();
          setEndTime(newOption);
          onDateUpdate(new Date(newOption.value).getTime());
        },
        plugins: [
          minMaxTimePlugin({
            table: {
              [todayDate]: {
                minTime,
                maxTime: "23:59",
              },
            },
          }),
        ],
        minDate: "today",
      });
    }

    return () => {
      if (flatpickrInstance.current) {
        flatpickrInstance.current.destroy();
      }
    };
  }, [nodeRef, flatpickrInstance, setEndTime, getDefaultDurationOption, onDateUpdate]);

  return (
    <Flex alignItems="center" position="relative" minWidth="226px" {...props}>
      <Box flex={1} mr="1px">
        {hasPickedCustomDatetime ? (
          <CustomDateDisplay dateStr={formatTimestampAsDateString(endTimeAsTimestampMs)} />
        ) : (
          <DropdownMenu
            width="100%"
            labels={labels}
            selectedLabel={endTime.label}
            handleSelect={handleSelectPresetEndTime}
            renderInPortal={false}
          />
        )}
      </Box>
      <Box position="relative" height={10} width={10} className="flatpickr modal" ref={nodeRef}>
        <Box as="input" position="absolute" opacity={0} pointerEvents="none" z-index={-1} data-input width="0" />
        <IconButton
          colorScheme="gray"
          aria-label="clear date"
          size="sm"
          data-clear
          position="absolute"
          top={0}
          left={0}
          visibility={hasPickedCustomDatetime ? "visible" : "hidden"}
          borderRadius={0}
        >
          <CloseIcon boxSize={5} />
        </IconButton>
        <IconButton
          colorScheme="gray"
          aria-label="custom date"
          size="sm"
          data-toggle
          position="absolute"
          top={0}
          left={0}
          visibility={hasPickedCustomDatetime ? "hidden" : "visible"}
          borderRadius={0}
        >
          <CalenderIcon boxSize={5} />
        </IconButton>
      </Box>
    </Flex>
  );
};
