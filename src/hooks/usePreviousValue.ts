import { useEffect, useRef } from "react";

/**
 * @see https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state
 */
const usePreviousValue = (value: any) => {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

export default usePreviousValue;
