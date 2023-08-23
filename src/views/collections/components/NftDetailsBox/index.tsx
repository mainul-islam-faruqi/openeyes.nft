import { forwardRef, Box, Flex, Divider, BoxProps, Skeleton } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useWeb3React } from "@web3-react/core";
import { UseQueryResult } from "react-query";
import { formatTimestampAsDateString, formatToSignificant, formatUsd, fromDecimals } from "utils/format";
import { getCurrencyConfig } from "config/currencies";
import { NFT, TokenOwner } from "types/graphql";
import { Popover, Text, TooltipText } from "uikit";
import { timestampInMs } from "utils/date";
import { isAddressOneOfOwners } from "utils/guards";
import { useCoinPrices } from "hooks/useCoinPrices";
import { BuyNowButton, MakeOfferButton, ConnectWalletButton } from "components/Buttons";
import { Countdown } from "components/Countdown";
import { NftOwnerDetails } from "./NftOwnerDetails";

interface NftDetailsBoxProps extends BoxProps {
  nft: NFT;
  tokenOwnersQuery: UseQueryResult<TokenOwner[]>;
}

export const NftDetailsBox = forwardRef<NftDetailsBoxProps, "div">(({ nft, tokenOwnersQuery, ...props }, ref) => {
  const { t } = useTranslation();
  const { account } = useWeb3React();
  const coinPriceQuery = useCoinPrices();
  const { ask, bids, lastOrder, name, image, collection, tokenId, countOwners } = nft;
  const isErc1155 = nft.collection.type === "ERC1155";

  const endTimeInMs = ask && timestampInMs(ask.endTime);
  const askAmount = formatToSignificant(ask?.price ?? "0", 4);
  const askAmountAsNumber = parseFloat(fromDecimals(ask?.price ?? "0"));

  const highestBid = bids[0];
  const AskCurrencyIcon = ask && getCurrencyConfig(ask.currency, true).icon;
  const HighestBidCurrencyIcon = highestBid && getCurrencyConfig(highestBid.currency).icon;
  const LastOrderIcon = lastOrder && getCurrencyConfig(lastOrder.currency).icon;

  return (
    <Box border="1px solid" borderColor="border-01" overflow="hidden" {...props}>
      <Box px={4} py={6} bg="ui-01">
        <Flex alignItems="center" justifyContent="space-between">
          {ask ? (
            <>
              <Text color="text-02" textStyle="detail">
                {t("Price")}
              </Text>
              {endTimeInMs && (
                <Popover
                  contentProps={{ width: "220px" }}
                  label={
                    <TooltipText>
                      {t("Available at this price until: {{expiryTime}}", {
                        expiryTime: formatTimestampAsDateString(endTimeInMs),
                      })}
                    </TooltipText>
                  }
                >
                  <span>
                    <Flex>
                      <Text color="text-02" textStyle="detail" mr={2}>
                        {t("Time left")}
                      </Text>
                      <Countdown start={new Date()} end={endTimeInMs} />
                    </Flex>
                  </span>
                </Popover>
              )}
            </>
          ) : (
            <>
              <Text color="text-02" textStyle="detail">
                -
              </Text>
              <Text color="text-02" textStyle="detail">
                {t("Unlisted")}
              </Text>
            </>
          )}
        </Flex>
        {ask && (
          <Flex alignItems="center" my={4}>
            {AskCurrencyIcon && <AskCurrencyIcon boxSize={14} width="28px" height="56px" />}
            <Text bold as="h2" color="text-01" textStyle="display-02" mx={2}>
              {askAmount}
            </Text>
            {coinPriceQuery.isLoading ? (
              <Skeleton alignSelf="start" height="24px" width="70px" />
            ) : (
              <Text alignSelf="start" color="text-02" textStyle="helper">
                {coinPriceQuery.isSuccess ? formatUsd(askAmountAsNumber * coinPriceQuery.data.eth) : "-"}
              </Text>
            )}
          </Flex>
        )}
        <Flex alignItems="center">
          {highestBid && (
            <>
              <Text color="text-02" textStyle="detail" mr={1}>
                {t("Top Offer")}
              </Text>
              <HighestBidCurrencyIcon boxSize={5} width="10px" height="20px" mr={1} />
              <Text textStyle="detail" bold>
                {formatToSignificant(highestBid.price, 4)}
              </Text>
              <Divider orientation="vertical" borderColor="border-02" alignSelf="stretch" height="24px" mx={3} />
            </>
          )}
          {lastOrder && (
            <Flex alignItems="center" justifyContent="center">
              <Text color="text-02" textStyle="detail" mr={1}>
                {t("Last")}
              </Text>
              {LastOrderIcon && <LastOrderIcon boxSize={5} width="10px" height="20px" mr={1} />}
              <Text bold textStyle="detail">
                {formatToSignificant(lastOrder.price, 4)}
              </Text>
            </Flex>
          )}
        </Flex>
      </Box>
      <Box ref={ref}>
        {tokenOwnersQuery.isSuccess && (
          <NftOwnerDetails erc721owner={tokenOwnersQuery.data[0]} isErc1155={isErc1155} countOwners={countOwners} />
        )}
        {tokenOwnersQuery.isLoading && (
          <Flex flexDir="column">
            <Skeleton m={4} height="20px" width="92px" />
            <Skeleton height="48px" width="100%" />
          </Flex>
        )}
        {tokenOwnersQuery.isSuccess &&
          (nft.collection.type === "ERC1155" || !isAddressOneOfOwners(account, tokenOwnersQuery.data)) && (
            <Flex width="100%" justifyContent="flex-end">
              {account ? (
                <>
                  <BuyNowButton
                    tokenId={tokenId}
                    tokenName={name}
                    tokenImage={image}
                    collectionName={collection.name}
                    collectionAddress={collection.address}
                    collectionType={collection.type}
                    tokenAsk={ask}
                    isVerified={collection.isVerified}
                    buttonProps={{ flex: 0.5, width: "100%", square: true }}
                  />
                  <MakeOfferButton
                    tokenId={tokenId}
                    tokenName={name}
                    tokenImage={image}
                    collectionAddress={collection.address}
                    collectionName={collection.name}
                    isVerified={collection.isVerified}
                    bids={bids}
                    ask={ask}
                    flex={0.5}
                    square
                  />
                </>
              ) : (
                <ConnectWalletButton flex="0.5" square />
              )}
            </Flex>
          )}
      </Box>
    </Box>
  );
});
