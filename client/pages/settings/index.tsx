import React from "react";
import SettingsContent from "~components/settings/settingsContent/SettingsContent";
import SettingsMenu from "~components/settings/settingsMenu/SettingsMenu";
import HomeLayout from "~layout/homeLayout/HomeLayout";
import { isLoggedIn } from "~root/src/app/utils/utils";
import styles from "./settings.module.scss";
import { useMediaQuery } from "react-responsive";
import { useSettingStore } from "~root/src/app/providers/RootStoreProvider";
import { observer } from "mobx-react-lite";

const index = () => {
  const { isContentOpen } = useSettingStore();
  const isTabletOrMobileDevice = useMediaQuery({
    query: "(max-device-width: 1023px)",
  });

  return (
    <HomeLayout>
      <div className={styles.container}>
        {isTabletOrMobileDevice ? (
          isContentOpen ? (
            <SettingsContent />
          ) : (
            <SettingsMenu />
          )
        ) : (
          <>
            <SettingsContent />
            <SettingsMenu />
          </>
        )}
      </div>
    </HomeLayout>
  );
};

export const getServerSideProps = async ({ req, ctx }: any) => {
  return await isLoggedIn(req);
};

export default observer(index);
