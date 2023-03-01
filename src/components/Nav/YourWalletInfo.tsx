import { Box, Flex, BoxProps, Skeleton } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { constants } from "ethers";
import NextLink from "next/link";
import { Button, EthIcon, LogoIcon, Text, WethIcon } from "uikit";
import { formatToSignificant } from "utils/format";
import { useEthBalance } from "hooks/useEthBalance";
import { useUserEns } from "hooks/useUserProfileDisplay";
import { useLooksBalance, useWethBalance } from "hooks/useTokenBalance";
import { useCalculatePendingUserRewards } from "hooks/calls/useFeeSharingSystem";
import { useGetTradingListingRewards } from "hooks/useGetTradingListingRewards";
import { CopyAddress } from "../CopyAddress/CopyAddress";
import { ConvertEthButton } from "../Buttons/ConvertEthButton";

export interface YourWalletInfoProps extends BoxProps {
  isOpen: boolean;
  onClose: () => void;
  address: string;
}

export const YourWalletInfo = ({ isOpen, onClose, address, ...props }: YourWalletInfoProps) => {
  const { t } = useTranslation();
  const sharedOptions = { enabled: isOpen };
  const userEnsQuery = useUserEns(address, sharedOptions);
  const wethBalanceQuery = useWethBalance(address, sharedOptions);
  const looksBalanceQuery = useLooksBalance(address, sharedOptions);
  const ethBalanceQuery = useEthBalance(address, sharedOptions);
  const pendingWethRewardsQuery = useCalculatePendingUserRewards(address, sharedOptions);
  const userRewardQuery = useGetTradingListingRewards(address, sharedOptions);

  const ensText = (() => {
    if (userEnsQuery.isFetching) {
      return <Skeleton height={5} width={18} ml={4} />;
    }
    if (userEnsQuery.isSuccess && userEnsQuery.data) {
      return (
        <Text textStyle="detail" bold px={4} isTruncated title={userEnsQuery.data}>
          {userEnsQuery.data}
        </Text>
      );
    }
    return (
      <Text textStyle="detail" color="text-03" px={4}>
        {t("Your Wallet")}
      </Text>
    );
  })();

  const listingAndTrading = userRewardQuery.isSuccess
    ? userRewardQuery.data.listingRewards.pending.add(userRewardQuery.data.tradingRewards.pending)
    : constants.Zero;

  return (
    <Box px={4} py={6} {...props}>
      <Box border="1px solid" borderColor="border-01" mb={8} borderRadius="lg">
        <Flex alignItems="center" justifyContent="space-between" borderBottom="1px solid" borderColor="border-01">
          {ensText}
          <CopyAddress
            address={address}
            startLength={4}
            endLength={4}
            iconButtonProps={{ borderTopRightRadius: "lg" }}
          />
        </Flex>
        <Box p={4}>
          <Flex alignItems="center" mb={4}>
            <EthIcon mr={2} />
            <Text textStyle="detail" flex={1}>
              ETH
            </Text>
            <Text bold textStyle="detail">
              {ethBalanceQuery.isSuccess && formatToSignificant(ethBalanceQuery.data, 3)}
            </Text>
          </Flex>
          <Flex alignItems="center" mb={4}>
            <WethIcon mr={2} />
            <Text textStyle="detail" flex={1}>
              WETH
            </Text>
            <Text bold textStyle="detail">
              {wethBalanceQuery.isSuccess && formatToSignificant(wethBalanceQuery.data, 3)}
            </Text>
          </Flex>
          <Flex alignItems="center">
            <LogoIcon mr={2} color="interactive-01" />
            <Text textStyle="detail" flex={1}>
              LOOKS
            </Text>
            <Text bold textStyle="detail">
              {looksBalanceQuery.isSuccess && formatToSignificant(looksBalanceQuery.data, 3)}
            </Text>
          </Flex>
        </Box>
        <Flex borderTop="1px solid" borderColor="border-01" alignItems="center" justifyContent="end">
          <ConvertEthButton />
        </Flex>
      </Box>
      <Text textStyle="detail" color="text-03" mb={2}>
        {t("Rewards to Collect")}
      </Text>
      <Box border="1px solid" borderColor="border-01" borderRadius="lg">
        <Box p={4}>
          <Flex alignItems="center" mb={4}>
            <LogoIcon mr={2} color="interactive-01" />
            <Text textStyle="detail" flex={1}>
              {t("Listing & Trading")}
            </Text>
            <Text bold textStyle="detail">
              {formatToSignificant(listingAndTrading, 4)}
            </Text>
          </Flex>
          <Flex alignItems="center">
            <WethIcon mr={2} />
            <Text textStyle="detail" flex={1}>
              {t("Staking")}
            </Text>
            <Text bold textStyle="detail">
              {pendingWethRewardsQuery.isSuccess && formatToSignificant(pendingWethRewardsQuery.data, 9)}
            </Text>
          </Flex>
        </Box>
        <Flex borderTop="1px solid" borderColor="border-01" alignItems="center" justifyContent="end">
          <NextLink href="/rewards" passHref>
            <Button as="a" variant="ghost" onClick={onClose}>
              {t("LOOKS Rewards")}
            </Button>
          </NextLink>
        </Flex>
      </Box>
    </Box>
  );
};
