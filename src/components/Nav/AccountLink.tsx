import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { useRouter } from "next/router";
import { Link as UikitLink, LinkProps as UikitLinkProps } from "uikit";

const Link: React.FC<UikitLinkProps> = ({ children, ...props }) => (
  <UikitLink
    alignItems="center"
    display="flex"
    bg="ui-02"
    color="text-01"
    px={4}
    py={3}
    mb="1px"
    sx={{
      _hover: {
        textDecoration: "none",
        bg: "hover-ui",
      },
    }}
    {...props}
  >
    {children}
  </UikitLink>
);

export interface AccountLinkProps extends Omit<NextLinkProps, "href"> {
  path: string;
  hash?: string;
  uikitLinkProps?: UikitLinkProps;
}

export const AccountLink: React.FC<AccountLinkProps> = ({ uikitLinkProps, children, path, hash, ...props }) => {
  const { pathname } = useRouter();

  // In order to correctly update the tab based on hash change, when a user is on the /accounts/[address] accounts page - use <a> tag hash routing.
  if (pathname === "/accounts/[address]") {
    return (
      <Link href={`${path}${hash || ""}`} {...uikitLinkProps}>
        {children}
      </Link>
    );
  }

  return (
    <NextLink passHref href={`${path}${hash || ""}`} {...props}>
      <Link {...uikitLinkProps}>{children}</Link>
    </NextLink>
  );
};
