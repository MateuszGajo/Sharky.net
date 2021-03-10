import React, { useState } from "react";
import { Checkbox, Icon } from "semantic-ui-react";
import SecondaryInput from "~common/secondaryInput/SecondaryInput";
import Authentication from "~layout/homeLayout/Authentication/Authentication";
import styles from "./signin.module.scss";
import useTranslation from "next-translate/useTranslation";
import { Form, Formik } from "formik";

const Signin = () => {
  const [creds, setCreds] = useState({ email: "", password: "" });
  const [isRemeberMeChecked, setRemeberMe] = useState(false);

  const { t } = useTranslation("signin");

  const remeberMeText = t("remeberMe");
  const forgotPasswordText = t("forgotPassword");
  const buttonText = t("button");
  const alternativeText = t("alternativeText");
  const PasswordText = t("password");

  const handleSubmit = (creds) => {
    console.log(creds);
  };

  return (
    <Authentication>
      <div className={styles.container}>
        <div className={styles.iconContainer}>
          <Icon
            name="facebook f"
            size="large"
            circular
            className={styles.icon}
          />
          <Icon name="twitter" size="large" circular className={styles.icon} />
          <Icon name="google" size="large" circular className={styles.icon} />
        </div>
        <p className={styles.alternativeText}>{alternativeText}</p>
        <Formik initialValues={creds} onSubmit={handleSubmit}>
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <SecondaryInput placeholder="E-mail" name="email" fluid />
              <SecondaryInput
                placeholder={PasswordText}
                type="password"
                name="password"
                fluid
              />
              <div className={styles.helpersContainer}>
                <Checkbox
                  label={remeberMeText}
                  className={styles.helpersText}
                  onChange={() => setRemeberMe(!remeberMeText)}
                />
                <p className={styles.helpersText}>{forgotPasswordText}</p>
              </div>
              <button className={styles.button}>{buttonText}</button>
            </Form>
          )}
        </Formik>
      </div>
    </Authentication>
  );
};

export default Signin;
