// import React from "react";
// import { Flex, FlexProps, TagLabel, TagLeftIcon } from "@chakra-ui/react";
// import { useTranslation } from "react-i18next";
// import {
//   AddAltIcon,
//   MintIcon,
//   OfferIcon,
//   ShoppingCartIcon,
//   Text,
//   ArrowHorizontalIcon,
//   MisuseAltIcon,
//   Tag,
//   TagProps,
//   ViewOffIcon,
// } from "uikit";
// import { formatToSignificant } from "utils/format";
// import { isAddressEqual } from "utils/guards";
// import { STRATEGIES_ADDRESS } from "config";
// import { getCurrencyConfig } from "config/currencies";
// import { useUserProfileDisplay } from "hooks/useUserProfileDisplay";
// import { EventType, EventOrder } from "types/graphql";
// import { AvatarWithLink } from "components/Avatar";








import React from "react";
import { Flex, FlexProps, TagLabel, TagLeftIcon } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import {
  AddAltIcon,
  MintIcon,
  OfferIcon,
  ShoppingCartIcon,
  ArrowHorizontalIcon,
  MisuseAltIcon,
  ViewOffIcon,
} from "uikit/index";
import { Text } from "uikit/Text/Text";
import { Tag, TagProps } from "uikit/Tag/Tag";
import { formatToSignificant } from "utils/format";
import { isAddressEqual } from "utils/guards";
import { STRATEGIES_ADDRESS } from "config/addresses";
import { getCurrencyConfig } from "config/currencies";
import { useUserProfileDisplay } from "hooks/useUserProfileDisplay";
import { EventType, EventOrder } from "types/graphql";
import { AvatarWithLink } from "../Avatar/AvatarWithLink";









export const StandardOfferTag = (props: TagProps) => {
  const { t } = useTranslation();

  return (
    <Tag round size="sm" variant="outline" colorScheme="green" {...props}>
      <TagLeftIcon as={OfferIcon} boxSize={3} mr={1} />
      <TagLabel>{t("Offer")}</TagLabel>
    </Tag>
  );
};

export const CollectionOfferTag = (props: TagProps) => {
  const { t } = useTranslation();

  return (
    <Tag round size="sm" variant="outline" colorScheme="green" {...props}>
      <TagLeftIcon as={OfferIcon} boxSize={3} mr={1} />
      <TagLabel>{t("Collection")}</TagLabel>
    </Tag>
  );
};

interface SaleTagProps extends TagProps {
  isPrivate?: boolean;
}

export const SaleTag = ({ isPrivate, ...props }: SaleTagProps) => {
  const { t } = useTranslation();

  return (
    <Tag round size="sm" variant="outline" colorScheme="purple" {...props}>
      <TagLeftIcon as={ShoppingCartIcon} boxSize={3} mr={1} />
      <TagLabel>{isPrivate ? t("Private Sale") : t("Sale")}</TagLabel>
    </Tag>
  );
};

interface ListTagProps extends TagProps {
  isPrivate?: boolean;
}

export const ListTag = ({ isPrivate, ...props }: ListTagProps) => {
  const { t } = useTranslation();

  return (
    <Tag round size="sm" variant="outline" colorScheme="red" {...props}>
      <TagLeftIcon as={AddAltIcon} boxSize={3} mr={1} />
      <TagLabel> {isPrivate ? t("Private List") : t("List")}</TagLabel>
    </Tag>
  );
};

export const MintTag = (props: TagProps) => {
  const { t } = useTranslation();

  return (
    <Tag round size="sm" variant="outline" colorScheme="yellow" {...props}>
      <TagLeftIcon as={MintIcon} boxSize={3} mr={1} />
      <TagLabel>{t("Mint")}</TagLabel>
    </Tag>
  );
};

export const TransferTag = (props: TagProps) => {
  const { t } = useTranslation();

  return (
    <Tag round size="sm" variant="outline" colorScheme="blue" {...props}>
      <TagLeftIcon as={ArrowHorizontalIcon} boxSize={3} mr={1} />
      <TagLabel>{t("Transfer")}</TagLabel>
    </Tag>
  );
};

export const CancelListingTag = (props: TagProps) => {
  const { t } = useTranslation();

  return (
    <Tag round size="sm" variant="outline" colorScheme="gray" {...props}>
      <TagLeftIcon as={MisuseAltIcon} boxSize={3} mr={1} />
      <TagLabel>{t("Cancel Listing")}</TagLabel>
    </Tag>
  );
};

export const CancelOfferTag = (props: TagProps) => {
  const { t } = useTranslation();

  return (
    <Tag round size="sm" variant="outline" colorScheme="gray" {...props}>
      <TagLeftIcon as={MisuseAltIcon} boxSize={3} mr={1} />
      <TagLabel>{t("Cancel Offer")}</TagLabel>
    </Tag>
  );
};

export const HiddenOrderTag = (props: TagProps) => {
  const { t } = useTranslation();

  return (
    <Tag round size="sm" variant="outline" colorScheme="yellow" {...props}>
      <TagLeftIcon as={ViewOffIcon} boxSize={3} mr={1} />
      <TagLabel>{t("Hidden")}</TagLabel>
    </Tag>
  );
};

export interface ActivityTagProps extends TagProps {
  type: EventType;
  eventOrder?: EventOrder;
}

export const ActivityTag = ({ type, eventOrder, ...props }: ActivityTagProps) => {
  const isPrivateStrategy = isAddressEqual(eventOrder?.strategy, STRATEGIES_ADDRESS.private);

  switch (type) {
    case EventType.OFFER:
      return <StandardOfferTag {...props} />;
    case EventType.SALE:
      return <SaleTag isPrivate={isPrivateStrategy} {...props} />;
    case EventType.MINT:
      return <MintTag {...props} />;
    case EventType.TRANSFER:
      return <TransferTag {...props} />;
    case EventType.CANCEL_LIST:
      return <CancelListingTag {...props} />;
    case EventType.CANCEL_OFFER:
      return <CancelOfferTag {...props} />;
    case EventType.LIST:
    default:
      return <ListTag isPrivate={isPrivateStrategy} {...props} />;
  }
};

interface ActivityAmountProps extends Omit<FlexProps, "order"> {
  order: EventOrder;
}

export const ActivityAmount = ({ order, ...props }: ActivityAmountProps) => {
  const orderPrice = formatToSignificant(order.price, 4);
  const OrderCurrencyIcon = getCurrencyConfig(order.currency).icon;

  return (
    <Flex alignItems="center" {...props}>
      <OrderCurrencyIcon boxSize={5} width="10px" height="20px" mr={1} />
      <Text textStyle="detail" bold>
        {orderPrice}
      </Text>
    </Flex>
  );
};

interface ActivityOriginsProps extends FlexProps {
  label: string;
  address: string;
}

export const ActivityAddress = ({ label, address, ...props }: ActivityOriginsProps) => {
  const { data } = useUserProfileDisplay(address, { enabled: false });
  return (
    <Flex mr={4} {...props}>
      <Text textStyle="detail" color="text-03" mr={2}>
        {label}
      </Text>
      <AvatarWithLink
        href={`/accounts/${address}`}
        address={address}
        name={data?.name}
        src={data?.image?.src}
        ensDomain={data?.ensDomain}
        isVerified={data?.isVerified}
        linkProps={{ color: "text-02", textStyle: "detail", isExternal: false }}
        avatarProps={{ display: { base: "none", md: "block" } }}
      />
    </Flex>
  );
};
