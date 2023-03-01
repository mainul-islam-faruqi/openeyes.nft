import { Box, BoxProps, Flex } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useWeb3React } from "@web3-react/core";
import { UseQueryResult } from "react-query";
import { getCurrencyConfig } from "config/currencies";
import { formatToSignificant } from "utils/format";
import { isAddressEqual, isAddressOneOfOwners } from "utils/guards";
import { Text, RainbowText } from "uikit";
import { NFT, TokenOwner } from "types/graphql";
import { MakerOrderWithSignatureAndHash } from "types/orders";
import { BuyNowButton, MakeOfferButton } from "components/Buttons";

export interface NftDetailScrollMenuProps extends BoxProps {
  nft: NFT;
  isOpen: boolean;
  tokenOwnersQuery: UseQueryResult<TokenOwner[]>;
  highestBid?: MakerOrderWithSignatureAndHash;
  price?: string;
}

export const NftDetailScrollMenu = ({
  nft,
  price,
  highestBid,
  isOpen,
  tokenOwnersQuery,
  ...props
}: NftDetailScrollMenuProps) => {
  const { t } = useTranslation();
  const { account } = useWeb3React();
  const { ask, bids, collection, tokenId, name, image } = nft;
  const isErc1155 = nft.collection.type === "ERC1155";

  const topOfferPrice = highestBid?.price ? formatToSignificant(highestBid.price, 4) : "";
  const AskCurrencyIcon = ask && getCurrencyConfig(ask.currency, true).icon;
  const HighestBidCurrencyIcon = highestBid && getCurrencyConfig(highestBid.currency).icon;

  return (
    <Box
      height={20}
      overflow="hidden"
      position={{ base: "fixed", lg: "sticky" }}
      bottom={0}
      left={0}
      pointerEvents={isOpen ? "auto" : "none"}
      pt={isOpen ? 0 : 20}
      transition="padding-top 300ms ease"
      width="100%"
      zIndex="docked"
      {...props}
    >
      <Box as="span">
        <Flex
          borderTop="1px solid"
          borderTopColor="border-02"
          width="100%"
          bg="ui-02"
          height={20}
          justifyContent="space-between"
          alignItems="center"
          px={4}
        >
          <Box>
            {price && (
              <Flex alignItems="center" mb={highestBid ? 2 : 0}>
                <Text textStyle="detail" color="text-02" mr={2}>
                  {t("Price")}
                </Text>
                {AskCurrencyIcon && <AskCurrencyIcon boxSize={5} width="10px" height="20px" mr={1} />}
                <Text textStyle="detail" bold>
                  {price}
                </Text>
              </Flex>
            )}
            {highestBid && (
              <Flex alignItems="center">
                <Text textStyle="detail" color="text-02" mr={2}>
                  {t("Top Offer")}
                </Text>
                {HighestBidCurrencyIcon && <HighestBidCurrencyIcon boxSize={5} width="10px" height="20px" mr={1} />}
                <Text textStyle="detail" bold>
                  {topOfferPrice}
                </Text>
                {account && isAddressEqual(highestBid.signer, account) && (
                  <RainbowText textStyle="detail" ml={1} bold>{`(${t("You")})`}</RainbowText>
                )}
              </Flex>
            )}
          </Box>
          {account &&
            tokenOwnersQuery.isSuccess &&
            (!isAddressOneOfOwners(account, tokenOwnersQuery.data) || isErc1155) && (
              <Flex>
                {ask && (
                  <BuyNowButton
                    tokenId={tokenId}
                    tokenName={name}
                    tokenImage={image}
                    collectionName={collection.name}
                    collectionAddress={collection.address}
                    collectionType={collection.type}
                    tokenAsk={ask}
                    isVerified={collection.isVerified}
                  />
                )}
                <MakeOfferButton
                  tokenId={tokenId}
                  tokenName={name}
                  tokenImage={image}
                  collectionAddress={collection.address}
                  collectionName={collection.name}
                  isVerified={collection.isVerified}
                  bids={bids}
                  ask={ask}
                />
              </Flex>
            )}
        </Flex>
      </Box>
    </Box>
  );
};
