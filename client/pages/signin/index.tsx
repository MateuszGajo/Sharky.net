import React, { useEffect } from "react";
import { Checkbox, Icon, Message } from "semantic-ui-react";
import useTranslation from "next-translate/useTranslation";
import { Form, Formik } from "formik";
import cx from "classnames";
import { signinValidationSchema as validationSchema } from "~utils/utils";
import Loading from "~common/Loading/Loading";
import { useStore } from "~root/src/app/stores/store";
import SecondaryInput from "~common/secondaryInput/SecondaryInput";
import Authentication from "~layout/homeLayout/Authentication/Authentication";
import styles from "./signin.module.scss";
import { observer } from "mobx-react-lite";
import axios from "axios";
import { useRouter } from "next/router";

const Signin = () => {
  const router = useRouter();
  const { authenticationStore } = useStore();
  const {
    login,
    remebermeStatus,
    setRemeberme,
    loading: isLoading,
    creds,
    getCreds,
  } = authenticationStore;
  const { t } = useTranslation("signin");

  const remeberMeText = t("remeberMe");
  const forgotPasswordText = t("forgotPassword");
  const buttonText = t("button");
  const alternativeText = t("alternativeText");
  const PasswordText = t("password");
  const credsError = t("credsError");

  useEffect(() => getCreds(), []);

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
            onClick={() => {
              axios
                .post("http://localhost:5000/api/user/twitter")
                .then((resp) => router.push(resp.data))
                .catch((err) => console.log(err));
            }}
          />
        </div>
        <p className={styles.alternativeText}>{alternativeText}</p>
        <Formik
          initialValues={creds}
          onSubmit={(values, { setStatus }) =>
            login(values, setStatus, remebermeStatus)
          }
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
                      checked={remebermeStatus}
                      onChange={() => setRemeberme(!remebermeStatus)}
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

export async function getStaticProps() {
  return {
    props: {},
  };
}

export default observer(Signin);
