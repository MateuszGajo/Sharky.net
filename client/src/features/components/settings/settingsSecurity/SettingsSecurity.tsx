import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { Divider, Icon, Segment } from "semantic-ui-react";
import { useSettingStore } from "~root/src/app/providers/RootStoreProvider";
import SettingsSecurityItem from "../settingsSecurityItem/SettingsSecurityItem";
import styles from "./SettingsSecurity.module.scss";
import useTranslation from "next-translate/useTranslation";
import { useMediaQuery } from "react-responsive";

const SettingsSecurity = () => {
  const { t } = useTranslation("settings");
  const { isLoading, closeContent } = useSettingStore();
  const generalSettings = [
    { name: "email", value: "" },
    { name: "password", value: "" },
  ];

  const isTabletOrMobileDevice = useMediaQuery({
    query: "(max-device-width: 1023px)",
  });

  if (isLoading) return <Segment basic loading className={styles.loading} />;
  return (
    <div className={styles.container}>
      <Segment className={styles.table}>
        <div className={styles.title}>
          {isTabletOrMobileDevice && (
            <div className={styles.backIconContainer} onClick={closeContent}>
              <Icon name="arrow left" className={styles.backIcon} />
            </div>
          )}
          <h3 className={styles.titleText}>{t("security.login")}</h3>
        </div>
        <div className={styles.itemWrapper}>
          {generalSettings.map((item) => {
            return <SettingsSecurityItem item={item} key={item.name} />;
          })}
        </div>
      </Segment>
    </div>
  );
};

export default observer(SettingsSecurity);
