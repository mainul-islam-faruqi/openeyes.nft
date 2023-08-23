import { ReactElement } from "react";
import { Box, Flex, FlexProps, IconButton, GridItem, Skeleton, AspectRatio } from "@chakra-ui/react";
import { noop, times } from "lodash";
import { useTranslation } from "react-i18next";
import { Button, CloseIcon, InstagramIcon, Text, TwitterIcon } from "uikit";

export interface BaseSocialConnectButtonProps extends FlexProps {
  leftIcon: ReactElement;
  serviceName: string;
  handle?: string;
  onConnect: () => void;
  onRemove: () => void;
}

export const BaseSocialConnectButton = ({
  leftIcon,
  serviceName,
  handle,
  onConnect,
  onRemove,
  ...props
}: BaseSocialConnectButtonProps) => {
  const { t } = useTranslation();

  return (
    <Flex alignItems="center" border="1px solid" borderColor="border-01" title={serviceName} {...props}>
      <Box textAlign="center" width={12}>
        {leftIcon}
      </Box>
      {handle ? (
        <>
          <Text flex={1}>{handle}</Text>
          <IconButton aria-label="disconnect" colorScheme="gray" onClick={onRemove}>
            <CloseIcon />
          </IconButton>
        </>
      ) : (
        <Button width="100%" flex={1} colorScheme="gray" onClick={onConnect}>
          {t("Connect")}
        </Button>
      )}
    </Flex>
  );
};

export const TwitterConnectButton = (
  props: Omit<BaseSocialConnectButtonProps, "leftIcon" | "onConnect" | "onRemove" | "serviceName">
) => {
  const { t } = useTranslation();
  return (
    <BaseSocialConnectButton
      leftIcon={<TwitterIcon />}
      serviceName={t("Twitter")}
      onConnect={noop}
      onRemove={noop}
      {...props}
    />
  );
};

export const InstagramConnectButton = (
  props: Omit<BaseSocialConnectButtonProps, "leftIcon" | "onConnect" | "onRemove" | "serviceName">
) => {
  const { t } = useTranslation();
  return (
    <BaseSocialConnectButton
      leftIcon={<InstagramIcon />}
      serviceName={t("Instagram")}
      onConnect={noop}
      onRemove={noop}
      {...props}
    />
  );
};

export const NftGridLoader = ({ num = 6 }: { num?: number }) => (
  <>
    {times(num).map((n) => (
      <GridItem key={n}>
        <AspectRatio ratio={1}>
          <Skeleton width="100%" height="100%" />
        </AspectRatio>
      </GridItem>
    ))}
  </>
);
