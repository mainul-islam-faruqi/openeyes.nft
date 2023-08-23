import React from "react";
import { Box, BoxProps, useColorModeValue } from "@chakra-ui/react";
import Link from "next/link";
// import { LogoIcon, LogoLightIcon, StaticLogoLarge, StaticLogoLargeLight } from "uikit";
import { LogoIcon, LogoLightIcon, } from "uikit";

const Logo: React.FC<BoxProps> = (Props) => {
  // const logoWithText = useColorModeValue(<StaticLogoLargeLight />, <StaticLogoLarge />);
  const logoIconProps = { boxSize: 8, display: { base: "block", lg: "none" } };
  const logoAsIcon = useColorModeValue(<LogoLightIcon {...logoIconProps} />, <LogoIcon {...logoIconProps} />);
  return (
    <Box data-id="logo" {...Props}>
      <Link href="/">
        <a aria-label="Home page">
          <Box w="129px" display={{ base: "none", lg: "block" }}>
            {/* {logoWithText} */}
          </Box>
          <Box w="32px">{logoAsIcon}</Box>
        </a>
      </Link>
    </Box>
  );
};

export default Logo;
