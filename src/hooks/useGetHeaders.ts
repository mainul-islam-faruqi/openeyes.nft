import { useQuery, UseQueryOptions } from "react-query";
import { INDEXER_CUSTOM_CONTENT_TYPE_HEADER } from "config/supportedContentTypes";

interface ContentTypeHeaders {
  contentTypeHeader: string | null;
  indexerCustomHeader: string | null;
}

/**
 * Fetch a given url with the 'HEAD' method and get relevant content type headers
 */
export const useGetContentTypeHeaders = (
  src: string,
  queryOptions?: UseQueryOptions<ContentTypeHeaders, any, ContentTypeHeaders>
) => {
  const fetcher = async (): Promise<ContentTypeHeaders> => {
    const res = await fetch(src, { method: "HEAD" });
    const contentTypeHeader = res.headers.get("content-type");
    const indexerCustomHeader = res.headers.get(INDEXER_CUSTOM_CONTENT_TYPE_HEADER);
    return { contentTypeHeader, indexerCustomHeader };
  };

  const headersQuery = useQuery<ContentTypeHeaders>(["get-headers", src], () => fetcher(), queryOptions);
  return headersQuery;
};
