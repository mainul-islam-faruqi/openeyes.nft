/**
 * Retrieve a value in the local storage
 * /!\ Can't be used server side
 * @param key Storage key
 * @returns The storage value or null
 */
export const getLocalStorageItem = (key: string): string | null => {
  if (typeof window !== "undefined") {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  return null;
};

/**
 * Set a value in the local storage
 * /!\ Can't be used server side
 * @param key Storage key
 * @param value Storage value
 * @returns true if the value can be set
 */
export const setLocalStorageItem = (key: string, value: string | number): boolean => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  return false;
};

/**
 * Remove a value in the local storage
 * /!\ Can't be used server side
 * @param key Storage key
 * @returns true if the value has been removed
 */
export const removeLocalStorageItem = (key: string): boolean => {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  return false;
};
