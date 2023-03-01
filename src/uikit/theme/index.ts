import { extendTheme, ThemeConfig } from "@chakra-ui/react";
import { createBreakpoints } from "@chakra-ui/theme-tools";
import { colors, semanticTokens } from "./colors";
import { global } from "./global";
import {
  Alert,
  Badge,
  Button,
  Checkbox,
  Divider,
  Drawer,
  Input,
  Link,
  Menu,
  Modal,
  Popover,
  Progress,
  Radio,
  Switch,
  Table,
  Tabs,
  Tag,
  Text,
  Textarea,
} from "./components";
import typography from "./typography";
import { breakpoints as breakpointsObject } from "./breakpoints";
import { layerStyles } from "./layerStyles";
import { textStyles } from "./textStyles";
import { sizes } from "./sizes";

const config: ThemeConfig = {
  initialColorMode: "dark", // Temporary for the landing page
  useSystemColorMode: false, // Temporary for the landing page
  cssVarPrefix: "lr",
};

const breakpoints = createBreakpoints(breakpointsObject);

/**
 * @see https://chakra-ui.com/docs/theming/theme
 */
export const theme = extendTheme({
  config,
  breakpoints,
  styles: { global },
  layerStyles,
  colors,
  semanticTokens,
  textStyles,
  sizes,
  components: {
    Alert,
    Badge,
    Button,
    Divider,
    Drawer,
    Checkbox,
    Input,
    Link,
    Menu,
    Modal,
    Popover,
    Progress,
    Radio,
    Switch,
    Table,
    Tabs,
    Tag,
    Text,
    Textarea,
  },
  ...typography,
});
