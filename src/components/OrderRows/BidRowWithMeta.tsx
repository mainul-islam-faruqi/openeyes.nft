import { useState } from "react";
import NextLink from "next/link";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { useWeb3React } from "@web3-react/core";
import { Flex, Grid, GridProps, Box, Link as ChakraLink, useDisclosure } from "@chakra-ui/react";
import { formatDistanceToNowStrict } from "date-fns";
import { addresses, STRATEGIES_ADDRESS } from "config";
import { Popover, TooltipText, Text, WethHalfIcon } from "uikit";
import { formatToSignificant, formatTimestampAsDateString, formatNumberToLocale } from "utils/format";
import { MakerOrderCollectionMeta, MakerOrderTokenMeta } from "utils/graphql";
import { getFloorPricePercentDifference, useFloorPriceText } from "utils/floorPricePercentHelpers";
import { isAddressEqual } from "utils/guards";
import { timestampInMs } from "utils/date";
import { revalidateBid } from "utils/graphql/revalidateBid";
import { TokenOwner } from "types/graphql";
import { MakerOrderWithSignatureAndHash } from "types/orders";
import { erc20Keys, useGetAllowance } from "hooks/calls/useErc20";
import { useWethBalance } from "hooks/useTokenBalance";
import { useToast } from "hooks/useToast";
import { ordersKeys } from "hooks/graphql/orders";
import ApproveWethModal from "components/Modals/ApproveWethModal";
import { ActivityAddress, HiddenOrderTag } from "components/Activity";
import { CancelOrdersButton, TextButton } from "components/Buttons";
import { Avatar } from "components/Avatar";
import RevalidateOneButton from "components/Buttons/RevalidateOneButton";

interface Props extends GridProps {
  signer: MakerOrderWithSignatureAndHash["signer"];
  startTime: MakerOrderWithSignatureAndHash["startTime"];
  endTime: MakerOrderWithSignatureAndHash["endTime"];
  price: MakerOrderWithSignatureAndHash["price"];
  nonce: MakerOrderWithSignatureAndHash["nonce"];
  strategy: MakerOrderWithSignatureAndHash["strategy"];
  hash: MakerOrderWithSignatureAndHash["hash"];
  name: string;
  collection: MakerOrderCollectionMeta;
  token?: MakerOrderTokenMeta;
  imageSrc?: string;
  erc721Owner?: TokenOwner;
  isStale?: boolean;
}

