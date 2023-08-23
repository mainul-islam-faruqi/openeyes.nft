import SearchInsights from "search-insights";

export const useInitializeAlgoliaInsights = () => {
  SearchInsights("init", {
    appId: process.env.ALGOLIA_APP_ID,
    apiKey: process.env.ALGOLIA_SEARCH_API_KEY,
    useCookie: true,
    cookieDuration: 730 * 24 * 60 * 60 * 1000, // 2yrs in ms - 63072000000
  });

  SearchInsights("getUserToken", null, (err, algoliaUserToken) => {
    if (err) {
      console.error(err);
      return;
    }

    SearchInsights("setUserToken", algoliaUserToken || "");
  });
};
