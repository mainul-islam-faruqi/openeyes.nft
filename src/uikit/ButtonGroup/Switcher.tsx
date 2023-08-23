import { FC, forwardRef, PropsWithChildren } from "react";
import { Box, BoxProps } from "@chakra-ui/react";
import { Button, ButtonProps } from "uikit/Button/Button";

interface SwitcherButtonProps extends ButtonProps {
  isActive?: boolean;
}

export const SwitcherButton: FC<PropsWithChildren<SwitcherButtonProps>> = ({ isActive = false, ...props }) => (
  <Button size="xs" variant="solid" colorScheme={isActive ? "switcher-active" : "switcher"} {...props} />
);

export const Switcher = forwardRef<HTMLDivElement, BoxProps>((props, ref) => {
  return <Box ref={ref} display="inline-flex" bg="ui-02" borderRadius="container" p={1} {...props} />;
});

Switcher.displayName = "Switcher";
