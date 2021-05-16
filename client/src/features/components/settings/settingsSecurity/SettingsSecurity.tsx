import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { Divider, Segment } from "semantic-ui-react";
import { useSettingStore } from "~root/src/app/providers/RootStoreProvider";
import SettingsSecurityItem from "../settingsSecurityItem/SettingsSecurityItem";
import styles from "./SettingsSecurity.module.scss";

const SettingsSecurity = () => {
  const { isLoading } = useSettingStore();
  const generalSettings = [
    { name: "email", value: "" },
    { name: "password", value: "" },
  ];

  if (isLoading) return <Segment basic loading className={styles.loading} />;
  return (
    <div className={styles.container}>
      <Segment className={styles.table}>
        <div className={styles.title}>
          <h4>Login</h4>
        </div>
        <div className={styles.itemWrapper}>
          {generalSettings.map((item) => {
            return <SettingsSecurityItem item={item} />;
          })}
        </div>
      </Segment>
    </div>
  );
};

export default observer(SettingsSecurity);
