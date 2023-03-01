import { gql } from "graphql-request";
import { CurrentListingReward } from "types/graphql";
import { getErrorMessage } from "utils/errors";
import { graphql } from "./graphql";

const getCurrentListingReward = async (): Promise<CurrentListingReward> => {
  const query = gql`
    query GetCurrentListingReward {
      currentListingReward {
        count
        totalPoints
      }
    }
  `;

  try {
    const res: {
      currentListingReward: CurrentListingReward;
    } = await graphql(query);

    return res.currentListingReward;
  } catch (e) {
    console.error(e);
    throw new Error(getErrorMessage(e));
  }
};

export default getCurrentListingReward;
