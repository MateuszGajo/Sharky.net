import { useFormikContext } from "formik";
import React from "react";
import { Button, Container } from "semantic-ui-react";
import styles from "./Controls.module.scss";
import cx from "classnames";

const Controls = () => {
  const { isValid, dirty } = useFormikContext();
  return (
    <Container fluid>
      <button
        type="submit"
        className={cx(styles.button, {
          [styles.disabledButton]: !isValid || !dirty,
        })}
        onClick={(e) => {
          (!isValid || !dirty) && e.preventDefault();
        }}
      >
        Register
      </button>
    </Container>
  );
};

export default Controls;