export const BidRowWithMeta: React.FC<Props> = ({
  signer,
  startTime,
  endTime,
  price,
  nonce,
  strategy,
  hash,
  name,
  collection,
  token,
  imageSrc,
  erc721Owner,
  isStale,
  ...props
}) => {
  const { account } = useWeb3React();
  const { t } = useTranslation();
  const toast = useToast();
  const wethApprovalModalDisclosure = useDisclosure();
  const queryClient = useQueryClient();
  const [isRevalidating, setIsRevalidating] = useState(false);
  const isConnectedAccountSigner = isAddressEqual(account, signer);
  const isCollectionOrder = isAddressEqual(strategy, STRATEGIES_ADDRESS.collection);

  const wethAllowanceQuery = useGetAllowance(addresses.WETH, account!, addresses.EXCHANGE, {
    enabled: isStale && !!account,
  });
  const wethBalanceQuery = useWethBalance(account!, { enabled: isStale && !!account });
  const hasSufficientWethAllowance = wethAllowanceQuery.isSuccess && wethAllowanceQuery.data.gt(price);
  const hasSufficientWethBalance = wethBalanceQuery.isSuccess && wethBalanceQuery.data.gt(price);

  const href = isCollectionOrder
    ? `/collections/${collection.address}`
    : `/collections/${collection.address}/${token ? token.tokenId : ""}`;

  const startTimeMs = timestampInMs(startTime);
  const endTimeMs = timestampInMs(endTime);

  const { floorDiffPercentString, floorDiffPercentBn } =
    (collection?.floorOrder?.price && getFloorPricePercentDifference(collection?.floorOrder.price, price)) || {};
  const floorPriceDifferenceText = useFloorPriceText(floorDiffPercentString, floorDiffPercentBn);

  const handleRevalidate = async () => {
    setIsRevalidating(true);
    if (account) {
      const res = await revalidateBid(account, hash);
      setIsRevalidating(false);
      if (res.success) {
        toast({
          title: t("Offer Revalidated"),
          description: t("Your offer is now active again."),
        });
        queryClient.invalidateQueries(erc20Keys.allowance(addresses.WETH, account, addresses.EXCHANGE));
        queryClient.invalidateQueries(ordersKeys.staleOrders({}));
        queryClient.invalidateQueries(ordersKeys.ordersWithMeta({}));
      } else {
        toast({
          status: "error",
          title: t("Error"),
          description: res.message,
        });
      }
    }
  };

  return (
    <>
      <ApproveWethModal
        isOpen={wethApprovalModalDisclosure.isOpen}
        onClose={wethApprovalModalDisclosure.onClose}
        onConfirm={handleRevalidate}
      />
      <Grid
        gridTemplateColumns="48px 1fr auto"
        gridTemplateRows="auto auto auto"
        gridTemplateAreas={{ base: "'a b c' 'd d d' 'e e e'", md: "'a b c' 'a d c' 'a e c'" }}
        gridRowGap={3}
        gridColumnGap={4}
        borderLeftWidth={isStale ? "4px" : "0"}
        borderLeftColor="support-warning"
        borderBottomWidth="1px"
        borderBottomColor="border-01"
        px={4}
        py={6}
        {...props}
      >
        {/* AVATAR */}
        <Box gridArea="a" opacity={isStale ? 0.5 : 1}>
          <NextLink href={href}>
            <a>
              <Avatar address={name} src={imageSrc} size={48} boxProps={{ borderRadius: 0 }} />
            </a>
          </NextLink>
        </Box>
        {/* FLOOR PRICE */}
        <Flex
          gridArea="b"
          justifyContent={{ base: "space-between", md: "initial" }}
          alignItems={{ base: "auto", md: "center" }}
          flexDirection={{ base: "column", md: "row" }}
        >
          <Flex mr={{ md: 3 }} mb={{ base: 3, md: 0 }}>
            <WethHalfIcon boxSize={14} width="10px" height="20px" mr={1} />
            <Text color={isStale ? "text-03" : "text-01"} bold textStyle="detail">
              {formatToSignificant(price, 4)}
            </Text>
          </Flex>
          {isStale && (
            <Box>
              <HiddenOrderTag mr={{ md: 3 }} mb={{ base: 3, md: 0 }} />
            </Box>
          )}
          {floorPriceDifferenceText && (
            <Text color="text-03" textStyle="detail">
              {floorPriceDifferenceText}
            </Text>
          )}
        </Flex>
        {/* BUTTONS */}
        <Box gridArea="c">
          {isConnectedAccountSigner && isStale && wethAllowanceQuery.isSuccess && wethBalanceQuery.isSuccess && (
            <RevalidateOneButton
              disabled={!hasSufficientWethBalance}
              wethBalance={wethBalanceQuery.data}
              isLoading={isRevalidating || wethApprovalModalDisclosure.isOpen}
              onAuthSuccess={hasSufficientWethAllowance ? handleRevalidate : wethApprovalModalDisclosure.onOpen}
              mr={0.5}
              borderRadius={0}
            />
          )}
          {isConnectedAccountSigner && (
            <CancelOrdersButton variant="solid" colorScheme="gray" square nonces={[nonce]} />
          )}
        </Box>
        {/* TOKEN NAME */}
        <NextLink href={href} passHref>
          <ChakraLink lineHeight={1} width="fit-content">
            <TextButton gridArea="d" colorScheme="gray" variant="ghost">
              <Text color={isStale ? "text-03" : "text-01"} textStyle="detail" bold isTruncated>
                {name}
              </Text>
            </TextButton>
          </ChakraLink>
        </NextLink>
        {/* FROM / TO */}
        <Flex
          gridArea="e"
          alignItems={{ base: "flex-start", md: "center" }}
          flexDirection={{ base: "column", md: "row" }}
        >
          <Flex mb={{ base: 3, md: 0 }}>
            {!isConnectedAccountSigner && <ActivityAddress label={t("From")} address={signer} />}
            {erc721Owner && !isCollectionOrder && <ActivityAddress label={t("To")} address={erc721Owner.address} />}
            {isCollectionOrder && (
              <Flex mr={4}>
                <Text textStyle="detail" color="text-03" mr={2}>
                  {t("to")}
                </Text>
                <Text textStyle="detail" color="text-02" bold>
                  {t("{{totalSupply}} items", {
                    totalSupply: collection.totalSupply ? formatNumberToLocale(collection.totalSupply, 0, 0) : "-",
                  })}
                </Text>
              </Flex>
            )}
          </Flex>
          {/* DATESTAMPS */}
          <Flex>
            <Popover label={<TooltipText>{formatTimestampAsDateString(endTimeMs)}</TooltipText>}>
              <Text textStyle="detail" color="text-03" mr={2}>
                {formatDistanceToNowStrict(startTimeMs, { addSuffix: true })}
              </Text>
            </Popover>
            <Popover label={<TooltipText>{formatTimestampAsDateString(endTimeMs)}</TooltipText>}>
              <Text textStyle="detail" color="text-03">
                {t("Expiring {{timeUntilExpiry}}", {
                  timeUntilExpiry: formatDistanceToNowStrict(endTimeMs, { addSuffix: true }),
                })}
              </Text>
            </Popover>
          </Flex>
        </Flex>
      </Grid>
    </>
  );
};

BidRowWithMeta.defaultProps = {
  backgroundColor: "ui-01",
};
