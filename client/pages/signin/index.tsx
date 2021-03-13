import React, { useState } from "react";
import { Checkbox, Icon } from "semantic-ui-react";
import SecondaryInput from "~common/secondaryInput/SecondaryInput";
import Authentication from "~layout/homeLayout/Authentication/Authentication";
import styles from "./signin.module.scss";
import useTranslation from "next-translate/useTranslation";
import { Form, Formik } from "formik";
import cx from "classnames";
import { signinValidationSchema as validationSchema } from "~utils/utils";
import { signinFormValues as formValue } from "~root/src/app/models/user";

const Signin = () => {
  const [creds, setCreds] = useState({ email: "", password: "" });
  const [isRemeberMeChecked, setRemeberMe] = useState(false);

  const { t } = useTranslation("signin");

  const remeberMeText = t("remeberMe");
  const forgotPasswordText = t("forgotPassword");
  const buttonText = t("button");
  const alternativeText = t("alternativeText");
  const PasswordText = t("password");

  const handleSubmit = (creds: formValue) => {
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
            className={cx(styles.icon, styles.facebookIcon)}
          />
          <Icon
            name="google"
            size="large"
            circular
            c
            className={cx(styles.icon, styles.googleIcon)}
          />
          <Icon
            name="twitter"
            size="large"
            circular
            className={cx(styles.icon, styles.twitterIcon)}
          />
        </div>
        <p className={styles.alternativeText}>{alternativeText}</p>
        <Formik
          initialValues={creds}
          onSubmit={handleSubmit}
          validationSchema={validationSchema()}
        >
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
