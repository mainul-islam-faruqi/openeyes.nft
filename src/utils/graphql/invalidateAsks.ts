import { gql } from "graphql-request";
import { getErrorMessage } from "utils/errors";
import { graphql } from "./graphql";

interface InvalidateAsksRes {
  message: string;
  success: boolean;
}

export const invalidateAsks = async (collection: string, signer: string): Promise<InvalidateAsksRes> => {
  const query = gql`
    mutation InvalidateAsks($collection: Address!, $signer: Address!) {
      invalidateAsks(collection: $collection, signer: $signer) {
        success
        message
      }
    }
  `;

  try {
    const res: {
      invalidateAsks: InvalidateAsksRes;
    } = await graphql(query, { collection, signer });
    return res.invalidateAsks;
  } catch (e) {
    return {
      success: false,
      message: getErrorMessage(e),
    };
  }
};
