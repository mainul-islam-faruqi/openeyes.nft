import { BigNumber } from "ethers";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { AlertDescription, AlertTitle, Box, Flex, IconButton, Stack, useBreakpointValue } from "@chakra-ui/react";
import { Alert, Button, CloseIcon } from "uikit";
import { AuthorizedActionButton } from "components/Modals/SignInModal/AuthorizedActionButton";

export const SignInAlert = ({ onAuthSuccess }: { onAuthSuccess: (jwt?: string) => void }) => {
  const { t } = useTranslation();

  return (
    <Alert status="info" variant="left-accent-contrast" sx={{ svg: { alignSelf: "center" } }}>
      <Flex width="100%" justifyContent="space-between" alignItems="center">
        <AlertTitle>{t("Sign in to check for invalid orders")}</AlertTitle>
        <Box>
          <AuthorizedActionButton onAuthSuccess={onAuthSuccess} colorScheme="gray">
            {t("Sign in")}
          </AuthorizedActionButton>
        </Box>
      </Flex>
    </Alert>
  );
};

interface ActionRequiredProps {
  handleDismiss: () => void;
}

export const ActionRequiredAlert = ({ handleDismiss }: ActionRequiredProps) => {
  const { t } = useTranslation();

  const title = useBreakpointValue({
    base: t("Action required"),
    sm: t("Action required: Review hidden offers/listings"),
  });

  return (
    <Alert
      status="warning"
      constrain={true}
      py={{ base: 0, xs: 3 }}
      pr={0}
      pl={0}
      alertIconProps={{ alignSelf: "center", mr: 3 }}
    >
      <Flex alignItems="center" justifyContent="space-between" width="100%">
        <AlertTitle>{title}</AlertTitle>
        <Stack
          spacing={2}
          direction={{ base: "column", sm: "row" }}
          alignItems={{ base: "flex-end", sm: "center" }}
          justifyContent="flex-end"
        >
          <Link href="/accounts/review-orders">
            <a>
              <Button square>{t("Review issues")}</Button>
            </a>
          </Link>
          <IconButton
            onClick={handleDismiss}
            aria-label={t("Close banner")}
            size="xs"
            variant="ghost"
            colorScheme="gray"
          >
            <CloseIcon />
          </IconButton>
        </Stack>
      </Flex>
    </Alert>
  );
};

export const ActionRequiredAlertNarrow = () => {
  const { t } = useTranslation();

  return (
    <Alert status="warning" constrain={false} py={0} pr={0} pl={3} alertIconProps={{ alignSelf: "center", mr: 2 }}>
      <Flex alignItems="center" justifyContent="space-between" width="100%">
        <AlertTitle>{t("Action required")}</AlertTitle>
        <Stack
          spacing={2}
          direction={{ base: "column", sm: "row" }}
          alignItems={{ base: "flex-end", sm: "center" }}
          justifyContent="flex-end"
        >
          <Link href="/accounts/review-orders">
            <a>
              <Button square>{t("Review issues")}</Button>
            </a>
          </Link>
        </Stack>
      </Flex>
    </Alert>
  );
};

export const WethRevokedAlert = ({ allowance }: { allowance: BigNumber }) => {
  const { t } = useTranslation();
  const isAllowanceZero = allowance.isZero();

  return (
    <Alert status="error">
      <Box>
        <AlertTitle mb={{ base: 4, sm: 0 }}>
          {isAllowanceZero
            ? t("Action required: all outgoing offers hidden")
            : t("Action required: outgoing offers hidden ")}
        </AlertTitle>
        <AlertDescription>
          {isAllowanceZero
            ? t("WETH spending has been revoked. Re-enable WETH spending then revalidate your offers.")
            : t("WETH spend approval is lower than required. Re-enable WETH spending then revalidate your offers.")}
        </AlertDescription>
      </Box>
    </Alert>
  );
};

export const HiddenOffersAlert = () => {
  const { t } = useTranslation();

  return (
    <Alert sx={{ svg: { alignSelf: "center" } }} status="warning">
      <AlertDescription mt={0}>
        {t("Even hidden offers may still be accepted. Cancel all unwanted offers.")}
      </AlertDescription>
    </Alert>
  );
};
