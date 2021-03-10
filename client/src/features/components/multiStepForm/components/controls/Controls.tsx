import React from "react";
import { Button, Container } from "semantic-ui-react";
import styles from "./Controls.module.scss";

const Controls = () => {
  return (
    <Container fluid>
      <button type="submit" className={styles.button}>
        Register
      </button>
    </Container>
  );
};

export default Controls;
