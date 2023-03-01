import { useEffect } from "react";
import usePreviousValue from "hooks/usePreviousValue";

/**
 * Trigger a callback whenever a passed state variable changes
 */
export const useOnStateChangeCallback = (state: any, callback: (state: any, prevState: any) => void) => {
  const prevState = usePreviousValue(state);

  useEffect(() => {
    if (!!prevState && state !== prevState) {
      callback(state, prevState);
    }
  }, [state, prevState, callback]);
};
