import React, { useEffect, useState } from "react";
import { Checkbox, Icon, Message } from "semantic-ui-react";
import useTranslation from "next-translate/useTranslation";
import { Form, Formik } from "formik";
import cx from "classnames";
import axios from "axios";
import { useRouter } from "next/router";
import { signinValidationSchema as validationSchema } from "~utils/utils";
import Loading from "~common/Loading/Loading";
import { useStore } from "~root/src/app/stores/store";
import SecondaryInput from "~common/secondaryInput/SecondaryInput";
import Authentication from "~layout/homeLayout/Authentication/Authentication";
import { observer } from "mobx-react-lite";
import styles from "./signin.module.scss";

import { isNotLoggedIn } from "~utils/utils";

const Signin = (props: any) => {
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
  const socialErrorText = t("socialError");

  const [socialError, setSocialError] = useState(false);

  useEffect(() => {
    getCreds();
    if (router.query["error"]) {
      setSocialError(true);
      router.replace("/signin?error", "/signin", { shallow: true });
    }
  }, []);
  console.log(socialError);
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
  return (
    <Authentication>
      <div className={styles.container}>
        <div className={styles.iconContainer}>
          <Icon
            name="facebook f"
            size="large"
            circular
            className={cx(styles.icon, styles.facebookIcon)}
            onClick={() => {
              router.push(
                `https://www.facebook.com/v10.0/dialog/oauth?client_id=487050989139304&redirect_uri=${serverUrl}/api/user/facebook/callback`
              );
            }}
          />
          <Icon
            name="google"
            size="large"
            circular
            className={cx(styles.icon, styles.googleIcon)}
            onClick={() => {
              router.push(
                `https://accounts.google.com/o/oauth2/v2/auth?scope=email%20profile&response_type=code&redirect_uri=${serverUrl}/api/user/google/callback&client_id=24467567497-5u280n3sol5ihd15u09en4nn7567l93d.apps.googleusercontent.com`
              );
            }}
          />

          <Icon
            name="twitter"
            size="large"
            circular
            className={cx(styles.icon, styles.twitterIcon)}
            onClick={() => {
              axios
                .post(`${serverUrl}/api/user/twitter`)
                .then((resp) => router.push(resp.data))
                .catch((err) => console.log(err));
            }}
          />
        </div>
        {socialError && <p className={styles.socialError}>{socialErrorText}</p>}
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
                      className={cx(styles.helpersText, styles.checkbox)}
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

export const getServerSideProps = async ({ req }: any) => {
  return await isNotLoggedIn(req);
};

export default observer(Signin);
