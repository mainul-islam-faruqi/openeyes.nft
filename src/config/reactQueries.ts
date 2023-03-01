/**
 * Base query keys that are prepended to all react query keys. This allows us to
 * invalidate groups of queries
 *
 * @param prefix The name of the query that will group all subsequent queries
 * @returns Object
 */
export const baseQueryKeys = (prefix: string) => ({
  all: [prefix],
  list: () => [prefix, "list"],
  single: () => [prefix, "single"],
  infiniteQueries: () => [prefix, "infinite"],
});
