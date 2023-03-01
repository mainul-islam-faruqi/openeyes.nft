import { gql } from "graphql-request";
import { getAuthCookie } from "utils/cookies";
import { getErrorMessage } from "utils/errors";
import { graphql } from "./graphql";

interface RevalidateBidPayload {
  success: boolean;
  message: null | string;
}

export const revalidateBid = async (address: string, hash: string): Promise<RevalidateBidPayload> => {
  const query = gql`
    mutation RevalidateBidMutation($hash: String!) {
      revalidateBid(hash: $hash) {
        success
        message
      }
    }
  `;

  const authCookie = getAuthCookie(address);
  const requestHeaders = {
    Authorization: `Bearer ${authCookie}`,
  };

  try {
    const res: {
      revalidateBid: RevalidateBidPayload;
    } = await graphql(query, { hash }, requestHeaders);
    return res.revalidateBid;
  } catch (e) {
    console.error(e);
    return {
      message: getErrorMessage(e),
      success: false,
    };
  }
};
