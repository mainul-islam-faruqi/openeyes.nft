import { currentChainInfo } from "config/chains";

export const getExplorerLink = (
  data: string | number,
  type: "transaction" | "token" | "address" | "block" | "countdown"
): string => {
  const { explorer } = currentChainInfo;
  switch (type) {
    case "transaction": {
      return `${explorer}/tx/${data}`;
    }
    case "token": {
      return `${explorer}/token/${data}`;
    }
    case "block": {
      return `${explorer}/block/${data}`;
    }
    case "countdown": {
      return `${explorer}/block/countdown/${data}`;
    }
    default: {
      return `${explorer}/address/${data}`;
    }
  }
};
