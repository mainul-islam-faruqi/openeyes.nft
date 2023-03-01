import { Box, Flex } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { Text, UserGroupIcon } from "uikit";
import { TokenOwner } from "types/graphql";
import { useUserProfileDisplay } from "hooks/useUserProfileDisplay";
import { AvatarWithLink } from "components/Avatar";
import { ChatButton } from "components/Buttons";

interface Props {
  isErc1155: boolean;
  countOwners: number;
  erc721owner?: TokenOwner;
}

export const NftOwnerDetails: React.FC<Props> = ({ erc721owner, isErc1155, countOwners }) => {
  const { t } = useTranslation();

  const userProfileDisplayQuery = useUserProfileDisplay(erc721owner?.address || "", {
    enabled: !isErc1155,
  });

  return (
    <>
      <Flex alignItems="center" display="inline-flex" p={4} height={{ base: "auto", lg: 12 }}>
        {!isErc1155 && erc721owner && (
          <>
            <Text color="text-02" textStyle="detail" mr={2} flexShrink={0}>
              {`${t("Owner")}:`}
            </Text>
            <Box>
              <AvatarWithLink
                href={`/accounts/${erc721owner.address}`}
                flex={1}
                address={erc721owner.address}
                name={userProfileDisplayQuery.data?.name || userProfileDisplayQuery.data?.ensDomain || undefined}
                src={userProfileDisplayQuery.data?.image?.src}
                linkProps={{ isExternal: false, textStyle: "detail" }}
              />
            </Box>
            <ChatButton
              id="nft-owner-details-chat-button"
              address={erc721owner.address}
              tooltipText={t("Contact owner via Blockscan")}
              size="xs"
              ml={2}
            />
          </>
        )}
        {isErc1155 && (
          <>
            <Text color="text-02" textStyle="detail" mr={2}>
              {`${t("Owners")}:`}
            </Text>
            <UserGroupIcon boxSize="20px" color="link-01" mr={1} />
            <Text color="link-01" textStyle="detail" bold>
              {countOwners}
            </Text>
          </>
        )}
      </Flex>
    </>
  );
};
