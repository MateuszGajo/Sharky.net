import React, { useState } from "react";
import { Checkbox, Icon } from "semantic-ui-react";
import SecondaryInput from "~common/secondaryInput/SecondaryInput";
import Authentication from "~layout/homeLayout/Authentication/Authentication";
import styles from "./signin.module.scss";
import useTranslation from "next-translate/useTranslation";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { t } = useTranslation("signin");

  const remeberMeText = t("remeberMe");
  const forgotPasswordText = t("forgotPassword");
  const buttonText = t("button");
  const alternativeText = t("alternativeText");
  const PasswordText = t("password");
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
        <form>
          <SecondaryInput
            placeholder="E-mail"
            onChange={setEmail}
            value={email}
          />
          <SecondaryInput
            placeholder={PasswordText}
            type="password"
            value={password}
            onChange={setPassword}
          />
          <div className={styles.helpersContainer}>
            <Checkbox label={remeberMeText} className={styles.helpersText} />
            <p className={styles.helpersText}>{forgotPasswordText}</p>
          </div>
          <button className={styles.button}>{buttonText}</button>
        </form>
      </div>
    </Authentication>
  );
};

export default Signin;
