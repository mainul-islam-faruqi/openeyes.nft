import Page from "components/Layout/Page";
import { StakingTab } from "./components/StakingTab";
import { RewardHeader } from "./components/RewardHeader";

export const RewardsView = () => (
  <Page>
    <RewardHeader />
    <StakingTab />
  </Page>
);
