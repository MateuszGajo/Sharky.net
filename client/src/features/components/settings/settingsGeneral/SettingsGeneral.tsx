import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { Button, Divider, Segment } from "semantic-ui-react";
import { useSettingStore } from "~root/src/app/providers/RootStoreProvider";
import SettingsGeneralItem from "../settingsGeneralItem/SettingsGeneralItem";
import styles from "./SettingsGeneral.module.scss";

const SettingsContent = () => {
  const { getGeneral, firstname, lastname, isLoading } = useSettingStore();

  const generalSettings = [
    { name: "firstname", value: firstname },
    { name: "lastname", value: lastname },
  ];

  useEffect(() => {
    getGeneral();
  }, []);
  if (isLoading) return <Segment loading basic className={styles.loading} />;
  return (
    <div className={styles.container}>
      <div className={styles.settingsWrapper}>
        <div className={styles.tittle}>
          <h1> General Account Settings</h1>
        </div>
        <Divider className={styles.bigDivider} />
        <div className={styles.itemWrapper}>
          {generalSettings.map((item) => {
            return <SettingsGeneralItem item={item} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default observer(SettingsContent);
