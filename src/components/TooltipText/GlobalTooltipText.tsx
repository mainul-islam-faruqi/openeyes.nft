import { ReactNode } from "react";
import { Divider } from "@chakra-ui/react";
import { LogoRoundIcon, OpenSeaIcon, Text, TooltipText } from "uikit";
import { PlatformLabel, PlatformRow } from "./shared";
import { useTranslation } from "next-i18next";
import { formatToSignificant } from "utils/format";
import { BigNumber } from "ethers";

interface GlobalTooltipTextProps {
  titleText?: ReactNode;
  amountLr: string;
  textLr: string;
  amountOs?: string;
  textOs?: string;
}

export const GlobalTooltipText = ({ titleText, textLr, amountLr, textOs, amountOs }: GlobalTooltipTextProps) => (
  <TooltipText>
    {titleText && (
      <>
        <Text as="p" textStyle="detail" color="currentcolor">
          {titleText}
        </Text>
        <Divider my={4} />
      </>
    )}
    <PlatformRow amount={amountLr}>
      <PlatformLabel icon={LogoRoundIcon}>{textLr}</PlatformLabel>
    </PlatformRow>
    {amountOs && (
      <PlatformRow mt={1} amount={amountOs}>
        <PlatformLabel icon={OpenSeaIcon}>{textOs}</PlatformLabel>
      </PlatformRow>
    )}
  </TooltipText>
);

export const FloorTooltipText = ({
  hideTitle = false,
  amountLr,
  amountOs,
}: {
  hideTitle?: boolean;
  amountLr: BigNumber;
  amountOs: BigNumber;
}) => {
  const { t } = useTranslation();
  return (
    <GlobalTooltipText
      titleText={hideTitle ? undefined : t("Lowest cross-marketplace floor price")}
      textLr={t("Floor on {{platform}}", { platform: "LooksRare" })}
      amountLr={formatToSignificant(amountLr, 4)}
      textOs={amountOs && t("Floor on {{platform}}", { platform: "OpenSea" })}
      amountOs={amountOs && formatToSignificant(amountOs, 4)}
    />
  );
};
