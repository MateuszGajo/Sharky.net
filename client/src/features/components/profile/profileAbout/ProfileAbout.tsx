import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import useTranslation from "next-translate/useTranslation";
import { useProfileStore } from "~root/src/app/providers/RootStoreProvider";
import styles from "./ProfileAbout.module.scss";

interface Items {
  id: number;
  name: string;
  value: String | number;
}

const ProfileAbout = () => {
  const { t } = useTranslation("profile");

  const { userDetails } = useProfileStore();
  const [items, setItems] = useState<Items[]>([{ id: 0, name: "", value: "" }]);

  const firstnameText = t("about.firstname");
  const lastnameText = t("about.lastname");
  const activitiesText = t("about.activities");
  const friendsText = t("about.friends");

  useEffect(() => {
    if (userDetails) {
      const { firstName, lastName, activitiesCount, friendsCount } =
        userDetails;
      const items = [
        { id: 1, name: firstnameText, value: firstName },
        { id: 2, name: lastnameText, value: lastName },
        { id: 3, name: activitiesText, value: activitiesCount },
        { id: 1, name: friendsText, value: friendsCount },
      ];
      setItems(items);
    }
  }, [userDetails]);
  return (
    <div className={styles.container}>
      <div className={styles.aboutContainer}>
        {items.map((item) => (
          <div className={styles.item} key={item.id}>
            <div className={styles.itemName}>
              <span>{item.name}</span>
            </div>
            <div className={styles.itemValue}>
              <span>{item.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default observer(ProfileAbout);
