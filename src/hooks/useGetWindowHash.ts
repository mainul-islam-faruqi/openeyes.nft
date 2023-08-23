import { useEffect, useState } from "react";

export const useGetWindowHash = () => {
  const [hash, setHash] = useState(() => {
    if (typeof window !== "undefined") {
      return window.location.hash;
    }

    return "";
  });

  useEffect(() => {
    const handleHashChange = () => {
      setHash(window.location.hash);
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [setHash]);

  return hash;
};
