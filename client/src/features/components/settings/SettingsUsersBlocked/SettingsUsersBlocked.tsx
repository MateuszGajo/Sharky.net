import React, { useEffect } from "react";
import { Divider, Icon, Segment } from "semantic-ui-react";
import { useSettingStore } from "~root/src/app/providers/RootStoreProvider";
import Card from "~components/card/Card";
import styles from "./SettingsUsersBlocked.module.scss";
import { observer } from "mobx-react-lite";
import useTranslation from "next-translate/useTranslation";
import { useMediaQuery } from "react-responsive";

const SettingsUsersBlocked = () => {
  const { t } = useTranslation("settings");
  const {
    getUsersBlockedList,
    isLoading,
    usersBlocked,
    unblock,
    closeContent,
  } = useSettingStore();

  useEffect(() => {
    getUsersBlockedList();
  }, []);

  const unblockUser = (id: string) => {
    unblock(id);
  };

  const isTabletOrMobileDevice = useMediaQuery({
    query: "(max-device-width: 1023px)",
  });

  return (
    <div className={styles.container}>
      {isLoading ? (
        <Segment loading basic className={styles.loading} />
      ) : (
        <>
          <div className={styles.title}>
            {isTabletOrMobileDevice && (
              <div className={styles.backIconContainer} onClick={closeContent}>
                <Icon name="arrow left" className={styles.backIcon} />
              </div>
            )}
            <h1 className={styles.titleText}> Blocked</h1>
          </div>
          <Divider />

          {usersBlocked.size === 0 && (
            <span className={styles.information}>{t("blocking.empty")}</span>
          )}
        </>
      )}
      {Array.from(usersBlocked.values()).map((userBlocked) => (
        <Card
          name={userBlocked.user.firstName + " " + userBlocked.user.lastName}
          referenceId={userBlocked.id}
          buttonText="Unblock"
          onButtonClick={unblockUser}
        />
      ))}
    </div>
  );
};

export default observer(SettingsUsersBlocked);
