import React, { useEffect } from "react";
import { Segment } from "semantic-ui-react";
import { useSettingStore } from "~root/src/app/providers/RootStoreProvider";
import Card from "~components/card/Card";
import styles from "./SettingsUsersBlocked.module.scss";
import { observer } from "mobx-react-lite";

const SettingsUsersBlocked = () => {
  const { getUsersBlockedList, isLoading, usersBlocked, unblock } =
    useSettingStore();
  useEffect(() => {
    getUsersBlockedList();
  }, []);

  const unblockUser = (id: string) => {
    unblock(id);
  };

  return (
    <div className={styles.container}>
      {isLoading && <Segment loading basic className={styles.loading} />}
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
