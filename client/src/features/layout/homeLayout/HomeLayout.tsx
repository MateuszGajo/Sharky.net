import React, { ReactNode } from "react";
import { Grid } from "semantic-ui-react";
import Navbar from "~components/nav/Navbar";
import Sidebar from "~components/sidebar/Sidebar";

interface Props {
  children: ReactNode;
  sidebar: boolean;
}

const HomeLayout: React.FC<Props> = ({ children, sidebar }) => {
  return (
    <Grid padded className="full-height">
      <Grid.Column width={3} className="grid-column-clear-space">
        <Navbar />
      </Grid.Column>
      <Grid.Column width={sidebar ? 11 : 13}>{children}</Grid.Column>
      {sidebar && (
        <Grid.Column width={2} className="grid-column-clear-space">
          <Sidebar />
        </Grid.Column>
      )}
    </Grid>
  );
};

export default HomeLayout;
