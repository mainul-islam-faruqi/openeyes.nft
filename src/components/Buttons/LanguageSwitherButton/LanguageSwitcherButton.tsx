// import { MenuItem, MenuList, MenuButton, useBreakpointValue, IconButton, Flex } from "@chakra-ui/react";
// import { useRouter } from "next/router";
// import { languageList } from "config";
// import { Button, ButtonProps, GlobeIcon } from "uikit";
// import { Menu } from "uikit/Menu";



import { MenuItem, MenuList, MenuButton, useBreakpointValue, IconButton, Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { languageList } from "config/localization";
import { Button, ButtonProps } from "uikit/Button/Button";
import { GlobeIcon } from "uikit";
import { Menu } from "uikit/Menu/Menu";


interface LanguageSwitcherButtonsProps extends ButtonProps {
  layoutFixed?: boolean;
}

export const LanguageSwitcherButtons = ({ layoutFixed = false, ...props }: LanguageSwitcherButtonsProps) => {
  const { asPath, push, locale = "en" } = useRouter();
  const showFullButtonText = useBreakpointValue(layoutFixed ? { base: true } : { base: false, xl: true });

  return (
    <Menu>
      {showFullButtonText ? (
        <MenuButton as={Button} variant="ghost" colorScheme="gray" data-id="menu-button" {...props}>
          <Flex alignItems="center">
            <GlobeIcon mr={1} />
            {languageList[locale].short}
          </Flex>
        </MenuButton>
      ) : (
        <MenuButton
          as={IconButton}
          variant="ghost"
          colorScheme="gray"
          data-id="menu-button"
          aria-label="Language switcher"
          {...props}
        >
          <GlobeIcon />
        </MenuButton>
      )}
      <MenuList>
        {Object.keys(languageList).map((languageKey) => {
          const handleClick = () => {
            push(asPath, undefined, { locale: languageKey });
          };

          return (
            <MenuItem key={languageKey} data-id="menu-item" onClick={handleClick}>
              {languageList[languageKey].name}
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
};
