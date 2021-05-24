import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { Divider, Icon, Segment } from "semantic-ui-react";
import { useSettingStore } from "~root/src/app/providers/RootStoreProvider";
import SettingsGeneralItem from "../settingsGeneralItem/SettingsGeneralItem";
import styles from "./SettingsGeneral.module.scss";
import useTranslation from "next-translate/useTranslation";
import { useMediaQuery } from "react-responsive";

const SettingsContent = () => {
  const { t } = useTranslation("settings");
  const { getGeneral, firstname, lastname, isLoading, closeContent } =
    useSettingStore();

  const generalSettings = [
    {
      name: "firstname",
      displayName: t("general.firstname"),
      value: firstname,
    },
    { name: "lastname", displayName: t("general.lastname"), value: lastname },
  ];

  const title = t("general.title");

  const isTabletOrMobileDevice = useMediaQuery({
    query: "(max-device-width: 1023px)",
  });

  useEffect(() => {
    getGeneral();
  }, []);

  if (isLoading) return <Segment loading basic className={styles.loading} />;
  return (
    <div className={styles.container}>
      <div className={styles.settingsWrapper}>
        <div className={styles.title}>
          {isTabletOrMobileDevice && (
            <div className={styles.backIconContainer} onClick={closeContent}>
              <Icon name="arrow left" className={styles.backIcon} />
            </div>
          )}
          <h1 className={styles.titleText}> {title}</h1>
        </div>
        <Divider className={styles.bigDivider} />
        <div className={styles.itemWrapper}>
          {generalSettings.map((item) => {
            return <SettingsGeneralItem item={item} key={item.name} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default observer(SettingsContent);
