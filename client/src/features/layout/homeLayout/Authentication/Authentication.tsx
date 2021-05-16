import React from "react";
import { Grid } from "semantic-ui-react";
import styles from "./Authentication.module.scss";
import cx from "classnames";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";

interface Props {
  type?: string;
  children: React.ReactNode;
  DataKey?: string;
}

const Authentication: React.FC<Props> = ({ type = "signin", children }) => {
  const { t } = useTranslation("layout");

  const formTitle = t(
    `authentication.${type == "signin" ? "signinTitle" : "signupTitle"}`
  );
  const welcomeTitle = t("authentication.welcomeTitle");
  const welcomeText = t(
    `authentication.${
      type == "signin" ? "welcomeSigninText" : "welcomeSignupText"
    }`
  );
  const buttonText = t(
    `authentication.${
      type == "signin" ? "signupButtonText" : "signinButtonText"
    }`
  );

  return (
    <section className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.form}>
          <h1 className={styles.brand}>
            Sha<span className={styles.brandMix}>rky</span>
          </h1>
          <div className={styles.formContainer}>
            <h3 className={cx(styles.formTitle, styles.underline)}>
              {formTitle}
            </h3>
            <div
              className={cx(styles.content, {
                [styles.signupContent]: type == "signup",
              })}
            >
              {children}
            </div>
          </div>
        </div>
        <div className={styles.welcome}>
          <div className={styles.welcomeContainer}>
            <h3 className={cx(styles.welcomeTitle, styles.underline)}>
              {welcomeTitle}
            </h3>
            <p className={styles.welcomeText}>{welcomeText}</p>
            <div className={styles.buttonWrapper}>
              <button className={styles.welcomeButton}>
                <Link href={type === "signin" ? "/signup" : "/signin"}>
                  <span className="link-reset">{buttonText}</span>
                </Link>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Authentication;
