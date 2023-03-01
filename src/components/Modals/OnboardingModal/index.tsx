import React, { useState } from "react";
import { Progress, Box, Flex } from "@chakra-ui/react";
import { useTranslation, Trans } from "react-i18next";
import {
  Link,
  Modal,
  ModalFooterGrid,
  ModalBody,
  Button,
  Text,
  Popover,
  Checkbox,
  HelpIcon,
  ArrowRightIcon,
  WethIcon,
  WethHalfIcon,
  EthIcon,
  DoubleArrowIcon,
  TooltipText,
} from "uikit";
import { ModalProps } from "uikit/Modal/Modal"

import { LooksLogoBanner } from "../../Svg/LooksLogoBanner";

const baseFlexHeaderProps = {
  maxWidth: "360px",
  width: "100%",
  height: "128px",
};
const HeaderViews = [
  () => (
    <Flex {...baseFlexHeaderProps}>
      <LooksLogoBanner boxSize="100%" />
    </Flex>
  ),
  () => (
    <Flex {...baseFlexHeaderProps} backgroundColor="black" justifyContent="end" overflow="hidden">
      <WethHalfIcon boxSize="180px" />
    </Flex>
  ),
  () => (
    <Flex
      {...baseFlexHeaderProps}
      backgroundColor="black"
      justifyContent="center"
      alignItems="center"
      overflow="hidden"
    >
      <WethIcon boxSize="150px" marginTop="-90px" />
      <DoubleArrowIcon boxSize="40px" />
      <EthIcon boxSize="150px" marginBottom="-50px" />
    </Flex>
  ),
];

const BodyViews = [
  // First view (Terms of Service)
  () => {
    const { t } = useTranslation();
    return (
      <>
        <Text bold textStyle="display-body" pb={6}>
          {t("Welcome to LooksRare!")}
        </Text>
        <Text textStyle="body" color="text-02" pb={2}>
          {t("By using LooksRare, you agree to the")}{" "}
          <Link isExternal fontWeight="bold" href="https://docs.looksrare.org/about/terms-of-service">
            {t("Terms of Service.")}
          </Link>
        </Text>
      </>
    );
  },
  // Second view (WETH and ETH)
  () => {
    const { t } = useTranslation();
    return (
      <>
        <Trans i18nKey="translateFirstTimeSellWethWarning">
          <Text color="text-02" textStyle="detail" mb={6}>
            If someone buys an item from you on LooksRare,
          </Text>
          <Text bold textStyle="heading-04">
            you receive payment in{" "}
          </Text>
          <Text bold textStyle="heading-04" mb={7}>
            <Box as="span" color="text-error">
              WETH
            </Box>
            , not ETH.
          </Text>
        </Trans>
        <Popover
          placement="top"
          label={
            <TooltipText>
              {t(
                "WETH is Wrapped ETH. It's basically ETH that’s made to work better with smart contracts used by decentralized applications (like LooksRare!)"
              )}
            </TooltipText>
          }
        >
          <Flex alignItems="center">
            <HelpIcon mr={2} />
            <Text bold>{t("What’s WETH?")}</Text>
          </Flex>
        </Popover>
      </>
    );
  },
  // Third view (Swap)
  () => {
    const { t } = useTranslation();
    return (
      <>
        <Trans i18nKey="transFirstTimeSellWethSwaps">
          <Text mb={6} mt={1}>
            You can swap WETH to ETH any time from the{" "}
            <Text as="span" bold>
              profile/wallet icon
            </Text>{" "}
            in the menu.
          </Text>
        </Trans>
        <Text>{t("You’ll only pay a transaction fee each time you swap.")}</Text>
      </>
    );
  },
];

const labelRight = ["Let's go", "Got it", "Let's go"];

export const OnboardingModal: React.FC<Pick<ModalProps, "isOpen" | "onClose">> = (props) => {
  const { t } = useTranslation();
  const [viewIndex, setViewIndex] = useState(0);
  const [tosAgreed, setTosAgreed] = useState(false);

  const BodyView = BodyViews[viewIndex];
  const HeaderView = HeaderViews[viewIndex];
  const progress = [0, 50, 100];
  const isTosStep = viewIndex === 0;
  const isLastStep = viewIndex >= BodyViews.length - 1;

  const onClickNext = () => {
    if (isLastStep) {
      props.onClose();
    } else {
      setViewIndex((prev) => prev + 1);
    }
  };

  return (
    <Modal
      variant="rainbow"
      size="sm"
      hideHeader={isTosStep}
      modalContentProps={{ borderWidth: 0 }}
      closeOnOverlayClick={false}
      {...props}
    >
      <HeaderView />
      {!isTosStep && <Progress value={progress[viewIndex]} />}
      <ModalBody pb={12}>
        {BodyView && (
          <>
            <BodyView />
            {isTosStep && (
              <Checkbox isChecked={tosAgreed} onChange={() => setTosAgreed((prev) => !prev)} mt={6}>
                {t("I agree")}
              </Checkbox>
            )}
          </>
        )}
      </ModalBody>
      <ModalFooterGrid>
        {viewIndex === 0 ? (
          <div />
        ) : (
          <Button
            tabIndex={1}
            variant="tall"
            colorScheme="gray"
            isFullWidth
            onClick={() => setViewIndex((prev) => prev - 1)}
          >
            {t("Back")}
          </Button>
        )}
        <Button
          tabIndex={viewIndex === 0 ? 1 : 2}
          variant="tall"
          isFullWidth
          onClick={onClickNext}
          disabled={isTosStep && !tosAgreed}
          rightIcon={isLastStep ? <ArrowRightIcon /> : undefined}
        >
          {t(labelRight[viewIndex])}
        </Button>
      </ModalFooterGrid>
    </Modal>
  );
};
