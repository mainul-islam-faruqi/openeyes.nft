import { useUserProfileDisplay } from "hooks/useUserProfileDisplay";
import { Text } from "uikit";
import { TextProps } from "uikit/Text/Text"
import { formatAddress } from "utils/format";

interface UserProfileDisplayProps extends TextProps {
  address: string;
  disableEnsDomain?: boolean;
  addressStartLength?: number;
  addressEndLength?: number;
}

export const UserProfileDisplay = ({
  address,
  disableEnsDomain = false,
  addressStartLength = 2,
  addressEndLength = 4,
  ...props
}: UserProfileDisplayProps) => {
  const userProfileDisplayQuery = useUserProfileDisplay(address);
  const displayName = (() => {
    const formattedAddress = formatAddress(address, addressStartLength, addressEndLength);
    if (disableEnsDomain) {
      return formattedAddress;
    }

    if (userProfileDisplayQuery.isSuccess) {
      return userProfileDisplayQuery.data.name || userProfileDisplayQuery.data.ensDomain || formattedAddress;
    }

    return formattedAddress;
  })();

  return <Text {...props}>{displayName}</Text>;
};
