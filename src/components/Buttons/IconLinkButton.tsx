import { IconButtonProps, forwardRef, IconButton } from "@chakra-ui/react";
import Link from "next/link";

interface IconLinkButtonProps extends IconButtonProps {
  href: string;
  isExternal?: boolean;
}

export const IconLinkButton = forwardRef<IconLinkButtonProps, "div">(
  ({ href, children, isExternal, "aria-label": ariaLabel, ...props }, ref) => {
    const linkProps: IconButtonProps = { "aria-label": ariaLabel, as: "a", variant: "ghost", colorScheme: "gray" };

    return (
      <>
        {isExternal ? (
          <IconButton ref={ref} href={href} target="_blank" rel="noopener noreferrer" {...linkProps} {...props}>
            {children}
          </IconButton>
        ) : (
          <Link href={href} passHref>
            <IconButton ref={ref} {...linkProps} {...props}>
              {children}
            </IconButton>
          </Link>
        )}
      </>
    );
  }
);
