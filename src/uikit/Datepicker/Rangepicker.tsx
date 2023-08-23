import { useEffect, useRef } from "react";
import { Flex, InputGroup, InputRightElement } from "@chakra-ui/react";
import flatpickr from "flatpickr";
import { Instance } from "flatpickr/dist/types/instance";
import { Options } from "flatpickr/dist/types/options";
import { Input } from "../Input/Input";
import { colors } from "../theme/colors";
import CalendarIcon from "../Icons/components/Calendar";

export interface RangepickerProps extends Options {
  onRangeUpdate: (range: Date[], dateStr: string, instance: Instance) => void;
}

const sx = { _readOnly: { boxShadow: `inset 0px -1px 0px ${colors.gray[500]}` } };

/**
 * @see https://flatpickr.js.org/options/
 */
const defaultOptions: Options = {
  allowInput: true,
  dateFormat: "Y/m/d",
  mode: "range",
  wrap: true,
};

export const Rangepicker = ({ onRangeUpdate, ...props }: RangepickerProps) => {
  const flatPickrRef = useRef<Instance>();
  const startPickrRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);
  const onRangeUpdateRef = useRef(onRangeUpdate);

  useEffect(() => {
    if (startPickrRef.current && !flatPickrRef.current) {
      const baseOptions = { ...defaultOptions, ...props };

      const handleChange = (selectedDates: Date[], dateStr: string, instance: Instance) => {
        const [startDate, endDate] = selectedDates;

        // User-supplied callback
        onRangeUpdateRef.current(selectedDates, dateStr, instance);

        // Update the two inputs
        instance.input.value = instance.formatDate(startDate, baseOptions.dateFormat!);

        if (endDateRef.current && endDate) {
          endDateRef.current.value = instance.formatDate(endDate, baseOptions.dateFormat!);
        }
      };

      // Focus the end date input when the calendar is close if selected
      const handleOnClose = (selectedDates: Date[]) => {
        if (selectedDates && selectedDates[1] && endDateRef.current) {
          endDateRef.current.focus();
        }
      };

      flatPickrRef.current = flatpickr(startPickrRef.current, {
        ...baseOptions,
        onChange: handleChange,
        onClose: handleOnClose,
      });
    }
  }, [props, flatPickrRef, startPickrRef, onRangeUpdateRef, endDateRef]);

  return (
    <Flex ref={startPickrRef} alignItems="center" className="flatpickr">
      <InputGroup>
        <Input readOnly sx={sx} data-input mr={0.5} pr={12} />
        <InputRightElement>
          <CalendarIcon boxSize={6} />
        </InputRightElement>
      </InputGroup>
      <InputGroup>
        <Input readOnly sx={sx} ref={endDateRef} data-open />
        <InputRightElement>
          <CalendarIcon boxSize={6} />
        </InputRightElement>
      </InputGroup>
    </Flex>
  );
};
