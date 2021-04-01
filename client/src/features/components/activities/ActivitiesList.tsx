import React, { useEffect } from "react";
import styles from "./ActivitiesList.module.scss";
import { Container } from "semantic-ui-react";
import { useStore } from "~root/src/app/stores/store";
import ActivityItem from "./ActivityItem";
import { observer } from "mobx-react-lite";

const ActivitiesList = () => {
  const { activityStore, commonStore } = useStore();
  console.log(commonStore.getUser());
  const { getActivities, activities } = activityStore;

  useEffect(() => {
    getActivities();
  }, []);

  return (
    <div>
      <Container className={styles.container}>
        {Array.from(activities.values()).map((item) => (
          <ActivityItem key={item.id} item={item} />
        ))}
      </Container>
    </div>
  );
};

export default observer(ActivitiesList);