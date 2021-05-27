import React, { useEffect, useState } from "react";
import { Checkbox, Icon, Message } from "semantic-ui-react";
import useTranslation from "next-translate/useTranslation";
import { Form, Formik } from "formik";
import cx from "classnames";
import { useRouter } from "next/router";
import { signinValidationSchema as validationSchema } from "~utils/utils";
import Loading from "~common/Loading/Loading";
import SecondaryInput from "~common/secondaryInput/SecondaryInput";
import Authentication from "~layout/homeLayout/Authentication/Authentication";
import { observer } from "mobx-react-lite";
import styles from "./signin.module.scss";
import { useAuthenticationStore } from "~root/src/app/providers/RootStoreProvider";
import PublicRoute from "../../src/features/routes/PublicRoute";
import GoogleLogin from "react-google-login";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";

const Signin = (props: any) => {
  const router = useRouter();
  const {
    login,
    remebermeStatus,
    setRemeberme,
    loading: isLoading,
    creds,
    getCreds,
    loginByGoogle,
    loginByFacebook,
  } = useAuthenticationStore();

  const [socialError, setSocialError] = useState(false);
  const [isGoogleUnavailable, setGoogleUnavailable] = useState(false);

  const { t } = useTranslation("signin");

  const remeberMeText = t("remeberMe");
  const forgotPasswordText = t("forgotPassword");
  const buttonText = t("button");
  const alternativeText = t("alternativeText");
  const PasswordText = t("password");
  const credsError = t("credsError");
  const socialErrorText = t("socialError");

  useEffect(() => {
    getCreds();
  }, []);

  const handleLogin = async (googleData: any) => {
    loginByGoogle(googleData.tokenId)
      .then(() => {
        router.push("/home");
      })
      .catch(() => setSocialError(true));
  };

  const handleError = async () => {
    setGoogleUnavailable(true);
  };

  const responseFacebook = async (response: any) => {
    const token = response.accessToken;
    loginByFacebook(token)
      .then(() => {
        router.push("/home");
      })
      .catch(() => setSocialError(true));
  };

  return (
    <Authentication>
      <div className={styles.container}>
        <div className={styles.iconContainer}>
          {!isGoogleUnavailable && (
            <GoogleLogin
              clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
              onSuccess={handleLogin}
              onFailure={handleError}
              render={(renderProps) => (
                <Icon
                  name="google"
                  size="large"
                  circular
                  className={cx(styles.icon, styles.googleIcon)}
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                />
              )}
              cookiePolicy={"single_host_origin"}
            />
          )}

          <FacebookLogin
            appId="487050989139304"
            callback={responseFacebook}
            render={(renderProps: any) => (
              <Icon
                name="facebook f"
                size="large"
                circular
                onClick={renderProps.onClick}
                className={cx(styles.icon, styles.facebookIcon)}
              />
            )}
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

export const getServerSideProps = () => {
  return {};
};

export default PublicRoute(observer(Signin));
