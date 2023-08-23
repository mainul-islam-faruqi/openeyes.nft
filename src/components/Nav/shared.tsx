import { Flex, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { ReactNode } from "react";
import { IconProps, LinkProps, RainbowText } from "uikit";

interface DesktopNextLinkProps {
  href: string;
  isRainbow?: boolean;
}

export const DesktopNextLink: React.FC<DesktopNextLinkProps> = ({ href, isRainbow = false, children, ...props }) => {
  const { pathname } = useRouter();
  return (
    <NextLink href={href} passHref>
      <Link
        alignItems="center"
        display="flex"
        px={4}
        height={12}
        borderBottom="2px solid"
        borderBottomColor={pathname === href ? "interactive-01" : "transparent"}
        whiteSpace="nowrap"
        sx={{ _hover: { bg: "ui-01" } }}
        color="text-02"
        {...props}
      >
        {isRainbow ? (
          <RainbowText as="span" animate>
            {children}
          </RainbowText>
        ) : (
          children
        )}
      </Link>
    </NextLink>
  );
};

interface MobileLinkProps extends LinkProps {
  leftIcon?: (props: IconProps) => JSX.Element;
  rightIcon?: ReactNode;
}

export const MobileLink: React.FC<MobileLinkProps> = ({ leftIcon: LeftIcon, rightIcon, children, ...props }) => {
  return (
    <Link
      px={4}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      height={14}
      sx={{ _hover: { bg: "hover-ui" } }}
      {...props}
    >
      <Flex alignItems="center">
        {LeftIcon && <LeftIcon boxSize={6} mr={3} />}
        {children}
      </Flex>
      {rightIcon}
    </Link>
  );
};

interface MobileNextLinkProps extends MobileLinkProps {
  href: string;
}

export const MobileNextLink: React.FC<MobileNextLinkProps> = ({ href, ...props }) => (
  <NextLink href={href} passHref>
    <MobileLink {...props} />
  </NextLink>
);
