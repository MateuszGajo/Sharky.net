import React, { ReactNode } from "react";
import { Grid } from "semantic-ui-react";
import Navbar from "~components/nav/Navbar";

const HomeLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Grid padded className="full-height">
      <Grid.Column width={3} className="grid-column-clear-space">
        <Navbar />
      </Grid.Column>
      <Grid.Column width={13}>{children}</Grid.Column>
    </Grid>
  );
};

export default HomeLayout;
