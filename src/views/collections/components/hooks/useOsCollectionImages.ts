import { useQuery, UseQueryOptions } from "react-query";
import { currentChainInfo } from "config/chains";
import { ImageData } from "types/graphql";

interface OsCollectionResponse {
  banner: ImageData | null;
  logo: ImageData | null;
}

const emptyResponse: OsCollectionResponse = { banner: null, logo: null };

const fetchOsCollectionImages = async (collectionAddress: string): Promise<OsCollectionResponse> => {
  try {
    const response = await fetch(`${currentChainInfo.osApiUrl}/api/v1/asset_contract/${collectionAddress}`);

    if (!response.ok) {
      return emptyResponse;
    }

    const data = await response.json();

    if (data.success === "false") {
      return emptyResponse;
    }

    return {
      banner: { src: data.collection.banner_image_url },
      logo: { src: data.collection.image_url },
    };
  } catch {
    return emptyResponse;
  }
};

const cacheTime = 30 * 60 * 1000; // 30 minutes

export const useOsCollectionImages = (
  collectionAddress: string,
  options?: UseQueryOptions<OsCollectionResponse, any, OsCollectionResponse>
) => {
  return useQuery<OsCollectionResponse>(
    ["os-collection-image", collectionAddress],
    () => fetchOsCollectionImages(collectionAddress),
    { refetchOnWindowFocus: false, cacheTime, staleTime: cacheTime, ...options }
  );
};
