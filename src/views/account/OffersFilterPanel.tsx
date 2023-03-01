import { useState } from "react";
import { Box, ButtonGroup } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { FilterLayoutTopbar } from "components/Layout/FilterLayout";
import { Container } from "components/Layout/Container";
import { SwitchButton } from "components/Buttons";
import OffersMade from "./components/OffersMade";
import { OffersReceived } from "./components/OffersReceived";

interface OffersFilterPanelProps {
  address: string;
}

enum View {
  received,
  made,
}

export const OffersFilterPanel: React.FC<OffersFilterPanelProps> = ({ address }) => {
  const { t } = useTranslation();
  const [activeSwitchIndex, setActiveSwitchIndex] = useState(View.received);

  return (
    <Box position="relative">
      <FilterLayoutTopbar>
        <Box maxWidth={{ sm: "320px" }}>
          <ButtonGroup width="100%" isAttached>
            <SwitchButton
              onClick={() => setActiveSwitchIndex(View.received)}
              isActive={activeSwitchIndex === View.received}
              size="sm"
            >
              {t("Received")}
            </SwitchButton>
            <SwitchButton
              onClick={() => setActiveSwitchIndex(View.made)}
              isActive={activeSwitchIndex === View.made}
              size="sm"
            >
              {t("Made")}
            </SwitchButton>
          </ButtonGroup>
        </Box>
      </FilterLayoutTopbar>

      {/* Panel Content */}
      <Container px={0}>
        {activeSwitchIndex === View.received && <OffersReceived address={address} />}
        {activeSwitchIndex === View.made && <OffersMade address={address} />}
      </Container>
    </Box>
  );
};
