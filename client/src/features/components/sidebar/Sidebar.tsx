import React from "react";
import { Container, Feed } from "semantic-ui-react";
import styles from "./Sidebar.module.scss";

const Sidebar = () => {
  return (
    <Container className={styles.container}>
      <Feed className={styles.element}>
        <Feed.Event>
          <Feed.Label>
            <img src="https://react.semantic-ui.com/images/avatar/small/elliot.jpg" />
          </Feed.Label>
          <Feed.Content>
            <Feed.Summary className={styles.username}>
              Elliotuyu dsadasdasdada dsadasdasdasd
            </Feed.Summary>
          </Feed.Content>
        </Feed.Event>
      </Feed>
    </Container>
  );
};

export default Sidebar;
