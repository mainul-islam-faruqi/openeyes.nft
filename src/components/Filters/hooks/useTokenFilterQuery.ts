import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";

export const getTokenFilterQuery = (query: ParsedUrlQuery) => {
  try {
    if (!query.filters) {
      return {};
    }
    return JSON.parse(query.filters as string);
  } catch {
    return {};
  }
};

export const useTokenFilterQuery = () => {
  const router = useRouter();
  return getTokenFilterQuery(router.query);
};
