// import NextLink, { LinkProps } from "next/link";
// import { TextButton } from "components/Buttons";
// import { ButtonProps } from "uikit";



import NextLink, { LinkProps } from "next/link";
import { TextButton } from "../Buttons/TextButton";
import { ButtonProps } from "uikit/Button/Button";



export interface BackLinkProps extends LinkProps {
  children?: any;
  textButtonProps?: ButtonProps;
}

export const BackLink: React.FC<BackLinkProps> = ({ children, textButtonProps, ...props }) => (
  <NextLink {...props} passHref>
    <TextButton as="a" variant="ghost" color="link-01" size="xs" {...textButtonProps}>
      {children}
    </TextButton>
  </NextLink>
);
