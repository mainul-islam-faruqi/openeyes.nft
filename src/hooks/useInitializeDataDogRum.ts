import { datadogRum } from "@datadog/browser-rum";
import { useEffect } from "react";

export const useInitializeDataDogRum = () => {
  useEffect(() => {
    if (process.env.DATA_DOG_TOKEN) {
      const commitSha = process.env.GIT_COMMIT_SHA;
      datadogRum.init({
        applicationId: "496f4c8e-97e1-4c8c-a8b7-3b3e165b5ef8",
        clientToken: process.env.DATA_DOG_TOKEN,
        site: "datadoghq.com",
        service: "looksrare-fe",
        version: commitSha.substring(0, 7), // git rev-parse --short "$GITHUB_SHA"
        env: process.env.NODE_ENV,
        sampleRate: 100,
        replaySampleRate: 0,
        trackInteractions: false,
        defaultPrivacyLevel: "allow",
        silentMultipleInit: true,
      });
    }
  }, []);
};
