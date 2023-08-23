import { Flex, HStack, TextProps, VStack } from "@chakra-ui/react";
import { Text, VerifiedIcon } from "uikit";
import { CopyAddress } from "components/CopyAddress";
import { User } from "types/graphql";
import { useUserEns } from "hooks/useUserProfileDisplay";
import { formatAddressUsername } from "utils/format";

interface UsernameAddressDisplayProps {
  user?: User;
  address: string;
  textProps?: TextProps;
}

export const UsernameAddressDisplay = ({ user, address, textProps = {} }: UsernameAddressDisplayProps) => {
  const { name, isVerified } = user || {};
  const { data: ensDomain } = useUserEns(address);

  const displayName = name || ensDomain || formatAddressUsername(address);

  return (
    <VStack w="100%" alignItems="flex-start" spacing={2}>
      <Flex align="center">
        <Text textStyle="display-body" bold {...textProps}>
          {displayName}
        </Text>
        {isVerified && <VerifiedIcon ml={2} boxSize={5} />}
      </Flex>
      <HStack border="1px solid" borderColor="border-01" borderRadius="4px" spacing={0}>
        {ensDomain && displayName !== ensDomain && (
          <Text textStyle="detail" bold px={3}>
            {ensDomain}
          </Text>
        )}
        <CopyAddress
          showCopyIcon={false}
          address={address}
          showEnsDomain={false}
          copyButtonProps={{ mr: 0, px: 3, py: 2, size: "xs" }}
        />
      </HStack>
    </VStack>
  );
};
