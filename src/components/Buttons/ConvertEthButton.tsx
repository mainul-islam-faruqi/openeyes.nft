// import { useTranslation } from "react-i18next";
// import { useDisclosure } from "@chakra-ui/react";
// import { useWeb3React } from "@web3-react/core";
// import { Button } from "uikit";
// import { ConvertEthModal } from "components/Modals/ConvertEthModal";



import { useTranslation } from "react-i18next";
import { useDisclosure } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { Button } from "uikit/Button/Button";
import { ConvertEthModal } from "../Modals/ConvertEthModal";




export const ConvertEthButton = () => {
  const { t } = useTranslation();
  const transactionDisclosure = useDisclosure();
  const { account } = useWeb3React();

  if (!account) {
    return null;
  }

  return (
    <>
      <ConvertEthModal
        isOpen={transactionDisclosure.isOpen}
        onClose={transactionDisclosure.onClose}
        account={account}
      />
      <Button variant="ghost" onClick={transactionDisclosure.onOpen}>
        {t("Convert ETH/WETH")}
      </Button>
    </>
  );
};
