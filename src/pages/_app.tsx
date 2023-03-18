import { FC, useState } from "react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { DefaultSeo, SocialProfileJsonLd } from "next-seo";
import { appWithTranslation } from "next-i18next";
import { Hydrate, QueryClient, QueryClientConfig, QueryClientProvider } from "react-query";
import { Web3ReactProvider } from "@web3-react/core";
import { ReactQueryDevtools } from "react-query/devtools";
import { ChakraProvider } from "@chakra-ui/react";
// import { currentChainInfo, seoConfig } from "config";
import { ETH_AVG_BLOCK_TIME_MS } from "config/constants"
// import { EagerConnectProvider } from "contexts";
// import { useInitializeDataDogRum } from "hooks/useInitializeDataDogRum";
// import { useInitializeAlgoliaInsights } from "hooks/useInitializeAlgoliaInsights";
// import { GoogleTagManager } from "components/GoogleTagManager";
// import { LoadingProgressBar } from "components/LoadingProgressBar";
import { theme } from "uikit/theme";
import { getLibrary } from "utils/connectors";
// import nextI18NextConfig from "../../next-i18next.config";

// import "uikit/Datepicker/theme.css";
// import "views/collections/components/banner.css";

const queryClientOptions: QueryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: ETH_AVG_BLOCK_TIME_MS * 3, // ~40 seconds,
      retry: 1, // Only retry erroring queries once
    },
  },
};

const App: FC<AppProps> = ({ Component, pageProps }) => {
  const [queryClient] = useState(() => new QueryClient(queryClientOptions));

  // useInitializeDataDogRum();
  // useInitializeAlgoliaInsights();

  return (
    <>
      <Head>
        <meta key="viewport" name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      {/* <GoogleTagManager /> */}
      {/* <DefaultSeo {...seoConfig} /> */}
      {/* <SocialProfileJsonLd
        type="Organization"
        name="OpenEyes.nft"
        url={currentChainInfo.appUrl}
        sameAs={["https://twitter.com/looksrarenft"]}
      /> */}
      <Web3ReactProvider getLibrary={getLibrary}>
        {/* <EagerConnectProvider> */}
          <QueryClientProvider client={queryClient}>
            <Hydrate state={pageProps.dehydratedState}>
              <ChakraProvider theme={theme}>
                {/* <LoadingProgressBar /> */}
                <Component {...pageProps} />
              </ChakraProvider>
            </Hydrate>
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        {/* </EagerConnectProvider> */}
      </Web3ReactProvider>
    </>
  );
};

// export default appWithTranslation(App, nextI18NextConfig);
// export default appWithTranslation(App); 
export default App;
