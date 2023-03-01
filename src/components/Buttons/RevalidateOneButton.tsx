// import { Box, IconButton } from "@chakra-ui/react";
// import { useTranslation } from "next-i18next";
// import { formatToSignificant } from "utils/format";
// import { BigNumber } from "ethers";
// import { Popover, ResetIcon, TooltipText } from "uikit";
// import { AuthorizedActionButton, AuthorizedActionButtonProps } from "components/Modals/SignInModal";



import { Box, IconButton } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { formatToSignificant } from "utils/format";
import { BigNumber } from "ethers";
import Popover from "uikit/Popover/Popover";
import { ResetIcon } from "uikit";
import { TooltipText } from "uikit/Text/Text";
import { AuthorizedActionButton, AuthorizedActionButtonProps } from "../Modals/SignInModal/AuthorizedActionButton";



interface Props extends AuthorizedActionButtonProps {
  wethBalance: BigNumber;
}

const RevalidateOneButton: React.FC<Props> = ({ wethBalance, onAuthSuccess, disabled, ...props }) => {
  const { t } = useTranslation();

  if (disabled) {
    return (
      <Popover
        label={
          <Box>
            <TooltipText>{t("Insufficient {{currency}}", { currency: "WETH" })}</TooltipText>
            <TooltipText>
              {t("Your balance: {{balance}} {{currency}}", {
                currency: "WETH",
                balance: formatToSignificant(wethBalance, 4),
              })}
            </TooltipText>
          </Box>
        }
      >
        <Box display="inline">
          <AuthorizedActionButton
            as={IconButton}
            disabled={disabled}
            onAuthSuccess={onAuthSuccess}
            aria-label={t("Revalidate order button")}
            {...props}
          >
            <ResetIcon />
          </AuthorizedActionButton>
        </Box>
      </Popover>
    );
  }

  return (
    <AuthorizedActionButton
      as={IconButton}
      onAuthSuccess={onAuthSuccess}
      disabled={disabled}
      aria-label={t("Revalidate order button")}
      {...props}
    >
      <ResetIcon />
    </AuthorizedActionButton>
  );
};

export default RevalidateOneButton;
