import { Flex, Divider, IconButton } from "@chakra-ui/react";
import { ArrowLeftIcon, ArrowRightIcon } from "uikit";

interface Props {
  handleLeftClick: () => void;
  handleRightClick: () => void;
}

const SwiperControl: React.FC<Props> = ({ handleLeftClick, handleRightClick }) => {
  const darkModeButtonProps = {
    color: "white",
    bg: "gray.700",
    bgColor: "gray.700",
    _hover: {
      bg: "gray.750",
      bgColor: "gray.750",
    },
    _active: {
      bg: "gray.850",
      bgColor: "gray.850",
    },
  };
  return (
    <Flex flexDirection="column">
      <Divider borderColor="gray.700" />
      <Flex justifyContent="flex-end">
        <IconButton
          onClick={handleLeftClick}
          aria-label="move to previous"
          colorScheme="gray"
          mr="2px"
          borderRadius={0}
          sx={darkModeButtonProps}
        >
          <ArrowLeftIcon />
        </IconButton>
        <IconButton
          sx={darkModeButtonProps}
          onClick={handleRightClick}
          aria-label="move to next"
          colorScheme="gray"
          borderRadius={0}
        >
          <ArrowRightIcon />
        </IconButton>
      </Flex>
    </Flex>
  );
};

export default SwiperControl;
