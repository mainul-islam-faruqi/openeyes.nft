import React, { IframeHTMLAttributes } from "react";
import { useQuery, UseQueryOptions } from "react-query";
import noop from "lodash/noop";
import { IPFS_GATEWAY } from "config";

export interface IframeProps {
  src: string;
  original?: string;
  onError?: () => void;
  onLoad?: () => void;
  iframeProps?: IframeHTMLAttributes<HTMLIFrameElement>;
}

const sharedIframeProps: IframeHTMLAttributes<HTMLIFrameElement> = {
  width: "100%",
  height: "100%",
  sandbox: "allow-scripts",
};

const useGetHtmlDoc = (src: string, queryOptions?: UseQueryOptions<string, any, string>) =>
  useQuery<string>(["get-html-doc", src], () => fetch(src).then((response) => response.text()), queryOptions);

const ipfsProtocol = "ipfs://";
const arweaveProtocol = "ar://";

export const Iframe: React.FC<IframeProps> = ({ src, original, onError = noop, onLoad = noop, iframeProps }) => {
  const isArweave = !!(original && original.startsWith(arweaveProtocol));
  const useCdnAsset = !original || isArweave;
  const htmlDocQuery = useGetHtmlDoc(src!, { onError, enabled: !!useCdnAsset });

  // If we do not have the original metadata url, or if it is arweave: use our cdn resource
  if (useCdnAsset) {
    return (
      <iframe
        srcDoc={htmlDocQuery.data}
        onLoadCapture={onLoad}
        onError={onError}
        {...sharedIframeProps}
        {...iframeProps}
      />
    );
  }

  const isIpfs = original.startsWith(ipfsProtocol);
  const ipfsSrc = isIpfs && original.replace(ipfsProtocol, `${IPFS_GATEWAY}/`);
  const iframeSrc = ipfsSrc || original;
  const httpsRegex = new RegExp(/^https:\/\//g);

  // If iframeSrc is not https:// - error
  if (!httpsRegex.test(iframeSrc)) {
    onError();
    return null;
  }

  return <iframe src={iframeSrc} onLoadCapture={onLoad} onError={onError} {...sharedIframeProps} {...iframeProps} />;
};
