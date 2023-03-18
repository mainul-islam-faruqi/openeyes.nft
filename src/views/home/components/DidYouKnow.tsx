import { useState } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { Flex, Box } from "@chakra-ui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Text, Button } from "uikit";
import { ExternalLink } from "uikit/Link/Link"
import DidYouKnowSlide from "./DidYouKnowSlide";
import { useWeb3React } from "@web3-react/core";

import "swiper/css";
import SwiperControl from "./SwiperControl";

const DidYouKnowHeading: React.FC<any> = ({ children }) => (
  <Text pb={{ base: 8, md: 0 }} color="gray.900" bold textStyle="display-02">
    {children}
  </Text>
);

// DidYouKnow uses some forced dark-mode colors, not responsive
const DidYouKnow: React.FC = () => {
  const { account } = useWeb3React();
  const { t } = useTranslation();
  const [swiperRef, setSwiperRef] = useState<SwiperCore>();

  const buttonProps = {
    sx: {
      border: "1px solid black",

      _hover: {
        bg: "rgba(0, 0, 0, 0.12)",
      },
    },
    variant: "ghost",
    colorScheme: "black",
  };

  return (
    <Flex flexDirection="column">
      <Text pb={16} bold color="gray.900">
        {t("👀 Did you know?")}
      </Text>
      <Box mb={12}>
        <Swiper loop slidesPerView={1} speed={600} onSwiper={setSwiperRef}>
          <SwiperSlide>
            <DidYouKnowSlide
              leftElement={<DidYouKnowHeading>{t("Trading fees are 20% lower than OpenSea.")}</DidYouKnowHeading>}
              rightElement={
                <Flex flexDirection="column">
                  <Text pb={8} color="gray.900">
                    {t(
                      "… and when you also earn rewards for trading on OpenEyes.nft, why would you want to trade anywhere else?"
                    )}
                  </Text>
                  {account && (
                    <Box>
                      <Link href={`/accounts/${account}`} passHref>
                        <Button {...buttonProps} as="a">
                          {t("List Your NFTs")}
                        </Button>
                      </Link>
                    </Box>
                  )}
                </Flex>
              }
            />
          </SwiperSlide>
          <SwiperSlide>
            <DidYouKnowSlide
              leftElement={
                <DidYouKnowHeading>{t("You can list NFTs here, and elsewhere... at the same time.")}</DidYouKnowHeading>
              }
              rightElement={
                <Flex flexDirection="column">
                  <Text pb={8} color="gray.900">
                    {t("...and when you get rewards for trading with OpenEyes.nft, why would you trade anywhere else?")}
                  </Text>
                  {account && (
                    <Box>
                      <Link href={`/accounts/${account}`} passHref>
                        <Button {...buttonProps} as="a">
                          {t("List Your NFTs")}
                        </Button>
                      </Link>
                    </Box>
                  )}
                </Flex>
              }
            />
          </SwiperSlide>
          <SwiperSlide>
            <DidYouKnowSlide
              leftElement={
                <DidYouKnowHeading>
                  {t("Collection Offers let you bid on a whole collection at once.")}
                </DidYouKnowHeading>
              }
              rightElement={
                <Flex flexDirection="column">
                  <Text pb={8} color="gray.900">
                    {t("You know you want a Cryptoad and you don’t care which one.")}
                  </Text>
                  <Text pb={8} color="gray.900">
                    {t("Bid on them all. !vibe")}
                  </Text>
                  <Box>
                    <Link href={`/collections`} passHref>
                      <Button {...buttonProps} as="a">
                        {t("Browse Collections")}
                      </Button>
                    </Link>
                  </Box>
                </Flex>
              }
            />
          </SwiperSlide>
          <SwiperSlide>
            <DidYouKnowSlide
              leftElement={
                <DidYouKnowHeading>{t("100% of trading fees: LOOKS stakers earn 'em daily.")}</DidYouKnowHeading>
              }
              rightElement={
                <Flex flexDirection="column">
                  <Text pb={8} color="gray.900">
                    {t("LOOKS tokens in active staking earn both WETH from trading fees and more LOOKS tokens!")}
                  </Text>
                  <Box>
                    <Link href={`/rewards`} passHref>
                      <Button {...buttonProps} as="a">
                        {t("Start Earning")}
                      </Button>
                    </Link>
                  </Box>
                </Flex>
              }
            />
          </SwiperSlide>
          <SwiperSlide>
            <DidYouKnowSlide
              leftElement={<DidYouKnowHeading>{t("Creator royalties are paid instantly!")}</DidYouKnowHeading>}
              rightElement={
                <Flex flexDirection="column">
                  <Text pb={8} color="gray.900">
                    {t("Royalties are paid out per transaction, so no more waiting around.")}
                  </Text>
                  <Box>
                    <Button
                      {...buttonProps}
                      as={ExternalLink}
                      href={`https://docs.looksrare.org/guides/faqs/what-are-royalties`}
                    >
                      {t("Learn More")}
                    </Button>
                  </Box>
                </Flex>
              }
            />
          </SwiperSlide>
          <SwiperSlide>
            <DidYouKnowSlide
              leftElement={<DidYouKnowHeading>{t("Buy NFTs with ETH, WETH, or a mix of both!")}</DidYouKnowHeading>}
              rightElement={
                <Flex flexDirection="column">
                  <Text pb={8} color="gray.900">
                    {t(
                      "Don’t have enough ETH or WETH to cover your buy? You can combine your balances at checkout. Easy."
                    )}
                  </Text>
                  <Box>
                    <Link href={`/collections`} passHref>
                      <Button {...buttonProps} as="a">
                        {t("Explore Collections")}
                      </Button>
                    </Link>
                  </Box>
                </Flex>
              }
            />
          </SwiperSlide>
        </Swiper>
      </Box>
      <SwiperControl handleLeftClick={() => swiperRef?.slidePrev()} handleRightClick={() => swiperRef?.slideNext()} />
    </Flex>
  );
};

export default DidYouKnow;
