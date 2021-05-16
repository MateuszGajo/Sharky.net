import React from "react";
import SettingsContent from "~components/settings/settingsContent/SettingsContent";
import SettingsMenu from "~components/settings/settingsMenu/SettingsMenu";
import HomeLayout from "~layout/homeLayout/HomeLayout";
import { isLoggedIn } from "~root/src/app/utils/utils";
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

export const getServerSideProps = async ({ req, ctx }: any) => {
  return await isLoggedIn(req);
};

export default index;
