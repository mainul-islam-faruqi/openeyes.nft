import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import add from "date-fns/add";
import { Duration } from "date-fns";
import { getLocalStorageItem, setLocalStorageItem } from "utils/localStorage";

interface Props {
  baseKey: string;
  duration?: Duration;
  useAccountInKey?: boolean;
}

/**
 * Hook to handle setting a local storage key with a timestamp value,
 * The isSnoozed boolean reflects whether a period of time since that timestamp has passed
 * @param baseKey Base local storage key, minus account address
 * @param duration Optional Duration object for setting isSnoozed expiry
 * @param useAccountInKey Optional boolean for whether to use account in local storage key (making the snooze account-specific)
 * @returns Object
 */
const useLocalStorageSnooze = ({ baseKey, duration = { days: 1 }, useAccountInKey = false }: Props) => {
  const { account } = useWeb3React();
  const lsKey = useAccountInKey ? `${baseKey}_${account || ""}` : baseKey;
  const [isSnoozed, setIsSnoozed] = useState(true);

  useEffect(() => {
    const snoozeEndTime = Number(getLocalStorageItem(lsKey)) || 0;
    setIsSnoozed(Date.now() < snoozeEndTime);
    // lsKey updates after eager connect - so setIsSnoozed evaluation should happen if the value changes
  }, [lsKey]);

  const handleSnooze = () => {
    const endDate = add(new Date(), duration);
    setLocalStorageItem(lsKey, endDate.getTime());
    setIsSnoozed(true);
  };

  return { isSnoozed, handleSnooze };
};

export default useLocalStorageSnooze;
