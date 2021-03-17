import React, { useEffect, useState } from "react";
import { Checkbox, Icon, Message } from "semantic-ui-react";
import SecondaryInput from "~common/secondaryInput/SecondaryInput";
import Authentication from "~layout/homeLayout/Authentication/Authentication";
import styles from "./signin.module.scss";
import useTranslation from "next-translate/useTranslation";
import { Form, Formik } from "formik";
import cx from "classnames";
import { signinValidationSchema as validationSchema } from "~utils/utils";
import { SigninFormValues as formValue } from "~root/src/app/models/user";
import agent from "~api/agent";
import router from "next/router";
import Loading from "~common/Loading/Loading";

const Signin = () => {
  const [creds, setCreds] = useState({ email: "", password: "" });
  const [isRemeberMeChecked, setRemeberMe] = useState(false);
  const [isLoading, setLoading] = useState(true);

  const { t } = useTranslation("signin");

  const remeberMeText = t("remeberMe");
  const forgotPasswordText = t("forgotPassword");
  const buttonText = t("button");
  const alternativeText = t("alternativeText");
  const PasswordText = t("password");
  const credsError = t("credsError");

  const handleSubmit = (
    creds: formValue,
    setFieldError: (msg: string) => void
  ) => {
    console.log(isRemeberMeChecked);
    agent.Account.login(creds, isRemeberMeChecked ? "true" : "false")
      .then(() => {
        if (isRemeberMeChecked) localStorage.setItem("creds", "true");
        else {
          localStorage.removeItem("creds");
        }
        router.push("/home");
      })
      .catch((err) => {
        const errors = err.response.data.errors;
        if (errors["error"]) {
          setFieldError("credsError");
        }
      });
  };

  useEffect(() => {
    if (localStorage.getItem("creds")) {
      agent.Account.creds()
        .then(({ data }) => {
          setCreds(data);
          setRemeberMe(true);
        })
        .catch(() => {
          localStorage.removeItem("creds");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

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
          onSubmit={(values, { setStatus }) => handleSubmit(values, setStatus)}
          validationSchema={validationSchema()}
          enableReinitialize
        >
          {({ handleSubmit, status }) => (
            <>
              {isLoading ? (
                <Loading />
              ) : (
                <Form onSubmit={handleSubmit}>
                  <SecondaryInput placeholder="E-mail" name="email" fluid />
                  <SecondaryInput
                    placeholder={PasswordText}
                    type="password"
                    name="password"
                    fluid
                  />
                  {status && (
                    <Message negative className={styles.errorContainer}>
                      <Message.Header>{credsError}</Message.Header>
                    </Message>
                  )}
                  <div className={styles.helpersContainer}>
                    <Checkbox
                      label={remeberMeText}
                      className={styles.helpersText}
                      checked={isRemeberMeChecked}
                      onChange={() => setRemeberMe(!isRemeberMeChecked)}
                    />
                    <p className={styles.helpersText}>{forgotPasswordText}</p>
                  </div>
                  <button className={styles.button}>{buttonText}</button>
                </Form>
              )}
            </>
          )}
        </Formik>
      </div>
    </Authentication>
  );
};

export default Signin;
