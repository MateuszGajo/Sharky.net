import React from "react";
import styles from "./ProfileNotFound.module.scss";
import useTranslation from "next-translate/useTranslation";

const profileNotFound = () => {
  const { t } = useTranslation("profile");
  const notFound = t("notFound");
  return (
    <div className={styles.container}>
      <p className={styles.text}>{notFound}</p>
    </div>
  );
};

export default profileNotFound;
