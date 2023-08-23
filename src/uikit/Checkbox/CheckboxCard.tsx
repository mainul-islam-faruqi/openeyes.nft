import { forwardRef, CheckboxProps, Box, useCheckbox } from "@chakra-ui/react";

const CheckboxCard = forwardRef<CheckboxProps, "input">((props, ref) => {
  const { getInputProps, getCheckboxProps } = useCheckbox(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as="label" ref={ref} {...props}>
      <input {...input} />
      <Box
        {...checkbox}
        role="checkbox"
        cursor={props.disabled ? "not-allowed" : "pointer"}
        borderWidth="1px"
        borderRadius="md"
        boxShadow="sm"
        borderColor="border-01"
        color="text-03"
        _checked={{
          bg: "ui-02",
          color: "text-01",
          borderColor: "interactive-01",
        }}
        px={5}
        py={3}
      >
        {props.children}
      </Box>
    </Box>
  );
});

export default CheckboxCard;
