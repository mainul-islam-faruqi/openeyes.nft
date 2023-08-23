import { useEffect } from "react";

export const useScrollToTopOnMount = () => {
  useEffect(() => {
    scrollTo({ top: 0, behavior: "smooth" });
  }, []);
};
