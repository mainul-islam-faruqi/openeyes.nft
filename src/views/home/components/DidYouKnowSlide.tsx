import { ReactNode } from "react";
import { Grid, GridItem } from "@chakra-ui/react";

interface Props {
  leftElement?: ReactNode;
  rightElement?: ReactNode;
}

const DidYouKnowSlide: React.FC<Props> = ({ leftElement, rightElement }) => {
  return (
    <Grid
      columnGap={12}
      gridTemplateAreas={{
        base: "'a' 'b'",
        md: "'a b'",
      }}
      gridTemplateColumns={{ base: "1fr", md: "2fr 1fr" }}
    >
      <GridItem gridArea="a" height="100%">
        {leftElement}
      </GridItem>
      <GridItem gridArea="b">{rightElement}</GridItem>
    </Grid>
  );
};

export default DidYouKnowSlide;
