// import React, { useEffect } from "react";
// import { useWeb3React } from "@web3-react/core";
// import { Box, useDisclosure } from "@chakra-ui/react";
// import { getLocalStorageItem, setLocalStorageItem } from "utils/localStorage";
// import { useQueryClientListener } from "hooks/useQueryClientListener";
// import { navHeightResponsive } from "uikit/theme/global";
// import { OnboardingModal } from "components/Modals/OnboardingModal";
// import ErrorBoundary from "components/ErrorBoundary";
// import { LOCAL_STORAGE_HAS_ALREADY_SOLD } from "config";
// import { Nav, NavProps } from "../Nav";
// import Footer from "../Nav/Footer";




import React, { useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { Box, useDisclosure } from "@chakra-ui/react";
import { getLocalStorageItem, setLocalStorageItem } from "utils/localStorage";
import { useQueryClientListener } from "hooks/useQueryClientListener";
import { navHeightResponsive } from "uikit/theme/global";
import { OnboardingModal } from "../Modals/OnboardingModal";
import ErrorBoundary from "../ErrorBoundary";
import { LOCAL_STORAGE_HAS_ALREADY_SOLD } from "config/localStorage";
import { Nav, NavProps } from "../Nav";
import Footer from "../Nav/Footer";





export interface PageProps {
  navProps?: NavProps;
  children?: any
}

const Page: React.FC<PageProps> = ({ navProps, children }) => {
  const { account } = useWeb3React();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Reset all React Queries when account changes
  useQueryClientListener();

  useEffect(() => {
    if (account) {
      const hasSoldSomething = getLocalStorageItem(LOCAL_STORAGE_HAS_ALREADY_SOLD);
      if (!hasSoldSomething) {
        onOpen();
        setLocalStorageItem(LOCAL_STORAGE_HAS_ALREADY_SOLD, 1);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  return (
    <ErrorBoundary>
      <OnboardingModal isOpen={isOpen} onClose={onClose} />
      <Nav {...navProps} />
      <Box transition="margin-top" transitionDuration="300ms" mt={navHeightResponsive} bg="ui-bg">
        {children}
      </Box>
      <Footer />
    </ErrorBoundary>
  );
};

export default Page;
