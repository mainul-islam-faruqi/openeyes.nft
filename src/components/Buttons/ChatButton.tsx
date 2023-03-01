// import React from "react";
// import { IconButton } from "@chakra-ui/react";
// import { Link, MailIcon, Button, ButtonProps, TooltipText, Popover } from "uikit";
// import { CHAT_URL } from "config";




import React from "react";
import { IconButton } from "@chakra-ui/react";
import ButtonProps from "uikit/theme/components/Button";
import { Link } from "uikit/Link/Link";
import { MailIcon } from "uikit";
import { Button } from "uikit/Button/Button";
import { TooltipText } from "uikit/Text/Text";
import Popover from "uikit/Popover/Popover";
import { CHAT_URL } from "config/urls";



interface ChatButtonProps extends ButtonProps {
  address: string;
  tooltipText: string;
}

export const ChatButton: React.FC<ChatButtonProps> = ({ address, tooltipText, children, ...props }) => {
  return (
    <Popover label={<TooltipText>{tooltipText}</TooltipText>} placement="auto">
      {children ? (
        <Button
          as={Link}
          href={`${CHAT_URL}/index?a=${address}`}
          isExternal
          leftIcon={<MailIcon boxSize="20px" />}
          {...props}
        >
          {children}
        </Button>
      ) : (
        <IconButton
          aria-label="Contact the owner"
          as={Link}
          href={`${CHAT_URL}/index?a=${address}`}
          isExternal
          {...props}
        >
          <MailIcon boxSize="20px" />
        </IconButton>
      )}
    </Popover>
  );
};

ChatButton.defaultProps = {
  variant: "outline",
  colorScheme: "gray",
};
