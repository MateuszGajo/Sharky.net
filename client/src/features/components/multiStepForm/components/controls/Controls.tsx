import { useFormikContext } from "formik";
import React from "react";
import { Container, Message } from "semantic-ui-react";
import styles from "./Controls.module.scss";
import cx from "classnames";
import useTranslation from "next-translate/useTranslation";

const Controls = () => {
  const { isValid, dirty, status } = useFormikContext();
  const { t } = useTranslation("signup");

  const serverErrorHeader = t("serverErrorHeader");
  const serverErrorParagraph = t("serverErrorParagraph");
  return (
    <Container fluid>
      {status === "serverError" && (
        <Message negative className={styles.errorContainer}>
          <Message.Header>{serverErrorHeader}</Message.Header>
          <p>{serverErrorParagraph}</p>
        </Message>
      )}
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
