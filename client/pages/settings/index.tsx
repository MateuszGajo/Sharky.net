import React from "react";
import SettingsContent from "~components/settings/settingsGeneral/SettingsGeneral";
import SettingsMenu from "~components/settings/settingsMenu/SettingsMenu";
import HomeLayout from "~layout/homeLayout/HomeLayout";
import styles from "./settings.module.scss";

const index = () => {
  return (
    <HomeLayout>
      <div className={styles.container}>
        <SettingsContent />
        <SettingsMenu />
      </div>
    </HomeLayout>
  );
};

export default index;
