import { ReactElement } from "react";
import { forwardRef, Link as ChakraLink, LinkProps as ChakraLinkProps } from "@chakra-ui/react";
// import { LaunchOpenInNewIcon } from "uikit";
import { ArrowRightIcon } from "uikit";

export type LinkProps = ChakraLinkProps;
export interface ExternalLinkProps extends LinkProps {
  rightIcon?: ReactElement | null;
}

export const Link = forwardRef<LinkProps, "a">((props, ref) => <ChakraLink ref={ref} {...props} />);

const defaultRightIcon = <ArrowRightIcon ml={1} boxSize="1.2em" />;

export const ExternalLink = forwardRef<ExternalLinkProps, "a">(
  ({ children, rightIcon = defaultRightIcon, ...props }, ref) => (
    <Link display="flex" alignItems="center" isExternal ref={ref} {...props}>
      {children}
      {rightIcon}
    </Link>
  )
);

Link.defaultProps = {
  color: "link-01",
};
