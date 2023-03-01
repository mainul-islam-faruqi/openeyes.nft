import { request, gql } from "graphql-request";
import { currentChainInfo } from "config/chains";
import { NFTAvatar, Pagination, TokenFilter, ImageData } from "types/graphql";

type Response = {
  tokens?: {
    id: string;
    tokenId: string;
    image: ImageData;
    name: string;
    collection: {
      address: string;
    };
  }[];
};

const getTokensForProfile = async (filter: TokenFilter, pagination?: Pagination): Promise<NFTAvatar[]> => {
  const query = gql`
    query getTokensForProfile($filter: TokenFilterInput, $pagination: PaginationInput) {
      tokens(filter: $filter, pagination: $pagination) {
        id
        tokenId
        image {
          src
          contentType
        }
        name
        collection {
          address
        }
      }
    }
  `;

  const res: Response = await request(currentChainInfo.apiUrl, query, { filter, pagination });

  if (!res.tokens) {
    throw new Error(`No tokens returned for query: getTokensForProfile`);
  }

  return res.tokens.map((token: any) => {
    return {
      id: token.id,
      tokenId: token.tokenId,
      collection: token.collection.address,
      image: token.image,
      name: token.name,
    };
  });
};

export default getTokensForProfile;
