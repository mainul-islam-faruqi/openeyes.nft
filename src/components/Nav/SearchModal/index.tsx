import { Modal } from "uikit";
import { ModalProps } from "uikit/Modal/Modal";
import InstantSearch from "./InstantSearch";
import { pageHeightRemMobile, pageHeightRemDesktop } from "uikit/theme/global";

export type ConnectWalletModalProps = Pick<ModalProps, "isOpen" | "onClose">;

const SearchModal = ({ isOpen, onClose }: ConnectWalletModalProps) => {
  return (
    <Modal
      modalContentProps={{
        alignSelf: "flex-start",
        mt: 0,
        mb: 0,
        width: { base: "100vw", md: "720px" },
        maxHeight: { base: pageHeightRemMobile, md: pageHeightRemDesktop },
        maxWidth: { md: "720px" },
        // align the search bar in the Modal with the search bar in the Nav
        position: { lg: "absolute" },
        left: { lg: "180px" },
      }}
      scrollBehavior="inside"
      isOpen={isOpen}
      onClose={onClose}
      hideHeader
    >
      <InstantSearch onClose={onClose} />
    </Modal>
  );
};

export default SearchModal;
