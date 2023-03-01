// import { CHAIN_INFO } from "@looksrare/sdk";
// import { useTranslation } from "react-i18next";
// import { ButtonProps, AddAltIcon } from "uikit";
// import { addTokenToWallet } from "utils/wallet";
// import { addresses } from "config/addresses";
// import { TextButton } from "./TextButton";




import { CHAIN_INFO } from "@looksrare/sdk";
import { useTranslation } from "react-i18next";
import { ButtonProps } from "uikit/Button/Button";
import { AddAltIcon } from "uikit";
import { addTokenToWallet } from "utils/wallet";
import { addresses } from "config/addresses";
import { TextButton } from "./TextButton";



interface Props extends WrapperProps {
  symbol: string;
  address: string;
  image: string;
}

interface WrapperProps extends ButtonProps {
  isRightIcon?: boolean;
}

const AddTokenToWalletButton: React.FC<Props> = ({ symbol, address, image, isRightIcon, children, ...props }) => {
  const { t } = useTranslation();
  return (
    <TextButton
      leftIcon={!isRightIcon ? <AddAltIcon /> : undefined}
      rightIcon={isRightIcon ? <AddAltIcon /> : undefined}
      onClick={() => addTokenToWallet(address, symbol, 18, image)}
      variant="ghost"
      colorScheme="gray"
      {...props}
    >
      {children || t("Add {{token}} to MetaMask", { token: symbol })}
    </TextButton>
  );
};

export const AddWethToWalletButton: React.FC<WrapperProps> = (props) => {
  return (
    <AddTokenToWalletButton
      symbol="WETH"
      address={addresses.WETH}
      image={`${CHAIN_INFO[1].appUrl}/images/tokens/WETH.png`}
      {...props}
    />
  );
};

export const AddLooksToWalletButton: React.FC<WrapperProps> = (props) => {
  return (
    <AddTokenToWalletButton
      symbol="LOOKS"
      address={addresses.LOOKS}
      image={`${CHAIN_INFO[1].appUrl}/images/tokens/LOOKS.png`}
      {...props}
    />
  );
};
