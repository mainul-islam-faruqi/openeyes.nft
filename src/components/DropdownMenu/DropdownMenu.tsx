// import { MenuList as ChakraMenuList, MenuItem, MenuButtonProps, MenuListProps } from "@chakra-ui/menu";
// import { Portal } from "@chakra-ui/react";
// import { Menu, MenuButton } from "uikit/Menu";



import { MenuList as ChakraMenuList, MenuItem, MenuButtonProps, MenuListProps } from "@chakra-ui/menu";
import { Portal } from "@chakra-ui/react";
import { Menu } from "uikit/Menu/Menu";
import { MenuButton } from "uikit/Menu/MenuButton";



interface DropdownMenuProps extends MenuButtonProps {
  labels: string[];
  selectedLabel: string;
  handleSelect: (arg0: string) => void;
  listProps?: MenuListProps;
  size?: "sm" | "md";
  renderInPortal?: boolean;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  labels,
  selectedLabel,
  handleSelect,
  listProps,
  size,
  renderInPortal = true,
  ...props
}) => {
  const unselectedLabels = labels.filter((label) => label !== selectedLabel);

  const MenuList = (
    <ChakraMenuList width={{ base: "100%", md: "280px" }} {...listProps}>
      {unselectedLabels.map((label) => {
        return (
          <MenuItem key={label} onClick={() => handleSelect(label)}>
            {label}
          </MenuItem>
        );
      })}
    </ChakraMenuList>
  );

  return (
    <Menu size={size}>
      {({ isOpen }) => (
        <>
          <MenuButton isTruncated width={{ base: "100%", md: "280px" }} isOpen={isOpen} {...props}>
            {selectedLabel}
          </MenuButton>
          {renderInPortal ? <Portal>{MenuList}</Portal> : MenuList}
        </>
      )}
    </Menu>
  );
};

DropdownMenu.defaultProps = {
  size: "sm",
};
