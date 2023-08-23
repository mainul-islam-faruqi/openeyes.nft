import { gql } from "graphql-request";
import { getErrorMessage } from "utils/errors";
import { graphql } from "./graphql";

interface InvalidateBidsRes {
  message: string;
  success: boolean;
}

export const invalidateBids = async (signer: string): Promise<InvalidateBidsRes> => {
  const query = gql`
    mutation InvalidateBidsMutation($signer: Address!) {
      invalidateBids(signer: $signer) {
        success
        message
      }
    }
  `;

  try {
    const res: {
      invalidateBids: InvalidateBidsRes;
    } = await graphql(query, { signer });
    return res.invalidateBids;
  } catch (e) {
    console.error(e);
    return {
      success: false,
      message: getErrorMessage(e),
    };
  }
};
