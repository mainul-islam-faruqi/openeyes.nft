import { Grid, GridProps, ModalFooterProps } from "@chakra-ui/react";
import ModalFooter from "./ModalFooter";

export interface ModalFooterGridProps extends ModalFooterProps {
  gridProps?: GridProps;
}

export const ModalFooterGrid: React.FC<ModalFooterGridProps> = ({ children, gridProps, ...props }) => (
  <ModalFooter {...props}>
    <Grid width="100%" gridTemplateColumns="50% 50%" gridColumnGap="1px" {...gridProps}>
      {children}
    </Grid>
  </ModalFooter>
);
