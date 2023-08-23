import { useWeb3React } from "@web3-react/core";
import { useTranslation } from "react-i18next";
import { Flex, Box, Skeleton } from "@chakra-ui/react";
import { formatToSignificant } from "utils/format";
import { Switch, Text, TooltipText, Popover, InformationIcon } from "uikit";
import { useCalculatePendingUserRewards } from "hooks/calls/useFeeSharingSystem";

interface Props {
  onChange: (shouldClaim: boolean) => void;
}

export const CollectWethRewardsRow = ({ onChange }: Props) => {
  const { account } = useWeb3React();
  const { t } = useTranslation();

  const {
    data: wethRewards,
    isLoading,
    isSuccess,
  } = useCalculatePendingUserRewards(account ?? "", { enabled: !!account });
  const wethRewardsDisplayValue = formatToSignificant(wethRewards || "0", 9);
  const hasNoWethRewards = !wethRewards || wethRewards.isZero();

  return (
    <Flex pt={6} alignItems="center" justifyContent="space-between">
      <Box>
        {isLoading && <Skeleton width="180px" height="24px" />}
        {isSuccess && (
          <Popover
            label={
              <TooltipText>
                {t(
                  "You can collect pending rewards while staking or unstaking from this contract. You’ll have to pay a little more in transaction fees for this."
                )}
              </TooltipText>
            }
          >
            <Flex alignItems="center">
              <Text color={hasNoWethRewards ? "text-disabled" : "text-01"} mr={1}>
                {t("Collect {{wethRewards}} WETH rewards?", {
                  wethRewards: wethRewardsDisplayValue,
                })}
              </Text>
              <InformationIcon boxSize={5} color={hasNoWethRewards ? "text-disabled" : "text-01"} />
            </Flex>
          </Popover>
        )}
      </Box>
      <Switch
        isDisabled={hasNoWethRewards || isLoading}
        onChange={(e) => {
          onChange(e.target.checked);
        }}
      />
    </Flex>
  );
};
