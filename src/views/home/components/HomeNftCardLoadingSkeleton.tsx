import { useTranslation } from "react-i18next";
import { Flex, Box, AspectRatio, TagLabel, Skeleton } from "@chakra-ui/react";
import { DiamondIcon, Tag, Text } from "uikit";

const HomeNftCardLoadingSkeleton: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Flex flexDirection="column" p={2}>
      <Box position="relative">
        <Box position="absolute" zIndex="docked" top={2}>
          <Tag borderRadius={0}>
            <TagLabel>
              <Flex alignItems="center">
                <DiamondIcon boxSize={5} mr={1} />
                <Text textStyle="detail" bold>
                  {t("Trending")}
                </Text>
              </Flex>
            </TagLabel>
          </Tag>
        </Box>
        <AspectRatio ratio={1}>
          <Skeleton />
        </AspectRatio>
      </Box>
      <Flex mt={4} justifyContent="space-between">
        <Flex flexDir="column">
          <Skeleton width="72px" height="16px" />
          <Skeleton width="140px" height="24px" mt={2} />
        </Flex>
        <Flex flexDir="column" alignItems="flex-end">
          <Skeleton width="60px" height="16px" />
          <Skeleton width="72px" height="24px" mt={2} />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default HomeNftCardLoadingSkeleton;
